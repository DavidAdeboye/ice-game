import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  action?: React.ReactNode
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, action }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((toasts) => [...toasts, { id, title, description, action }])
    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
  }, [])

  return { toast, dismissToast, toasts }
}

