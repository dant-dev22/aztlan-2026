import type { BracketState } from '@/app/lib/bracketEngine'

const PREFIX = 'aztlan-bracket-v1:'

export function storageKeyForCategory(categoryTitle: string): string {
  return `${PREFIX}${encodeURIComponent(categoryTitle)}`
}

export function loadBracketState(categoryTitle: string): BracketState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKeyForCategory(categoryTitle))
    if (!raw) return null
    const parsed = JSON.parse(raw) as BracketState
    if (!parsed?.rounds || !Array.isArray(parsed.rounds)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveBracketState(state: BracketState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(storageKeyForCategory(state.categoryTitle), JSON.stringify(state))
  } catch {
    // quota or private mode
  }
}

export function clearBracketState(categoryTitle: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(storageKeyForCategory(categoryTitle))
  } catch {
    // ignore
  }
}

export function parseBracketStateJson(text: string): BracketState | null {
  try {
    const o = JSON.parse(text) as unknown
    if (!o || typeof o !== 'object') return null
    const rec = o as Record<string, unknown>
    if (typeof rec.categoryTitle !== 'string' || !Array.isArray(rec.rounds)) return null
    return rec as BracketState
  } catch {
    return null
  }
}
