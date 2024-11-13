'use client'

import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessModalProps {
  message: string
  onClose: () => void
}

export function SuccessModal({ message, onClose }: SuccessModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 animate-slide-up">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="text-green-400 w-5 h-5" />
          <h3 className="text-xl font-semibold text-gray-100">Success</h3>
        </div>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  )
} 