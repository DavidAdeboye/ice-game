import Image from 'next/image'

function LoadingDots() {
  return (
    <div className="flex justify-center gap-2 absolute bottom-12 left-1/2 -translate-x-1/2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full h-full">
        <Image
          src="/splashscreen.webp"
          alt="Clawfi Splash Screen"
          fill
          priority
          className="object-contain"
        />
        <LoadingDots />
      </div>
    </div>
  )
}

