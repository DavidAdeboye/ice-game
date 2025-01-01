import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"
import { GameProvider } from "@/context/game-context"
import { Toast } from "@/components/ui/toast"
import Script from 'next/script'
import { MobileOnly } from "@/components/mobile-only"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ice Game",
  description: "A game about mining ice and completing tasks",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-[#1a1b1e]`}>
        <GameProvider>
          <MobileOnly>
            <main className="max-w-md mx-auto min-h-screen flex flex-col">
              {children}
            </main>
            <BottomNav />
          </MobileOnly>
        </GameProvider>
        <Toast />
      </body>
    </html>
  )
}

