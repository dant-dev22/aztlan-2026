'use client'

import { useState, useEffect, useCallback } from 'react'

// Tipo base del registro (sin comprobanteAprobado)
interface RegistroAztlan {
  id: string
  tipoRegistro: 'infantil' | 'juvenil' | 'adultos' | 'masters'
  nombreCompleto: string
  email: string
  timestamp: string
  sexo?: string
  cinta?: string
  nivelExperiencia?: string
  categoriaEdad?: string
  categoriaPeso?: string
  edad?: number
  categoriaPesoTipo?: 'varonil' | 'femenil'
}

export interface UsuarioCompleto extends RegistroAztlan {
  comprobanteAprobado?: boolean
  comprobanteUrl?: string
}

// Datos de ejemplo por defecto
const usuariosEjemplo: UsuarioCompleto[] = [
  {
    id: 'ejemplo_1',
    tipoRegistro: 'infantil',
    nombreCompleto: 'María González López',
    email: 'maria.gonzalez@email.com',
    timestamp: new Date('2026-01-15T10:30:00').toISOString(),
    sexo: 'femenino',
    cinta: 'Amarilla',
    nivelExperiencia: 'principiante',
    categoriaEdad: 'infantil-1',
    categoriaPeso: '-25',
    comprobanteAprobado: false,
  },
  {
    id: 'ejemplo_2',
    tipoRegistro: 'juvenil',
    nombreCompleto: 'Carlos Ramírez Martínez',
    email: 'carlos.ramirez@email.com',
    timestamp: new Date('2026-01-16T14:20:00').toISOString(),
    sexo: 'masculino',
    cinta: 'Naranja',
    nivelExperiencia: 'intermedio',
    categoriaEdad: 'juveniles',
    categoriaPeso: '-60',
    comprobanteAprobado: true,
  },
  {
    id: 'ejemplo_3',
    tipoRegistro: 'adultos',
    nombreCompleto: 'Ana Sofía Hernández',
    email: 'ana.hernandez@email.com',
    timestamp: new Date('2026-01-17T09:15:00').toISOString(),
    edad: 28,
    sexo: 'femenino',
    nivelExperiencia: 'avanzado',
    categoriaPeso: '-55',
    categoriaPesoTipo: 'femenil',
    comprobanteAprobado: false,
  },
  {
    id: 'ejemplo_4',
    tipoRegistro: 'adultos',
    nombreCompleto: 'Roberto Sánchez Díaz',
    email: 'roberto.sanchez@email.com',
    timestamp: new Date('2026-01-18T16:45:00').toISOString(),
    edad: 32,
    sexo: 'masculino',
    nivelExperiencia: 'intermedio',
    categoriaPeso: '-79',
    categoriaPesoTipo: 'varonil',
    comprobanteAprobado: true,
  },
  {
    id: 'ejemplo_5',
    tipoRegistro: 'masters',
    nombreCompleto: 'Patricia Morales Vega',
    email: 'patricia.morales@email.com',
    timestamp: new Date('2026-01-19T11:00:00').toISOString(),
    edad: 45,
    sexo: 'femenino',
    nivelExperiencia: 'avanzado',
    categoriaPeso: '-60',
    categoriaPesoTipo: 'femenil',
    comprobanteAprobado: false,
  },
  {
    id: 'ejemplo_6',
    tipoRegistro: 'infantil',
    nombreCompleto: 'Diego Torres Jiménez',
    email: 'diego.torres@email.com',
    timestamp: new Date('2026-01-20T13:30:00').toISOString(),
    sexo: 'masculino',
    cinta: 'Blanca',
    nivelExperiencia: 'principiante',
    categoriaEdad: 'infantil-2',
    categoriaPeso: '-30',
    comprobanteAprobado: false,
  },
  {
    id: 'ejemplo_7',
    tipoRegistro: 'juvenil',
    nombreCompleto: 'Valentina Castro Ruiz',
    email: 'valentina.castro@email.com',
    timestamp: new Date('2026-01-21T08:20:00').toISOString(),
    sexo: 'femenino',
    cinta: 'Verde',
    nivelExperiencia: 'avanzado',
    categoriaEdad: 'adolescentes',
    categoriaPeso: '-45',
    comprobanteAprobado: true,
  },
  {
    id: 'ejemplo_8',
    tipoRegistro: 'masters',
    nombreCompleto: 'Fernando López García',
    email: 'fernando.lopez@email.com',
    timestamp: new Date('2026-01-22T15:10:00').toISOString(),
    edad: 52,
    sexo: 'masculino',
    nivelExperiencia: 'avanzado',
    categoriaPeso: '-85',
    categoriaPesoTipo: 'varonil',
    comprobanteAprobado: false,
  },
]

export function useUsers() {
  const [usuarios, setUsuarios] = useState<UsuarioCompleto[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar usuarios desde localStorage al montar
  useEffect(() => {
    const cargarUsuarios = () => {
      try {
        const registrosLocalStorage = JSON.parse(
          localStorage.getItem('registrosAztlan') || '[]'
        )
        
        // Si no hay usuarios en localStorage, usar datos de ejemplo
        let usuariosCompletos: UsuarioCompleto[]
        
        if (registrosLocalStorage.length === 0) {
          // Usar datos de ejemplo por defecto
          usuariosCompletos = usuariosEjemplo
          // Guardar los datos de ejemplo en localStorage
          localStorage.setItem('registrosAztlan', JSON.stringify(usuariosEjemplo))
        } else {
          // Convertir a UsuarioCompleto con comprobanteAprobado en false por defecto
          usuariosCompletos = registrosLocalStorage.map((reg: any) => ({
            ...reg,
            comprobanteAprobado: reg.comprobanteAprobado || false,
          }))
        }
        
        setUsuarios(usuariosCompletos)
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        // En caso de error, usar datos de ejemplo
        setUsuarios(usuariosEjemplo)
      } finally {
        setLoading(false)
      }
    }

    cargarUsuarios()
  }, [])

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('registrosAztlan', JSON.stringify(usuarios))
      } catch (error) {
        console.error('Error al guardar usuarios:', error)
      }
    }
  }, [usuarios, loading])

  const eliminarUsuario = useCallback((id: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const aprobarComprobante = useCallback((id: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, comprobanteAprobado: true } : u))
    )
  }, [])

  const actualizarUsuarios = useCallback((nuevosUsuarios: UsuarioCompleto[]) => {
    setUsuarios(nuevosUsuarios)
  }, [])

  return {
    usuarios,
    loading,
    eliminarUsuario,
    aprobarComprobante,
    actualizarUsuarios,
  }
}
