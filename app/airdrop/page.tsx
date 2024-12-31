'use client'

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Wallet, Clock } from 'lucide-react'

export default function Airdrop() {
  return (
    <div className="flex flex-col min-h-screen p-4 pb-20 bg-[#1a1b1e] text-white">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/placeholder.svg"
          alt="Airdrop"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">Airdrop</h1>
        <p className="text-gray-400 text-center">
          Stay tuned for exciting airdrop opportunities!
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <Card className="p-4 bg-gray-900/50">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-blue-400" />
              <span className="text-lg">Coming soon</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Wallet connection feature is currently under development. Check back later!
            </p>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Airdrop Tasks</h2>
          <Card className="p-4 bg-gray-900/50">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-400" />
              <span className="text-lg">Bringing tasks soon</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              We're working on exciting tasks for you to complete. Stay tuned for updates!
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

