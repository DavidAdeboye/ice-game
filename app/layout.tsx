import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"
import { GameProvider } from "@/context/game-context"

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
      <body className={`${inter.className} bg-[#1a1b1e]`}>
        <GameProvider>
          <main className="max-w-md mx-auto min-h-screen flex flex-col">
            {children}
          </main>
          <BottomNav />
        </GameProvider>
      </body>
    </html>
  )
}

