/**
 * Cliente API Aztlan 26
 * En producción usar NEXT_PUBLIC_API_URL=/api (proxy nginx).
 * Documentación (dev): http://76.13.126.149:5000/apidocs/
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://76.13.126.149:5000'

export type TipoRegistro = 'juvenil' | 'adultos' | 'masters'

/** Payload para POST /registro */
export interface RegistroPayload {
  tipoRegistro: TipoRegistro
  nombreCompleto: string
  email: string
  timestamp?: string
  sexo?: string
  cinta?: string
  nivelExperiencia?: string
  categoriaEdad?: string
  categoriaPeso?: string
  edad?: number
  categoriaPesoTipo?: 'varonil' | 'femenil'
}

/** Respuesta típica de POST /registro */
export interface RegistroResponse {
  nombreParticipante?: string
  mensaje: string
  statusCode?: number
  aztlan_id: string
  id?: string
}

/** Payload para POST /comprobante */
export interface ComprobantePayload {
  aztlan_id: string
  comprobante: string
  comprobante_filename: string
  comprobante_media_type: string
  comprobante_size_bytes: number
  timestamp?: string
}

/** Respuesta de POST /comprobante */
export interface ComprobanteResponse {
  success: boolean
  message: string
  referencia?: string
  timestamp?: string
}

/** Usuario tal como lo devuelve GET /usuarios */
export interface UsuarioApi {
  id: string
  aztlan_id: string
  tipoRegistro: TipoRegistro
  nombreCompleto: string
  email: string
  timestamp: string
  createdAt?: string
  sexo?: string
  cinta?: string
  nivelExperiencia?: string
  categoriaEdad?: string
  categoriaPeso?: string
  edad?: number
  categoriaPesoTipo?: 'varonil' | 'femenil'
  comprobanteAprobado: boolean
  comprobanteUrl: string | null
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const isJsonBody = typeof options.body === 'string'
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
    },
  })

  const text = await res.text()
  let data: T
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T)
  } catch {
    throw new Error(res.ok ? 'Respuesta inválida del servidor' : text || res.statusText)
  }

  if (!res.ok) {
    const err = data as { message?: string; error?: string }
    throw new Error(err.message || err.error || `Error ${res.status}`)
  }

  return data
}

/** POST /registro — Crear registro de participante */
export async function postRegistro(payload: RegistroPayload): Promise<RegistroResponse> {
  const body = {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  }
  return request<RegistroResponse>('/registro', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** POST /comprobante — Subir comprobante de pago */
export async function postComprobante(payload: ComprobantePayload): Promise<ComprobanteResponse> {
  const body = {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  }
  return request<ComprobanteResponse>('/comprobante', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/** GET /usuarios — Listar todos los usuarios */
export async function getUsuarios(): Promise<UsuarioApi[]> {
  return request<UsuarioApi[]>('/usuarios', { method: 'GET' })
}

/** PATCH /usuarios/:id — Aprobar comprobante */
export async function patchUsuarioAprobar(id: string): Promise<UsuarioApi> {
  return request<UsuarioApi>(`/usuarios/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ comprobanteAprobado: true }),
  })
}

/** DELETE /usuarios/:id — Eliminar usuario */
export async function deleteUsuario(id: string): Promise<void> {
  await request(`/usuarios/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
