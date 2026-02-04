// Tipos para extender la interfaz Window con nuestros registros de testing

interface RegistroAztlan {
  id: string
  tipoRegistro: 'juvenil' | 'adultos' | 'masters'
  nombreCompleto: string
  email: string
  timestamp: string
  // Campos para Infantil y Juvenil
  sexo?: string
  cinta?: string
  nivelExperiencia?: string
  categoriaEdad?: string
  categoriaPeso?: string
  // Campos para Adultos y Masters
  edad?: number
  categoriaPesoTipo?: 'varonil' | 'femenil'
}

/** Cuerpo para API de envío de comprobante (testing) */
export interface ComprobanteApiBody {
  aztlan_id: string
  comprobante: string
  comprobante_filename: string
  comprobante_media_type: string
  comprobante_size_bytes: number
  timestamp: string
}

/** Respuesta simulada de la API de comprobante */
export interface ComprobanteApiResponse {
  success: boolean
  message: string
  referencia?: string
  timestamp: string
}

export interface ComprobanteEnviadoTest {
  body: ComprobanteApiBody
  response: ComprobanteApiResponse
}

declare global {
  interface Window {
    registrosAztlan?: RegistroAztlan[]
    /** Último comprobante enviado (testing). Ver body y response. */
    comprobanteEnviadoTest?: ComprobanteEnviadoTest
  }
}

export {}
