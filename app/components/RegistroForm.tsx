'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { postRegistro, type RegistroPayload } from '@/app/lib/api'
import AppLogo from './AppLogo'

export type TipoRegistro = 'juvenil' | 'adultos' | 'masters'

interface RegistroFormProps {
  tipoRegistro: TipoRegistro
  titulo?: string
  descripcion?: string
  camposPersonalizados?: Record<string, any>
  onRegistroExitoso?: (nombreParticipante: string, aztlanId: string) => void
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

const categoriasPesoVaronil = ['-60', '-65', '-73', '-79', '-85', '-91', '-100', '+100']
const categoriasPesoFemenil = ['-50', '-55', '-60', '-65', '-70', '+70']

// Cintas por tipo de registro (valor enviado al backend = label en minúscula)
const cintasAdultosMasters = ['Blanca', 'Azul', 'Morada', 'Cafe', 'Negra']
const cintasNinosJuveniles = ['Blanca', 'Gris', 'Amarilla', 'Naranja', 'Verde', 'Azul', 'Morada']

export default function RegistroForm({
  tipoRegistro,
  titulo,
  descripcion,
  camposPersonalizados = {},
  onRegistroExitoso,
}: RegistroFormProps) {
  const esInfantilJuvenil = tipoRegistro === 'juvenil'
  const esAdultosMasters = tipoRegistro === 'adultos' || tipoRegistro === 'masters'

  // Estado para pestañas de peso en adultos/masters
  const [pesoTab, setPesoTab] = useState<'varonil' | 'femenil'>('varonil')

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    equipo: '',
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
  const [submitAttempted, setSubmitAttempted] = useState(false)
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

  // Función para preparar los datos antes de enviarlos (compatible con API Aztlan 26)
  const prepararDatosEnvio = (): RegistroPayload => {
    const datosBase: RegistroPayload = {
      tipoRegistro,
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      equipo: formData.equipo,
      cinta: formData.cinta,
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
        cinta: formData.cinta,
        edad: parseInt(formData.edad, 10),
        sexo: formData.sexo,
        nivelExperiencia: formData.nivelExperiencia,
        categoriaPeso: formData.categoriaPeso,
        categoriaPesoTipo: pesoTab,
      }
    }

    return datosBase
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitAttempted(true)
    if (!formData.equipo?.trim() || !formData.cinta?.trim()) {
      return
    }
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const datosEnvio = prepararDatosEnvio()
      const resultado = await postRegistro(datosEnvio)

      const nombreParticipante = resultado.nombreParticipante ?? formData.nombreCompleto
      const aztlanId = resultado.aztlan_id

      setRespuestaBackend({
        nombreParticipante,
        mensaje: resultado.mensaje,
        statusCode: resultado.statusCode ?? 200,
        aztlan_id: aztlanId,
      })

      setSubmitStatus('success')

      // Si hay callback, llamarlo para abrir el modal
      if (onRegistroExitoso) {
        onRegistroExitoso(nombreParticipante, aztlanId)
      }

      setTimeout(() => {
        setFormData({
          nombreCompleto: '',
          email: '',
          equipo: '',
          sexo: '',
          edad: '',
          categoriaEdad: '',
          cinta: '',
          nivelExperiencia: '',
          categoriaPeso: '',
          ...camposPersonalizados,
        })
        setSubmitAttempted(false)
        if (esAdultosMasters) {
          setPesoTab('varonil')
        }
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
      <div className="surface-panel overflow-hidden">
        <div className="bg-charcoal-ink px-6 py-8 text-center text-soft-white sm:px-8 lg:px-10">
          <div className="mx-auto mb-4 w-fit rounded-2xl border border-white/10 bg-white/5 p-3">
            <AppLogo size={104} />
          </div>
          <p className="section-kicker mb-4 border-white/10 bg-white/10 text-blue-mist">Registro Aztlan</p>
          <h1 className="mb-4 text-2xl font-black tracking-tight text-soft-white sm:text-3xl">
            {tituloDefault}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/72 sm:text-lg">{descripcionDefault}</p>
        </div>

        <div className="px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nombre Completo - Todos los formularios */}
              <div className="md:col-span-2">
                <label
                  htmlFor="nombreCompleto"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
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
                  className="input-field"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              {/* Correo Electrónico - Todos los formularios */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
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
                  className="input-field"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Equipo - Requerido para todos los participantes */}
              <div>
                <label
                  htmlFor="equipo"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Equipo *
                </label>
                <input
                  type="text"
                  id="equipo"
                  name="equipo"
                  value={formData.equipo}
                  onChange={handleChange}
                  required
                  className={`input-field ${
                    submitStatus === 'error' || (!formData.equipo?.trim() && submitAttempted)
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                      : ''
                  }`}
                  placeholder="Nombre del equipo"
                />
              </div>

              {/* Cinta - Requerido para todos los participantes (select según tipo) */}
              <div className="md:col-span-2">
                <label
                  htmlFor="cinta"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Cinta *
                </label>
                <select
                  id="cinta"
                  name="cinta"
                  value={formData.cinta}
                  onChange={handleChange}
                  required
                  className={`input-field ${
                    submitStatus === 'error' || (!formData.cinta?.trim() && submitAttempted)
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                      : ''
                  }`}
                >
                  <option value="">Elige tu cinta</option>
                  {(esAdultosMasters ? cintasAdultosMasters : cintasNinosJuveniles).map((cinta) => (
                    <option key={cinta} value={cinta.toLowerCase()}>
                      {cinta}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          {/* Campos específicos para Infantil y Juvenil */}
          {esInfantilJuvenil && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Sexo */}
              <div>
                <label
                  htmlFor="sexo"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Sexo *
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Nivel de Experiencia *
                </label>
                <select
                  id="nivelExperiencia"
                  name="nivelExperiencia"
                  value={formData.nivelExperiencia}
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Categoría de Edad *
                </label>
                <select
                  id="categoriaEdad"
                  name="categoriaEdad"
                  value={formData.categoriaEdad}
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Categoría de Peso (kg) *
                </label>
                <select
                  id="categoriaPeso"
                  name="categoriaPeso"
                  value={formData.categoriaPeso}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Selecciona una opción</option>
                  {categoriasPesoInfantilJuvenil.map((peso) => (
                    <option key={peso} value={peso}>
                      {peso} kg
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Campos específicos para Adultos y Masters */}
          {esAdultosMasters && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Edad */}
              <div>
                <label
                  htmlFor="edad"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
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
                  className="input-field"
                  placeholder="Ingresa tu edad"
                />
              </div>

              {/* Sexo */}
              <div>
                <label
                  htmlFor="sexo"
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Sexo *
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                  className="input-field"
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
                  className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text"
                >
                  Nivel de Experiencia *
                </label>
                <select
                  id="nivelExperiencia"
                  name="nivelExperiencia"
                  value={formData.nivelExperiencia}
                  onChange={handleChange}
                  required
                  className="input-field"
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
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text">
                  Categoría de Peso (kg) *
                </label>
                {/* Pestañas */}
                <div className="mb-4 inline-flex rounded-2xl border border-primary-text/10 bg-light-ash/60 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPesoTab('varonil')
                      setFormData((prev) => ({ ...prev, categoriaPeso: '' }))
                    }}
                    className={`
                      rounded-2xl px-5 py-2.5 font-semibold transition-colors duration-300
                      ${
                        pesoTab === 'varonil'
                          ? 'bg-warm-white text-electric-blue shadow-sm'
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
                      rounded-2xl px-5 py-2.5 font-semibold transition-colors duration-300
                      ${
                        pesoTab === 'femenil'
                          ? 'bg-warm-white text-signal-orange shadow-sm'
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
                  className="input-field"
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
            </div>
          )}

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full rounded-2xl px-6 py-4 text-lg font-semibold
                transition-all duration-300 ease-in-out
                transform hover:scale-105 active:scale-95
                ${
                  isSubmitting
                    ? 'bg-disabled cursor-not-allowed text-muted-text'
                    : 'bg-charcoal-ink text-soft-white hover:bg-electric-blue hover:shadow-[0_18px_34px_rgba(47,109,246,0.24)]'
                }
              `}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Registro'}
            </button>
          </div>

          {/* Mensajes de estado - Solo mostrar si no hay callback para modal */}
          {submitStatus === 'success' && respuestaBackend && !onRegistroExitoso && (
            <div ref={successMessageRef} className="flex justify-center items-center my-8">
              <div className="surface-panel w-full max-w-lg border border-signal-orange/20 px-8 py-6 text-center animate-fade-in">
                <div className="mb-4 flex items-center justify-center text-signal-orange">
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
                <p className="text-2xl font-bold mb-3 text-primary-text">
                  ¡Felicidades {respuestaBackend.nombreParticipante}!
                </p>
                <p className="text-lg mb-4 text-secondary-text">
                  Tu registro ha sido comenzado con éxito!
                </p>
                <div className="mb-3 rounded-2xl border border-signal-orange/25 bg-signal-orange-soft px-4 py-3">
                  <p className="text-sm font-medium mb-1 text-secondary-text">Este es tu Aztlan ID:</p>
                  <p className="text-2xl font-bold tracking-wider font-mono text-signal-orange">
                    {respuestaBackend.aztlan_id}
                  </p>
                </div>
                <p className="text-base font-semibold text-primary-text">
                  Consérvalo para terminar tu registro
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-primary-text">
              Hubo un error al enviar el registro. Por favor, intenta de nuevo.
            </div>
          )}
          </form>
        </div>
      </div>
    </div>
  )
}
