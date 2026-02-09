import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createHmac, createHash, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'
const COOKIE_PAYLOAD = 'admin_logged_in'

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
    const user = process.env.ADMIN_USER
    const password = process.env.ADMIN_PASSWORD
    if (!user || !password) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { username, password: givenPassword } = body
    if (typeof username !== 'string' || typeof givenPassword !== 'string') {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 })
    }

    const userOk = username.trim() === user
    const expectedHash = createHash('sha256').update(password, 'utf8').digest()
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
