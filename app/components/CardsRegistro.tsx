'use client'

import { useState } from 'react'
import type { TipoRegistro } from './RegistroForm'

const CARDS: { id: string; title: string; description: string; tipo: TipoRegistro }[] = [
  { id: 'juvenil', title: 'Registro Infantil y Juvenil', description: 'Para participantes infantiles y juveniles (6-17 años)', tipo: 'juvenil' },
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-kicker mb-3">Categorías</p>
          <h2 id="cards-registro-titulo" className="text-2xl font-black tracking-tight text-primary-text sm:text-3xl">
            Elige tu categoría
          </h2>
        </div>
        <button
          type="button"
          onClick={onVolver}
          className="btn-secondary self-start sm:self-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, index) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCard(card.tipo)}
            className="group relative block w-full overflow-hidden rounded-[28px] text-left"
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ animation: `fadeInUp 0.6s ease-in-out ${index * 0.1}s both` }}
          >
            <div
              className={`
                surface-panel relative h-full min-h-[220px] border px-7 py-8
                transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(11,18,32,0.16)]
                ${hoveredCard === card.id ? 'border-steel-gray/30 shadow-[0_22px_48px_rgba(47,109,246,0.16)]' : 'border-primary-text/8'}
              `}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-steel-gray via-white to-signal-orange" aria-hidden />
              <div className="status-badge mb-6 bg-blue-mist text-electric-blue">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </div>
              <h3 className="mb-3 text-xl font-black leading-tight text-primary-text sm:text-2xl">
                {card.title}
              </h3>
              <p className="max-w-xs text-sm leading-6 text-secondary-text sm:text-base">
                {card.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal-orange transition group-hover:translate-x-1">
                Continuar
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
