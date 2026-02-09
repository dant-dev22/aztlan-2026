'use client'

import Image from 'next/image'

const LOGO_SIZE = 120 // doble del tamaño estándar (~60px)

interface AppLogoProps {
  /** Tamaño en píxeles (por defecto 120, doble del estándar) */
  size?: number
  className?: string
  priority?: boolean
}

export default function AppLogo({ size = LOGO_SIZE, className = '', priority = false }: AppLogoProps) {
  return (
    <Image
      src="/images/logoaztlan.svg"
      alt="Aztlan 2026 - Logo oficial"
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  )
}
