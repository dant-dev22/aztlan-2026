'use client'

import { useState, useEffect } from 'react'
import RegistroForm, { TipoRegistro } from './components/RegistroForm'
import InstruccionesRegistro from './components/InstruccionesRegistro'
import BotonesFlujoPrincipal from './components/BotonesFlujoPrincipal'
import CardsRegistro from './components/CardsRegistro'
import FormTerminarRegistro from './components/FormTerminarRegistro'
import Modal from './components/Modal'
import Footer from './components/Footer'

const CARDS_DATA: { tipo: TipoRegistro; title: string; description: string }[] = [
  { tipo: 'juvenil', title: 'Registro Infantil y Juvenil', description: 'Para participantes infantiles y juveniles (6-17 años)' },
  { tipo: 'adultos', title: 'Registro Adultos', description: 'Para participantes adultos' },
  { tipo: 'masters', title: 'Registro Masters', description: 'Para participantes masters' },
]

type Vista = 'principal' | 'cards'

export default function Home() {
  const [vista, setVista] = useState<Vista>('principal')
  const [modalRegistro, setModalRegistro] = useState<TipoRegistro | null>(null)
  const [modalTerminar, setModalTerminar] = useState(false)

  const cualquierModalAbierto = Boolean(modalRegistro || modalTerminar)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (modalTerminar) setModalTerminar(false)
      else if (modalRegistro) setModalRegistro(null)
    }
    if (cualquierModalAbierto) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [cualquierModalAbierto, modalRegistro, modalTerminar])

  const cardSeleccionada = CARDS_DATA.find((c) => c.tipo === modalRegistro)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-charcoal-ink text-soft-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
            Aztlan 2026
          </h1>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {vista === 'principal' && (
            <>
              <section className="mb-12 animate-fade-in">
                <InstruccionesRegistro />
              </section>
              <section id="registro-participantes" className="text-center animate-fade-in scroll-mt-6" aria-labelledby="main-title">
                <h2 id="main-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-primary-text">
                  Registro de Participantes
                </h2>
                <p className="text-lg sm:text-xl text-secondary-text max-w-2xl mx-auto mb-10">
                  Inicia tu registro o envía tu comprobante de pago para completarlo.
                </p>
                <BotonesFlujoPrincipal
                  onIniciarRegistro={() => setVista('cards')}
                  onTerminarRegistro={() => setModalTerminar(true)}
                />
              </section>
            </>
          )}

          {vista === 'cards' && (
            <CardsRegistro
              onSelectCard={(tipo) => setModalRegistro(tipo)}
              onVolver={() => setVista('principal')}
            />
          )}
        </div>
      </main>

      <Footer />

      <Modal isOpen={Boolean(modalRegistro && cardSeleccionada)} onClose={() => setModalRegistro(null)}>
        <RegistroForm
          tipoRegistro={modalRegistro!}
          titulo={cardSeleccionada?.title}
          descripcion={cardSeleccionada?.description}
        />
      </Modal>

      <Modal isOpen={modalTerminar} onClose={() => setModalTerminar(false)}>
        <FormTerminarRegistro onClose={() => setModalTerminar(false)} />
      </Modal>
    </div>
  )
}
