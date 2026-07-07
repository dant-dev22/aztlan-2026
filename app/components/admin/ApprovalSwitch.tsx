'use client'

import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

interface ApprovalSwitchProps {
  isApproved: boolean
  onToggle: (nextApproved: boolean) => void
  participantName: string
}

export default function ApprovalSwitch({ isApproved, onToggle, participantName }: ApprovalSwitchProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSwitchClick = () => {
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    onToggle(!isApproved)
  }

  const confirmationTitle = isApproved ? 'Confirmar cancelación' : 'Confirmar aprobación'
  const confirmationMessage = isApproved
    ? '¿Estás seguro en cancelar este registro?'
    : '¿Estás seguro en aprobar este registro?'
  const confirmText = isApproved ? 'Sí, cancelar' : 'Sí, aprobar'

  return (
    <>
      <button
        type="button"
        onClick={handleSwitchClick}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-steel-gray focus:ring-offset-2
          ${isApproved ? 'bg-electric-blue' : 'bg-disabled'}
        `}
        role="switch"
        aria-checked={isApproved}
        aria-label={`${isApproved ? 'Aprobado' : 'No aprobado'} - ${participantName}`}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-soft-white shadow-sm transition-transform
            ${isApproved ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title={confirmationTitle}
        message={confirmationMessage}
        confirmText={confirmText}
        cancelText="Cancelar"
      />
    </>
  )
}
