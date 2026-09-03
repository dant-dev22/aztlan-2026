import type { UsuarioApi } from './api'

const TORNEO_ACTUAL = '2026-b'

export type UsuarioListaFinal = Omit<UsuarioApi, 'comprobanteUrl' | 'email' | 'aztlan_id' | 'torneo' | 'createdAt'>

export interface CategoriaListaFinal {
  key: string
  titulo: string
  participantes: UsuarioListaFinal[]
}

const ORDEN_CINTA_JUVENIL: string[] = [
  'blanca',
  'gris-blanca',
  'gris',
  'gris-amarilla',
  'amarilla',
  'amarilla-naranja',
  'naranja',
  'naranja-verde',
  'verde',
]

const ORDEN_CINTA_ADULTOS: string[] = [
  'blanca',
  'azul',
  'morada',
  'cafe',
  'negra',
]

const CATEGORIAS_EDAD_LABEL: Record<string, string> = {
  'infantil-1': 'Infantil 1 (6-9 años)',
  'infantil-2': 'Infantil 2 (10-12 años)',
  'adolescentes': 'Adolescentes (13-15 años)',
  'juveniles': 'Juveniles (16-17 años)',
}

const NIVEL_EXPERIENCIA_LABEL: Record<string, string> = {
  principiante: 'principiante',
  intermedio: 'intermedio',
  avanzado: 'avanzado',
}

const TIPO_PESO_LABEL: Record<string, string> = {
  varonil: 'masculino',
  femenil: 'femenino',
}

function normalizarCinta(cinta?: string): string {
  if (!cinta) return ''
  return cinta
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

function ordenarPorCintaYNombre(
  participantes: UsuarioListaFinal[],
  ordenCinta: string[]
): UsuarioListaFinal[] {
  const indiceCinta = new Map(ordenCinta.map((c, i) => [c, i]))
  return [...participantes].sort((a, b) => {
    const ia = indiceCinta.get(normalizarCinta(a.cinta)) ?? ordenCinta.length
    const ib = indiceCinta.get(normalizarCinta(b.cinta)) ?? ordenCinta.length
    if (ia !== ib) return ia - ib
    return a.nombreCompleto.localeCompare(b.nombreCompleto, 'es-MX')
  })
}

function buildKeyJuvenil(u: UsuarioListaFinal): string {
  return [
    u.tipoRegistro,
    u.categoriaEdad ?? 'sin-categoria-edad',
    u.categoriaPeso ?? 'sin-peso',
    u.nivelExperiencia ?? 'sin-nivel',
  ].join('|')
}

function buildTituloJuvenil(u: UsuarioListaFinal): string {
  const edadLabel = u.categoriaEdad
    ? CATEGORIAS_EDAD_LABEL[u.categoriaEdad] ?? u.categoriaEdad
    : 'Sin categoría de edad'
  const peso = u.categoriaPeso ? `${u.categoriaPeso} kg` : 'Sin peso'
  const nivel = u.nivelExperiencia
    ? NIVEL_EXPERIENCIA_LABEL[u.nivelExperiencia] ?? u.nivelExperiencia
    : 'Sin nivel'
  return `${edadLabel} · ${peso} · ${nivel}`
}

function buildKeyAdultosMasters(u: UsuarioListaFinal): string {
  return [
    u.tipoRegistro,
    u.categoriaPeso ?? 'sin-peso',
    u.categoriaPesoTipo ?? 'sin-tipo-peso',
    u.nivelExperiencia ?? 'sin-nivel',
  ].join('|')
}

function buildTituloAdultosMasters(u: UsuarioListaFinal): string {
  const raiz = u.tipoRegistro === 'masters' ? 'Masters' : 'Adultos'
  const peso = u.categoriaPeso ? `${u.categoriaPeso}kg` : 'Sin peso'
  const tipo = u.categoriaPesoTipo
    ? TIPO_PESO_LABEL[u.categoriaPesoTipo] ?? u.categoriaPesoTipo
    : ''
  const nivel = u.nivelExperiencia
    ? NIVEL_EXPERIENCIA_LABEL[u.nivelExperiencia] ?? u.nivelExperiencia
    : 'Sin nivel'
  return [raiz, [peso, tipo, nivel].filter(Boolean).join(' ')].filter(Boolean).join(' · ')
}

export function buildListaFinal(usuarios: UsuarioApi[]): CategoriaListaFinal[] {
  const aprobados = usuarios.filter(
    (u) => u.torneo === TORNEO_ACTUAL && u.comprobanteAprobado === true
  )

  const porCategoria = new Map<string, CategoriaListaFinal>()

  for (const u of aprobados) {
    const resumido: UsuarioListaFinal = {
      id: u.id,
      tipoRegistro: u.tipoRegistro,
      nombreCompleto: u.nombreCompleto,
      equipo: u.equipo,
      timestamp: u.timestamp,
      sexo: u.sexo,
      cinta: u.cinta,
      nivelExperiencia: u.nivelExperiencia,
      categoriaEdad: u.categoriaEdad,
      categoriaPeso: u.categoriaPeso,
      edad: u.edad,
      categoriaPesoTipo: u.categoriaPesoTipo,
      comprobanteAprobado: u.comprobanteAprobado,
    }

    const esJuvenil = u.tipoRegistro === 'juvenil'
    const key = esJuvenil ? buildKeyJuvenil(resumido) : buildKeyAdultosMasters(resumido)
    if (!porCategoria.has(key)) {
      const titulo = esJuvenil ? buildTituloJuvenil(resumido) : buildTituloAdultosMasters(resumido)
      porCategoria.set(key, { key, titulo, participantes: [] })
    }
    porCategoria.get(key)!.participantes.push(resumido)
  }

  const categorias = Array.from(porCategoria.values())

  for (const cat of categorias) {
    const ordenCinta = cat.participantes[0]?.tipoRegistro === 'juvenil'
      ? ORDEN_CINTA_JUVENIL
      : ORDEN_CINTA_ADULTOS
    cat.participantes = ordenarPorCintaYNombre(cat.participantes, ordenCinta)
  }

  categorias.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es-MX'))

  return categorias
}

export function buildCsvListaFinal(categorias: CategoriaListaFinal[]): string {
  const headers = [
    'Categoria',
    'No.',
    'Cinta',
    'Nombre completo',
    'Academia / Equipo',
  ]
  const escape = (v: string | number | null | undefined): string => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }
  const lines = [headers.join(',')]
  for (const cat of categorias) {
    cat.participantes.forEach((p, idx) => {
      lines.push([
        escape(cat.titulo),
        escape(idx + 1),
        escape(p.cinta ?? ''),
        escape(p.nombreCompleto),
        escape(p.equipo ?? ''),
      ].join(','))
    })
  }
  return lines.join('\r\n')
}
