import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Brackets | Aztlan 2026',
  description: 'Generación de llaves por categoría para Aztlan 2026',
}

export default function BracketsLayout({ children }: { children: ReactNode }) {
  return children
}
