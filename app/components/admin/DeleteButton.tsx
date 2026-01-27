'use client'

import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

interface DeleteButtonProps {
  onDelete: () => void
  participantName: string
}

export default function DeleteButton({ onDelete, participantName }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    onDelete()
    setShowConfirm(false)
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        aria-label={`Eliminar ${participantName}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        message={`¿Está seguro de eliminar el registro de ${participantName}? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </>
  )
}
