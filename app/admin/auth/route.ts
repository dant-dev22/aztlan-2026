import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHmac, createHash, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'
const COOKIE_PAYLOAD = 'admin_logged_in'

function getAdminConfigStatus() {
  const secret = process.env.ADMIN_SESSION_SECRET
  return {
    user: process.env.ADMIN_USER,
    password: process.env.ADMIN_PASSWORD,
    hasUser: Boolean(process.env.ADMIN_USER),
    hasPassword: Boolean(process.env.ADMIN_PASSWORD),
    hasSecret: Boolean(secret),
    secretLength: secret?.length ?? 0,
  }
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 16 characters')
  }
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

function verify(token: string): boolean {
  try {
    const expected = sign(COOKIE_PAYLOAD)
    if (token.length !== expected.length) return false
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/admin',
    maxAge: 60 * 60 * 8, // 8 horas
  }
}

/** GET: comprobar si hay sesión válida */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token || !verify(token)) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}

/** POST: login con usuario y contraseña */
export async function POST(request: NextRequest) {
  try {
    const config = getAdminConfigStatus()
    const missing: string[] = []

    if (!config.hasUser) missing.push('ADMIN_USER')
    if (!config.hasPassword) missing.push('ADMIN_PASSWORD')
    if (!config.hasSecret || config.secretLength < 16) {
      missing.push('ADMIN_SESSION_SECRET')
    }

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Admin auth not configured: missing ${missing.join(', ')}` },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { username, password: givenPassword } = body
    if (typeof username !== 'string' || typeof givenPassword !== 'string') {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 })
    }

    const userOk = username.trim() === config.user
    const expectedHash = createHash('sha256').update(config.password!, 'utf8').digest()
    const givenHash = createHash('sha256').update(givenPassword, 'utf8').digest()
    const passOk = expectedHash.length === givenHash.length && timingSafeEqual(expectedHash, givenHash)
    if (!userOk || !passOk) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 })
    }

    const token = sign(COOKIE_PAYLOAD)
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, getCookieOptions())

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Admin login error:', e)
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}
