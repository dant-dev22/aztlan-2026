'use client'

import { useState, useEffect } from 'react'

const registrationCards = [
  {
    id: 'infantil',
    title: 'Registro Infantil',
    description: 'Para participantes menores de edad',
    href: '/registro/infantil',
  },
  {
    id: 'juvenil',
    title: 'Registro Juvenil',
    description: 'Para participantes jóvenes',
    href: '/registro/juvenil',
  },
  {
    id: 'adultos',
    title: 'Registro Adultos',
    description: 'Para participantes adultos',
    href: '/registro/adultos',
  },
  {
    id: 'masters',
    title: 'Registro Masters',
    description: 'Para participantes masters',
    href: '/registro/masters',
  },
]

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [shouldWiggle, setShouldWiggle] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldWiggle(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-pastel-black text-pastel-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
            Aztlan 2026
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Título principal y descripción */}
          <section className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-pastel-black">
              Registro de Participantes
            </h1>
            <p className="text-lg sm:text-xl text-pastel-black/80 max-w-2xl mx-auto">
              Selecciona tu categoría para comenzar con el proceso de registro
            </p>
          </section>

          {/* Cards de registro */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {registrationCards.map((card, index) => (
              <a
                key={card.id}
                href={card.href}
                className="group relative block"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animation: `fadeInUp 0.6s ease-in-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className={`
                  bg-white rounded-2xl p-8 h-full
                  shadow-md hover:shadow-xl
                  transition-all duration-300 ease-in-out
                  transform hover:scale-105
                  border-2 border-pastel-black/10 hover:border-pastel-black/30
                  cursor-pointer
                  min-h-[200px] sm:min-h-[240px]
                  flex flex-col justify-center items-center
                  text-center
                  ${hoveredCard === card.id ? 'bg-pastel-white' : ''}
                  ${shouldWiggle ? 'animate-wiggle' : ''}
                `}
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 text-pastel-black group-hover:text-pastel-black transition-colors duration-300">
                    {card.title}
                  </h2>
                  <p className="text-sm sm:text-base text-pastel-black/70 group-hover:text-pastel-black/90 transition-colors duration-300">
                    {card.description}
                  </p>
                </div>
              </a>
            ))}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-pastel-black/5 text-pastel-black/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2026 Aztlan. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

