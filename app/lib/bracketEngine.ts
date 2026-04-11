import type { UsuarioCompleto } from '@/app/hooks/useUsers'

export type PlayerSlot = {
  kind: 'player'
  id: string
  nombreCompleto: string
  equipo?: string
}

export type BracketSlot =
  | { kind: 'pending' }
  | { kind: 'bye' }
  | PlayerSlot

export type BracketMatch = {
  round: number
  index: number
  side0: BracketSlot
  side1: BracketSlot
  winnerId: string | null
}

export type BracketState = {
  categoryTitle: string
  rounds: BracketMatch[][]
}

export function usuarioToSlot(u: UsuarioCompleto): PlayerSlot {
  return {
    kind: 'player',
    id: u.id,
    nombreCompleto: u.nombreCompleto,
    equipo: u.equipo,
  }
}

function nextPowerOf2(n: number): number {
  if (n <= 1) return 1
  return 2 ** Math.ceil(Math.log2(n))
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function propagateWinnerToParent(rounds: BracketMatch[][], r: number, m: number, winner: PlayerSlot) {
  if (r >= rounds.length - 1) return
  const pr = r + 1
  const pm = Math.floor(m / 2)
  const ps = m % 2
  const parent = rounds[pr][pm]
  if (ps === 0) parent.side0 = winner
  else parent.side1 = winner
  tryResolveMatchMutating(rounds, pr, pm)
}

function tryResolveMatchMutating(rounds: BracketMatch[][], r: number, m: number) {
  const match = rounds[r][m]
  if (match.winnerId) return
  const s0 = match.side0
  const s1 = match.side1
  if (s0.kind === 'pending' || s1.kind === 'pending') return
  if (s0.kind === 'bye' && s1.kind === 'bye') return

  if (s0.kind === 'player' && s1.kind === 'bye') {
    match.winnerId = s0.id
    propagateWinnerToParent(rounds, r, m, s0)
    return
  }
  if (s0.kind === 'bye' && s1.kind === 'player') {
    match.winnerId = s1.id
    propagateWinnerToParent(rounds, r, m, s1)
    return
  }
}

function flushRound0Byes(rounds: BracketMatch[][]) {
  const r0 = rounds[0]
  for (let m = 0; m < r0.length; m++) {
    const match = r0[m]
    if (!match.winnerId) continue
    const w =
      match.side0.kind === 'player' && match.side0.id === match.winnerId
        ? match.side0
        : match.side1.kind === 'player' && match.side1.id === match.winnerId
          ? match.side1
          : null
    if (w && w.kind === 'player') {
      propagateWinnerToParent(rounds, 0, m, w)
    }
  }
}

/**
 * Eliminatoria simple: participantes en orden aleatorio (con byes si no es potencia de 2).
 * Solo aplica a la lista ya filtrada por categoría (p. ej. aprobados).
 */
export function createBracket(
  participants: UsuarioCompleto[],
  categoryTitle: string,
  rng: () => number = Math.random
): BracketState {
  const n = participants.length
  if (n === 0) {
    return { categoryTitle, rounds: [] }
  }

  if (n === 1) {
    const sole = usuarioToSlot(participants[0])
    const match: BracketMatch = {
      round: 0,
      index: 0,
      side0: sole,
      side1: { kind: 'bye' },
      winnerId: sole.id,
    }
    return { categoryTitle, rounds: [[match]] }
  }

  const R = nextPowerOf2(n)
  const shuffled = shuffle(participants, rng)
  const padded: (UsuarioCompleto | null)[] = shuffle(
    [...shuffled, ...Array.from({ length: R - n }, () => null)],
    rng
  )

  const numRounds = Math.log2(R)
  const rounds: BracketMatch[][] = []

  const round0: BracketMatch[] = []
  for (let m = 0; m < R / 2; m++) {
    const a = padded[2 * m]
    const b = padded[2 * m + 1]
    const side0 = a ? usuarioToSlot(a) : ({ kind: 'bye' } as const)
    const side1 = b ? usuarioToSlot(b) : ({ kind: 'bye' } as const)
    let winnerId: string | null = null
    if (side0.kind === 'player' && side1.kind === 'bye') winnerId = side0.id
    if (side0.kind === 'bye' && side1.kind === 'player') winnerId = side1.id
    round0.push({
      round: 0,
      index: m,
      side0,
      side1,
      winnerId,
    })
  }
  rounds.push(round0)

  for (let r = 1; r < numRounds; r++) {
    const count = 2 ** (numRounds - 1 - r)
    const round: BracketMatch[] = []
    for (let m = 0; m < count; m++) {
      round.push({
        round: r,
        index: m,
        side0: { kind: 'pending' },
        side1: { kind: 'pending' },
        winnerId: null,
      })
    }
    rounds.push(round)
  }

  flushRound0Byes(rounds)

  return { categoryTitle, rounds }
}

export function pickMatchWinner(
  rounds: BracketMatch[][],
  r: number,
  m: number,
  winnerId: string
): BracketMatch[][] {
  const next = structuredClone(rounds) as BracketMatch[][]
  const match = next[r][m]
  if (match.winnerId) return rounds
  if (match.side0.kind !== 'player' || match.side1.kind !== 'player') {
    return rounds
  }
  let winner: PlayerSlot | null = null
  if (match.side0.id === winnerId) winner = match.side0
  else if (match.side1.id === winnerId) winner = match.side1
  if (!winner) return rounds

  match.winnerId = winnerId
  propagateWinnerToParent(next, r, m, winner)
  return next
}

export function labelRonda(roundIndex: number, totalRounds: number): string {
  if (totalRounds <= 1) return 'Final'
  if (roundIndex === totalRounds - 1) return 'Final'
  if (roundIndex === totalRounds - 2) return 'Semifinal'
  if (roundIndex === totalRounds - 3) return 'Cuartos'
  return `Ronda ${roundIndex + 1}`
}
