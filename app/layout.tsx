import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
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
      <body className={inter.className}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
}