import type { UsuarioCompleto } from '@/app/hooks/useUsers'

const TIPO_REGISTRO_ORDER: Record<string, number> = { juvenil: 0, adultos: 1, masters: 2 }

const EDAD_ORDER: Record<string, number> = {
  'infantil-1': 0,
  'infantil-2': 1,
  adolescentes: 2,
  juveniles: 3,
}

const EDAD_LABELS: Record<string, string> = {
  'infantil-1': 'Infantil 1 (6-9 años)',
  'infantil-2': 'Infantil 2 (10-12 años)',
  adolescentes: 'Adolescentes (13-14 años)',
  juveniles: 'Juveniles (15-17 años)',
}

const NIVEL_ORDER: Record<string, number> = {
  principiante: 0,
  intermedio: 1,
  avanzado: 2,
}

const CINTA_ORDER_ADULTOS = ['blanca', 'azul', 'morada', 'cafe', 'negra']
const CINTA_ORDER_JUVENIL = ['blanca', 'gris', 'amarilla', 'naranja', 'verde', 'azul', 'morada']

function pesoSortValue(peso: string | undefined): number {
  if (!peso) return 0
  const t = peso.trim()
  if (t.startsWith('+')) {
    return 1000 + parseInt(t.slice(1), 10)
  }
  const n = parseInt(t, 10)
  return Number.isNaN(n) ? 0 : n
}

function nivelOrder(nivel: string | undefined): number {
  if (!nivel) return 99
  return NIVEL_ORDER[nivel.toLowerCase()] ?? 99
}

function cintaOrderIndex(u: UsuarioCompleto): number {
  const raw = (u.cinta || '').toLowerCase().trim()
  const order = u.tipoRegistro === 'juvenil' ? CINTA_ORDER_JUVENIL : CINTA_ORDER_ADULTOS
  const idx = order.indexOf(raw)
  return idx === -1 ? 999 : idx
}

export function etiquetaCategoria(u: UsuarioCompleto): string {
  if (u.tipoRegistro === 'juvenil') {
    const edad = u.categoriaEdad ? EDAD_LABELS[u.categoriaEdad] ?? u.categoriaEdad : ''
    const peso = u.categoriaPeso ? `${u.categoriaPeso} kg` : ''
    const nivel = u.nivelExperiencia?.toLowerCase() ?? ''
    return [edad, peso, nivel].filter(Boolean).join(' · ')
  }
  const peso = u.categoriaPeso ? `${u.categoriaPeso}kg` : ''
  const tipo = u.categoriaPesoTipo ?? ''
  const nivel = u.nivelExperiencia?.toLowerCase() ?? ''
  return [peso, tipo, nivel].filter(Boolean).join(' ')
}

/** Clave de sección en lista final: separa adultos y masters aunque compartan peso/división/nivel */
export function tituloGrupoListaFinal(u: UsuarioCompleto): string {
  if (u.tipoRegistro === 'juvenil') {
    return etiquetaCategoria(u) || 'Sin categoría'
  }
  const detalle = etiquetaCategoria(u)
  if (u.tipoRegistro === 'adultos') {
    return detalle ? `Adultos · ${detalle}` : 'Adultos'
  }
  if (u.tipoRegistro === 'masters') {
    return detalle ? `Masters · ${detalle}` : 'Masters'
  }
  return detalle || 'Sin categoría'
}

function claveOrdenCategoria(a: UsuarioCompleto): number[] {
  const tipo = TIPO_REGISTRO_ORDER[a.tipoRegistro] ?? 9
  if (a.tipoRegistro === 'juvenil') {
    const edad = EDAD_ORDER[a.categoriaEdad ?? ''] ?? 99
    const peso = pesoSortValue(a.categoriaPeso)
    const nivel = nivelOrder(a.nivelExperiencia)
    return [tipo, edad, peso, nivel]
  }
  const peso = pesoSortValue(a.categoriaPeso)
  const division = a.categoriaPesoTipo === 'femenil' ? 1 : 0
  const nivel = nivelOrder(a.nivelExperiencia)
  return [tipo, peso, division, nivel]
}

function compararTuplas(x: number[], y: number[]): number {
  const len = Math.max(x.length, y.length)
  for (let i = 0; i < len; i++) {
    const vx = x[i] ?? 0
    const vy = y[i] ?? 0
    if (vx !== vy) return vx - vy
  }
  return 0
}

export function compararParticipantesListaFinal(a: UsuarioCompleto, b: UsuarioCompleto): number {
  const cat = compararTuplas(claveOrdenCategoria(a), claveOrdenCategoria(b))
  if (cat !== 0) return cat
  const cinta = cintaOrderIndex(a) - cintaOrderIndex(b)
  if (cinta !== 0) return cinta
  return (a.nombreCompleto || '').localeCompare(b.nombreCompleto || '', 'es', {
    sensitivity: 'base',
  })
}

export type GrupoListaFinal = {
  titulo: string
  participantes: UsuarioCompleto[]
}

/** Mismo agrupamiento y orden que la página /lista-final */
export function agruparListaFinal(participantes: UsuarioCompleto[]): GrupoListaFinal[] {
  const copia = [...participantes]
  copia.sort(compararParticipantesListaFinal)

  const mapa = new Map<string, UsuarioCompleto[]>()
  for (const u of copia) {
    const titulo = tituloGrupoListaFinal(u)
    if (!mapa.has(titulo)) mapa.set(titulo, [])
    mapa.get(titulo)!.push(u)
  }

  const titulosOrdenados = Array.from(mapa.keys()).sort((ta, tb) => {
    const ua = mapa.get(ta)![0]
    const ub = mapa.get(tb)![0]
    return compararParticipantesListaFinal(ua, ub)
  })

  return titulosOrdenados.map((titulo) => ({
    titulo,
    participantes: mapa.get(titulo)!,
  }))
}
