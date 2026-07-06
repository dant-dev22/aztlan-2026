'use client'

import { useState, useEffect } from 'react'
import RegistroForm, { TipoRegistro } from './components/RegistroForm'
import InstruccionesRegistro from './components/InstruccionesRegistro'
import BotonesFlujoPrincipal from './components/BotonesFlujoPrincipal'
import CardsRegistro from './components/CardsRegistro'
import FormTerminarRegistro from './components/FormTerminarRegistro'
import ModalExitoRegistro from './components/ModalExitoRegistro'
import Modal from './components/Modal'
import Footer from './components/Footer'
import Header from './components/Header'
import RegistroCerrado from './components/RegistroCerrado'
import { REGISTRO_ABIERTO } from './lib/registroConfig'

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
  const [modalExito, setModalExito] = useState<{ nombreParticipante: string; aztlanId: string } | null>(null)
  const [aztlanIdGuardado, setAztlanIdGuardado] = useState<string | null>(null)

  const cualquierModalAbierto = Boolean(modalRegistro || modalTerminar || modalExito)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (modalTerminar) setModalTerminar(false)
      else if (modalExito) setModalExito(null)
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
  }, [cualquierModalAbierto, modalRegistro, modalTerminar, modalExito])

  const handleRegistroExitoso = (nombreParticipante: string, aztlanId: string) => {
    setModalRegistro(null) // Cerrar el modal de registro
    setAztlanIdGuardado(aztlanId) // Guardar el Aztlan ID
    setModalExito({ nombreParticipante, aztlanId }) // Abrir el modal de éxito
  }

  const handleSubirComprobante = () => {
    setModalExito(null) // Cerrar el modal de éxito
    setModalTerminar(true) // Abrir el modal de terminar registro
  }

  const cardSeleccionada = CARDS_DATA.find((c) => c.tipo === modalRegistro)

  if (!REGISTRO_ABIERTO) {
    return (
      <div className="page-shell min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <RegistroCerrado variant="home" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-shell min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {vista === 'principal' && (
            <>
              <section className="surface-panel-dark animate-fade-in overflow-hidden px-6 py-8 sm:px-8 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div>
                    <p className="section-kicker mb-4 border-white/10 bg-white/10 text-blue-mist">
                      Registro abierto
                    </p>
                    <h2 className="max-w-3xl text-4xl font-black tracking-tight text-soft-white sm:text-5xl lg:text-6xl">
                      Diseñado para moverse rápido, registrarse fácil y competir con claridad.
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                      Inicia tu registro, guarda tu Aztlan ID y termina tu proceso cuando tengas el comprobante de pago.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="status-badge border border-white/10 bg-white/8 text-white/75">Infantil y Juvenil</span>
                      <span className="status-badge border border-white/10 bg-white/8 text-white/75">Adultos</span>
                      <span className="status-badge border border-white/10 bg-white/8 text-white/75">Masters</span>
                    </div>
                  </div>
                  <div className="surface-muted p-5 sm:p-6">
                    <InstruccionesRegistro />
                  </div>
                </div>
              </section>
              <section id="registro-participantes" className="surface-panel animate-fade-in scroll-mt-6 px-6 py-10 text-center sm:px-8 lg:px-12" aria-labelledby="main-title">
                <p className="section-kicker mb-4">Flujo principal</p>
                <h2 id="main-title" className="mb-4 text-3xl font-black tracking-tight text-primary-text sm:text-4xl lg:text-5xl">
                  Registro de participantes
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-secondary-text sm:text-xl">
                  Elige si quieres comenzar tu registro o terminarlo con tu comprobante de pago.
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
          onRegistroExitoso={handleRegistroExitoso}
        />
      </Modal>

      <Modal isOpen={Boolean(modalExito)} onClose={() => setModalExito(null)} showCloseButton={false}>
        {modalExito && (
          <ModalExitoRegistro
            nombreParticipante={modalExito.nombreParticipante}
            aztlanId={modalExito.aztlanId}
            onSubirComprobante={handleSubirComprobante}
            onClose={() => setModalExito(null)}
          />
        )}
      </Modal>

      <Modal isOpen={modalTerminar} onClose={() => setModalTerminar(false)}>
        <FormTerminarRegistro
          onClose={() => setModalTerminar(false)}
          aztlanIdPrellenado={aztlanIdGuardado || undefined}
        />
      </Modal>
    </div>
  )
}
