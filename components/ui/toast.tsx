import { useToast, Toast as ToastType } from './use-toast'
import { useEffect } from 'react'

export function Toast() {
  const { toasts, dismissToast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      if (toasts.length > 0) {
        dismissToast(toasts[0].id)
      }
    }, 3000)

    return () => clearInterval(timer)
  }, [toasts, dismissToast])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gray-800 text-white p-4 rounded-md shadow-lg max-w-sm"
        >
          <h3 className="font-bold">{toast.title}</h3>
          {toast.description && <p className="mt-1 text-sm">{toast.description}</p>}
          {toast.action}
        </div>
      ))}
    </div>
  )
}

