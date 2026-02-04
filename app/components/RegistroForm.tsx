'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'

export type TipoRegistro = 'juvenil' | 'adultos' | 'masters'

interface RegistroFormProps {
  tipoRegistro: TipoRegistro
  titulo?: string
  descripcion?: string
  camposPersonalizados?: Record<string, any>
}

// Opciones para Infantil y Juvenil
const categoriasEdadInfantilJuvenil = [
  { value: 'infantil-1', label: 'Infantil 1 (6-9 años)' },
  { value: 'infantil-2', label: 'Infantil 2 (10-12 años)' },
  { value: 'adolescentes', label: 'Adolescentes (13-14 años)' },
  { value: 'juveniles', label: 'Juveniles (15-17 años)' },
]

const categoriasPesoInfantilJuvenil = [
  '-20',
  '-25',
  '-30',
  '-35',
  '-45',
  '-50',
  '-55',
  '-60',
  '-65',
  '-70',
  '+70',
]

const nivelesExperienciaInfantilJuvenil = [
  'Principiante',
  'Intermedio',
  'Avanzado',
]

// Opciones para Adultos y Masters
const nivelesExperienciaAdultosMasters = ['Principiante', 'Intermedio', 'Avanzado']

const categoriasPesoVaronil = ['-65', '-73', '-79', '-85', '-91', '-100', '+100']
const categoriasPesoFemenil = ['-50', '-55', '-60', '-65', '-70', '+70']

export default function RegistroForm({
  tipoRegistro,
  titulo,
  descripcion,
  camposPersonalizados = {},
}: RegistroFormProps) {
  const esInfantilJuvenil = tipoRegistro === 'juvenil'
  const esAdultosMasters = tipoRegistro === 'adultos' || tipoRegistro === 'masters'

  // Estado para pestañas de peso en adultos/masters
  const [pesoTab, setPesoTab] = useState<'varonil' | 'femenil'>('varonil')

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    sexo: '',
    edad: '',
    categoriaEdad: '',
    cinta: '',
    nivelExperiencia: '',
    categoriaPeso: '',
    ...camposPersonalizados,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [respuestaBackend, setRespuestaBackend] = useState<{
    nombreParticipante: string
    mensaje: string
    statusCode: number
    aztlan_id: string
  } | null>(null)
  const successMessageRef = useRef<HTMLDivElement>(null)

  // Scroll automático al mensaje de éxito cuando aparezca
  useEffect(() => {
    if (submitStatus === 'success' && successMessageRef.current) {
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
    }
  }, [submitStatus])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Función para preparar los datos antes de enviarlos
  const prepararDatosEnvio = () => {
    const datosBase = {
      tipoRegistro,
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      timestamp: new Date().toISOString(),
    }

    if (esInfantilJuvenil) {
      return {
        ...datosBase,
        sexo: formData.sexo,
        cinta: formData.cinta,
        nivelExperiencia: formData.nivelExperiencia,
        categoriaEdad: formData.categoriaEdad,
        categoriaPeso: formData.categoriaPeso,
      }
    }

    if (esAdultosMasters) {
      return {
        ...datosBase,
        edad: parseInt(formData.edad),
        sexo: formData.sexo,
        nivelExperiencia: formData.nivelExperiencia,
        categoriaPeso: formData.categoriaPeso,
        categoriaPesoTipo: pesoTab, // 'varonil' o 'femenil'
      }
    }

    return datosBase
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Preparar los datos del formulario
      const datosEnvio = prepararDatosEnvio()

      // ============================================
      // CÓDIGO PARA ENVIAR AL ENDPOINT (COMENTADO)
      // ============================================
      // 
      // const ENDPOINT_URL = '/api/registro' // o la URL de tu endpoint
      // 
      // const response = await fetch(ENDPOINT_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(datosEnvio),
      // })
      // 
      // if (!response.ok) {
      //   throw new Error(`Error en la respuesta: ${response.status}`)
      // }
      // 
      // const resultado = await response.json()
      // // La respuesta debe tener: nombreParticipante, mensaje, statusCode, aztlan_id
      // console.log('Respuesta del servidor:', resultado)
      // 
      // // Guardar la respuesta del backend
      // setRespuestaBackend({
      //   nombreParticipante: resultado.nombreParticipante,
      //   mensaje: resultado.mensaje,
      //   statusCode: resultado.statusCode,
      //   aztlan_id: resultado.aztlan_id,
      // })
      //
      // ============================================
      // ALTERNATIVA CON AXIOS (si prefieres usarlo):
      // ============================================
      // 
      // import axios from 'axios'
      // 
      // const response = await axios.post(ENDPOINT_URL, datosEnvio, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      // 
      // // La respuesta debe tener: nombreParticipante, mensaje, statusCode, aztlan_id
      // console.log('Respuesta del servidor:', response.data)
      // 
      // // Guardar la respuesta del backend
      // setRespuestaBackend({
      //   nombreParticipante: response.data.nombreParticipante,
      //   mensaje: response.data.mensaje,
      //   statusCode: response.status,
      //   aztlan_id: response.data.aztlan_id,
      // })
      //
      // ============================================

      // Por ahora, guardar en window para testing
      // Simulando respuesta del backend para testing
      if (typeof window !== 'undefined') {
        // Inicializar el objeto si no existe
        if (!window.registrosAztlan) {
          window.registrosAztlan = []
        }

        // Generar un aztlan_id simulado para testing
        const aztlanIdSimulado = `AZT${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

        // Agregar el registro con un ID único
        const registro = {
          id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...datosEnvio,
        }

        window.registrosAztlan.push(registro)

        // También guardar en localStorage para persistencia
        try {
          const registrosLocalStorage = JSON.parse(
            localStorage.getItem('registrosAztlan') || '[]'
          )
          registrosLocalStorage.push(registro)
          localStorage.setItem('registrosAztlan', JSON.stringify(registrosLocalStorage))
        } catch (localStorageError) {
          console.warn('No se pudo guardar en localStorage:', localStorageError)
        }

        // Simular respuesta del backend para testing
        setRespuestaBackend({
          nombreParticipante: formData.nombreCompleto,
          mensaje: 'Registro iniciado con éxito',
          statusCode: 200,
          aztlan_id: aztlanIdSimulado,
        })

        console.log('Registro guardado en window.registrosAztlan:', registro)
        console.log('Total de registros:', window.registrosAztlan.length)
        console.log('Para ver todos los registros, ejecuta: window.registrosAztlan')
      }

      // Simular un pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSubmitStatus('success')

      // Limpiar el formulario después de un éxito (pero mantener la respuesta del backend)
      setTimeout(() => {
        setFormData({
          nombreCompleto: '',
          email: '',
          sexo: '',
          edad: '',
          categoriaEdad: '',
          cinta: '',
          nivelExperiencia: '',
          categoriaPeso: '',
          ...camposPersonalizados,
        })
        if (esAdultosMasters) {
          setPesoTab('varonil')
        }
        // No limpiar respuestaBackend para que el usuario pueda ver su aztlan_id
      }, 2000)
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tituloDefault =
    titulo || `Registro ${tipoRegistro.charAt(0).toUpperCase() + tipoRegistro.slice(1)}`
  const descripcionDefault =
    descripcion ||
    `Completa el siguiente formulario para registrarte en la categoría ${tipoRegistro}`

  return (
    <div className="w-full">
      <div className="bg-warm-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-primary-text">
            {tituloDefault}
          </h1>
          <p className="text-base sm:text-lg text-secondary-text">{descripcionDefault}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre Completo - Todos los formularios */}
          <div>
            <label
              htmlFor="nombreCompleto"
              className="block text-sm font-medium text-primary-text mb-2"
            >
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          {/* Correo Electrónico - Todos los formularios */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary-text mb-2"
            >
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
              placeholder="tu@email.com"
            />
          </div>

          {/* Campos específicos para Infantil y Juvenil */}
          {esInfantilJuvenil && (
            <>
              {/* Sexo */}
              <div>
                <label
                  htmlFor="sexo"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Sexo *
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>

              {/* Cinta */}
              <div>
                <label
                  htmlFor="cinta"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Cinta *
                </label>
                <input
                  type="text"
                  id="cinta"
                  name="cinta"
                  value={formData.cinta}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                  placeholder="Ej: Blanca, Amarilla, Naranja, etc."
                />
              </div>

              {/* Nivel de Experiencia */}
              <div>
                <label
                  htmlFor="nivelExperiencia"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Nivel de Experiencia *
                </label>
                <select
                  id="nivelExperiencia"
                  name="nivelExperiencia"
                  value={formData.nivelExperiencia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                >
                  <option value="">Selecciona una opción</option>
                  {nivelesExperienciaInfantilJuvenil.map((nivel) => (
                    <option key={nivel} value={nivel.toLowerCase()}>
                      {nivel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría de Edad */}
              <div>
                <label
                  htmlFor="categoriaEdad"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Categoría de Edad *
                </label>
                <select
                  id="categoriaEdad"
                  name="categoriaEdad"
                  value={formData.categoriaEdad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                >
                  <option value="">Selecciona una opción</option>
                  {categoriasEdadInfantilJuvenil.map((categoria) => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría de Peso */}
              <div>
                <label
                  htmlFor="categoriaPeso"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Categoría de Peso (kg) *
                </label>
                <select
                  id="categoriaPeso"
                  name="categoriaPeso"
                  value={formData.categoriaPeso}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                >
                  <option value="">Selecciona una opción</option>
                  {categoriasPesoInfantilJuvenil.map((peso) => (
                    <option key={peso} value={peso}>
                      {peso} kg
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Campos específicos para Adultos y Masters */}
          {esAdultosMasters && (
            <>
              {/* Edad */}
              <div>
                <label
                  htmlFor="edad"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Edad *
                </label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  required
                  min="18"
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                  placeholder="Ingresa tu edad"
                />
              </div>

              {/* Sexo */}
              <div>
                <label
                  htmlFor="sexo"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Sexo *
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>

              {/* Nivel de Experiencia */}
              <div>
                <label
                  htmlFor="nivelExperiencia"
                  className="block text-sm font-medium text-primary-text mb-2"
                >
                  Nivel de Experiencia *
                </label>
                <select
                  id="nivelExperiencia"
                  name="nivelExperiencia"
                  value={formData.nivelExperiencia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                >
                  <option value="">Selecciona una opción</option>
                  {nivelesExperienciaAdultosMasters.map((nivel) => (
                    <option key={nivel} value={nivel.toLowerCase()}>
                      {nivel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría de Peso con Pestañas */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Categoría de Peso (kg) *
                </label>
                {/* Pestañas */}
                <div className="flex gap-2 mb-4 border-b-2 border-primary-text/20">
                  <button
                    type="button"
                    onClick={() => {
                      setPesoTab('varonil')
                      setFormData((prev) => ({ ...prev, categoriaPeso: '' }))
                    }}
                    className={`
                      px-6 py-3 font-medium transition-colors duration-300
                      ${
                        pesoTab === 'varonil'
                          ? 'border-b-2 border-charcoal-ink text-charcoal-ink'
                          : 'text-secondary-text hover:text-primary-text'
                      }
                    `}
                  >
                    Varonil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPesoTab('femenil')
                      setFormData((prev) => ({ ...prev, categoriaPeso: '' }))
                    }}
                    className={`
                      px-6 py-3 font-medium transition-colors duration-300
                      ${
                        pesoTab === 'femenil'
                          ? 'border-b-2 border-charcoal-ink text-charcoal-ink'
                          : 'text-secondary-text hover:text-primary-text'
                      }
                    `}
                  >
                    Femenil
                  </button>
                </div>

                {/* Select de peso según la pestaña activa */}
                <select
                  id="categoriaPeso"
                  name="categoriaPeso"
                  value={formData.categoriaPeso}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary-text/20 focus:border-steel-gray focus:outline-none transition-colors duration-300 bg-soft-white"
                >
                  <option value="">Selecciona una opción</option>
                  {(pesoTab === 'varonil'
                    ? categoriasPesoVaronil
                    : categoriasPesoFemenil
                  ).map((peso) => (
                    <option key={peso} value={peso}>
                      {peso} kg
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-4 px-6 rounded-lg font-semibold text-lg
                transition-all duration-300 ease-in-out
                transform hover:scale-105 active:scale-95
                ${
                  isSubmitting
                    ? 'bg-disabled cursor-not-allowed text-muted-text'
                    : 'bg-charcoal-ink text-soft-white hover:bg-steel-gray hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Registro'}
            </button>
          </div>

          {/* Mensajes de estado */}
          {submitStatus === 'success' && respuestaBackend && (
            <div ref={successMessageRef} className="flex justify-center items-center my-8">
              <div className="w-full max-w-lg bg-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl text-center animate-fade-in border-4 border-orange-600 transform scale-105">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold mb-3">
                  ¡Felicidades {respuestaBackend.nombreParticipante}!
                </p>
                <p className="text-lg mb-4 opacity-95">
                  Tu registro ha sido comenzado con éxito!
                </p>
                <div className="bg-orange-600/50 rounded-lg px-4 py-3 mb-3">
                  <p className="text-sm font-medium mb-1 opacity-90">Este es tu Aztlan ID:</p>
                  <p className="text-2xl font-bold tracking-wider font-mono">
                    {respuestaBackend.aztlan_id}
                  </p>
                </div>
                <p className="text-base font-semibold">
                  Consérvalo para terminar tu registro
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-light-ash border-2 border-graphite rounded-lg text-primary-text text-center">
              Hubo un error al enviar el registro. Por favor, intenta de nuevo.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
