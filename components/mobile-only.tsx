'use client'

import { useEffect, useState } from 'react'

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sorry!</h1>
          <p className="text-xl">This application is only available on mobile devices.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

