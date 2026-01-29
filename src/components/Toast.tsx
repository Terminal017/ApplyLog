import { useEffect, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, X } from 'lucide-react'
import clsx from 'clsx'

export type ToastType = 'success' | 'error'

export interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps): ReactElement | null {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) {
    return null
  }

  const Icon = type === 'success' ? CheckCircle : XCircle

  return createPortal(
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
          type === 'success'
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800',
        )}
      >
        <Icon
          size={20}
          className={type === 'success' ? 'text-green-500' : 'text-red-500'}
        />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className={clsx(
            'p-1 rounded hover:bg-opacity-20',
            type === 'success' ? 'hover:bg-green-500' : 'hover:bg-red-500',
          )}
        >
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body,
  )
}
