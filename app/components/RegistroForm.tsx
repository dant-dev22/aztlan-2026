'use client'

import { useState, FormEvent } from 'react'

export type TipoRegistro = 'infantil' | 'juvenil' | 'adultos' | 'masters'

interface RegistroFormProps {
  tipoRegistro: TipoRegistro
  titulo?: string
  descripcion?: string
  camposPersonalizados?: Record<string, any>
}

export default function RegistroForm({
  tipoRegistro,
  titulo,
  descripcion,
  camposPersonalizados = {},
}: RegistroFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    ...camposPersonalizados,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Aquí irá la lógica de envío del formulario
      // Por ahora simulamos una petición
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En el futuro, aquí se puede personalizar la lógica según tipoRegistro
      console.log('Datos del formulario:', { tipoRegistro, formData })

      setSubmitStatus('success')
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Títulos y descripciones por defecto según el tipo de registro
  const tituloDefault = titulo || `Registro ${tipoRegistro.charAt(0).toUpperCase() + tipoRegistro.slice(1)}`
  const descripcionDefault =
    descripcion ||
    `Completa el siguiente formulario para registrarte en la categoría ${tipoRegistro}`

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-pastel-black">
            {tituloDefault}
          </h1>
          <p className="text-lg text-pastel-black/70">{descripcionDefault}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-pastel-black mb-2"
              >
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-pastel-black/20 focus:border-pastel-black focus:outline-none transition-colors duration-300 bg-pastel-white"
                placeholder="Ingresa tu nombre"
              />
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-pastel-black mb-2"
              >
                Apellido *
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-pastel-black/20 focus:border-pastel-black focus:outline-none transition-colors duration-300 bg-pastel-white"
                placeholder="Ingresa tu apellido"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-pastel-black mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-pastel-black/20 focus:border-pastel-black focus:outline-none transition-colors duration-300 bg-pastel-white"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-pastel-black mb-2"
            >
              Teléfono *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-pastel-black/20 focus:border-pastel-black focus:outline-none transition-colors duration-300 bg-pastel-white"
              placeholder="+52 123 456 7890"
            />
          </div>

          <div>
            <label
              htmlFor="fechaNacimiento"
              className="block text-sm font-medium text-pastel-black mb-2"
            >
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-pastel-black/20 focus:border-pastel-black focus:outline-none transition-colors duration-300 bg-pastel-white"
            />
          </div>

          {/* Aquí se pueden agregar campos personalizados según el tipo de registro */}
          {Object.keys(camposPersonalizados).length > 0 && (
            <div className="pt-4 border-t-2 border-pastel-black/10">
              <p className="text-sm text-pastel-black/60 mb-4">
                Campos adicionales para {tipoRegistro}
              </p>
              {/* Los campos personalizados se renderizarán aquí en el futuro */}
            </div>
          )}

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
                    ? 'bg-pastel-black/50 cursor-not-allowed'
                    : 'bg-pastel-black text-pastel-white hover:bg-pastel-black/90 hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Registro'}
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-800 text-center">
              ¡Registro enviado exitosamente!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-800 text-center">
              Hubo un error al enviar el registro. Por favor, intenta de nuevo.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

