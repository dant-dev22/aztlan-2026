'use client'

import { useCallback, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import type { BracketMatch, BracketSlot, BracketState } from '@/app/lib/bracketEngine'
import { labelRonda, pickMatchWinner } from '@/app/lib/bracketEngine'

function slotText(s: BracketSlot): string {
  if (s.kind === 'player') return s.nombreCompleto
  if (s.kind === 'bye') return 'BYE'
  return '—'
}

function slotSub(s: BracketSlot): string | null {
  if (s.kind === 'player' && s.equipo?.trim()) return s.equipo.trim()
  return null
}

type BracketBoardProps = {
  state: BracketState
  onChange: (next: BracketState) => void
}

export default function BracketBoard({ state, onChange }: BracketBoardProps) {
  const exportRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState<string | null>(null)

  const { rounds, categoryTitle } = state
  const totalRounds = rounds.length

  const handlePick = useCallback(
    (r: number, m: number, winnerId: string) => {
      const nextRounds = pickMatchWinner(rounds, r, m, winnerId)
      if (nextRounds === rounds) return
      onChange({ categoryTitle, rounds: nextRounds })
    },
    [rounds, categoryTitle, onChange]
  )

  const downloadPng = useCallback(async () => {
    const el = exportRef.current
    if (!el) return
    setExporting(true)
    setExportMsg(null)
    try {
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#fafaf8',
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `bracket-${categoryTitle.replace(/[^\w\-]+/g, '_').slice(0, 80)}.png`
      a.click()
    } catch (e) {
      console.error(e)
      setExportMsg('No se pudo generar la imagen. Intenta de nuevo o usa JSON.')
    } finally {
      setExporting(false)
    }
  }, [categoryTitle])

  const downloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bracket-${categoryTitle.replace(/[^\w\-]+/g, '_').slice(0, 80)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state, categoryTitle])

  if (!rounds.length) {
    return <p className="text-secondary-text">No hay datos de bracket para mostrar.</p>
  }

  const finalMatch = rounds[totalRounds - 1]?.[0]
  const championName = finalMatch?.winnerId
    ? (() => {
        const id = finalMatch.winnerId!
        if (finalMatch.side0.kind === 'player' && finalMatch.side0.id === id) {
          return finalMatch.side0.nombreCompleto
        }
        if (finalMatch.side1.kind === 'player' && finalMatch.side1.id === id) {
          return finalMatch.side1.nombreCompleto
        }
        return null
      })()
    : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <p className="text-sm text-secondary-text max-w-xl">
          Haz clic en el ganador de cada enfrentamiento cuando ambos lados estén definidos. Los byes
          avanzan solos. Puedes descargar PNG para imprimir o compartir, y JSON para respaldo o edición
          externa.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadPng}
            disabled={exporting}
            className="px-4 py-2 rounded-lg bg-charcoal-ink text-soft-white text-sm font-medium hover:bg-graphite transition-colors disabled:opacity-60"
          >
            {exporting ? 'Generando…' : 'Descargar PNG'}
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="px-4 py-2 rounded-lg border-2 border-primary-text/20 text-primary-text text-sm font-medium hover:bg-light-ash/30 transition-colors"
          >
            Descargar JSON
          </button>
        </div>
      </div>
      {exportMsg && (
        <p className="text-sm text-red-700" role="alert">
          {exportMsg}
        </p>
      )}

      {championName && (
        <div className="rounded-xl border-2 border-charcoal-ink/20 bg-light-ash/50 px-4 py-3">
          <p className="text-sm font-semibold text-primary-text">
            Campeón de categoría: <span className="text-charcoal-ink">{championName}</span>
          </p>
        </div>
      )}

      <div
        ref={exportRef}
        className="rounded-2xl border-2 border-primary-text/15 bg-[#fafaf8] p-6 sm:p-8 overflow-x-auto shadow-sm"
      >
        <div className="min-w-max flex flex-col gap-2 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-primary-text">Aztlan 2026 — Brackets</h2>
          <p className="text-secondary-text text-sm">{categoryTitle}</p>
        </div>

        <div className="min-w-max flex flex-row gap-6 sm:gap-10 items-stretch">
          {rounds.map((roundMatches, r) => (
            <section key={r} className="flex flex-col shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary-text mb-4 text-center">
                {labelRonda(r, totalRounds)}
              </h3>
              <div
                className="flex flex-col justify-around gap-6 flex-1"
                style={{
                  minHeight: `${Math.max(roundMatches.length * 88, 120)}px`,
                }}
              >
                {roundMatches.map((match) => (
                  <MatchCard key={`${match.round}-${match.index}`} match={match} onPick={handlePick} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function MatchCard({
  match,
  onPick,
}: {
  match: BracketMatch
  onPick: (r: number, m: number, winnerId: string) => void
}) {
  const { round, index, side0, side1, winnerId } = match
  const canPick =
    !winnerId && side0.kind === 'player' && side1.kind === 'player' && side0.id !== side1.id

  const rowClass = (playerId: string | null) => {
    if (!winnerId) return 'text-primary-text'
    if (playerId && winnerId === playerId) return 'text-primary-text font-semibold'
    return 'text-secondary-text/70 line-through decoration-primary-text/30'
  }

  return (
    <article
      className="w-[min(100vw-3rem,280px)] rounded-xl border-2 border-steel-gray/40 bg-soft-white p-3 shadow-sm"
      aria-label={`Enfrentamiento ronda ${round + 1}`}
    >
      <div className="space-y-2">
        <div className={`text-sm ${rowClass(side0.kind === 'player' ? side0.id : null)}`}>
          <div className="flex justify-between gap-2 items-start">
            <span className="leading-snug">{slotText(side0)}</span>
            {canPick && side0.kind === 'player' && (
              <button
                type="button"
                onClick={() => onPick(round, index, side0.id)}
                className="shrink-0 text-xs px-2 py-1 rounded-md bg-charcoal-ink text-soft-white hover:bg-graphite"
              >
                Gana
              </button>
            )}
          </div>
          {slotSub(side0) && (
            <p className="text-xs text-muted-text mt-0.5 truncate">{slotSub(side0)}</p>
          )}
        </div>
        <div className="text-center text-[10px] uppercase tracking-wider text-muted-text">vs</div>
        <div className={`text-sm ${rowClass(side1.kind === 'player' ? side1.id : null)}`}>
          <div className="flex justify-between gap-2 items-start">
            <span className="leading-snug">{slotText(side1)}</span>
            {canPick && side1.kind === 'player' && (
              <button
                type="button"
                onClick={() => onPick(round, index, side1.id)}
                className="shrink-0 text-xs px-2 py-1 rounded-md bg-charcoal-ink text-soft-white hover:bg-graphite"
              >
                Gana
              </button>
            )}
          </div>
          {slotSub(side1) && (
            <p className="text-xs text-muted-text mt-0.5 truncate">{slotSub(side1)}</p>
          )}
        </div>
      </div>
      {winnerId && (
        <p className="mt-3 pt-2 border-t border-primary-text/10 text-xs text-secondary-text">
          Ganador registrado en esta llave.
        </p>
      )}
    </article>
  )
}
