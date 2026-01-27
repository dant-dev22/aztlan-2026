'use client'

import { useState } from 'react'
import type { TipoRegistro } from './RegistroForm'

const CARDS: { id: string; title: string; description: string; tipo: TipoRegistro }[] = [
  { id: 'infantil', title: 'Registro Infantil', description: 'Para participantes menores de edad', tipo: 'infantil' },
  { id: 'juvenil', title: 'Registro Juvenil', description: 'Para participantes jóvenes', tipo: 'juvenil' },
  { id: 'adultos', title: 'Registro Adultos', description: 'Para participantes adultos', tipo: 'adultos' },
  { id: 'masters', title: 'Registro Masters', description: 'Para participantes masters', tipo: 'masters' },
]

interface CardsRegistroProps {
  onSelectCard: (tipo: TipoRegistro) => void
  onVolver: () => void
}

export default function CardsRegistro({ onSelectCard, onVolver }: CardsRegistroProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section className="animate-fade-in" aria-labelledby="cards-registro-titulo">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 id="cards-registro-titulo" className="text-2xl sm:text-3xl font-bold text-primary-text">
          Elige tu categoría
        </h2>
        <button
          type="button"
          onClick={onVolver}
          className="flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors self-start sm:self-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card, index) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCard(card.tipo)}
            className="group relative block w-full text-left"
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ animation: `fadeInUp 0.6s ease-in-out ${index * 0.1}s both` }}
          >
            <div
              className={`
                bg-warm-white rounded-2xl p-8 h-full min-h-[200px] sm:min-h-[240px]
                shadow-md hover:shadow-xl transition-all duration-300 ease-in-out
                transform hover:scale-105 border-2 border-primary-text/10 hover:border-steel-gray/30
                cursor-pointer flex flex-col justify-center items-center text-center
                ${hoveredCard === card.id ? 'bg-light-ash' : ''}
              `}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary-text">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-secondary-text">
                {card.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
