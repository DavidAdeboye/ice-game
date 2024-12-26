'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { AlertCircle, Coins } from 'lucide-react'
import { useGame } from "@/context/game-context"

export default function Mine() {
  const { coins, icePerHour, minerLevel, upgradeMiner } = useGame()

  const upgradeCost = Math.floor(1000 * Math.pow(1.15, minerLevel))
  const nextLevelIcePerHour = Math.floor((icePerHour + 120 * Math.pow(1.1, minerLevel)) * 10) / 10

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image
            src="/placeholder.svg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold">Metaldness</h1>
        </div>
        <div className="bg-gray-800/50 rounded-full px-4 py-1 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span>{Math.floor(coins)}</span>
        </div>
      </header>

      <Card className="flex flex-col p-6 bg-gray-900/50">
        <h2 className="text-2xl font-bold mb-6">Upgrade Ice Production</h2>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src="/placeholder.svg"
              alt="Ice cubes"
              width={100}
              height={100}
            />
            <span className="absolute -right-4 -top-4 text-2xl font-bold">{minerLevel}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Current ice per hour:</span>
            <span className="text-yellow-400">{icePerHour.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Upgrade cost:</span>
            <span className="text-yellow-400">{upgradeCost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ice per hour increase:</span>
            <span className="text-green-400">+{(nextLevelIcePerHour - icePerHour).toFixed(1)}</span>
          </div>
        </div>

        <Button className="w-full mb-4" size="lg" onClick={upgradeMiner} disabled={coins < upgradeCost}>
          Upgrade
        </Button>

        <div className="flex gap-2 p-4 bg-gray-800/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            Your mine automatically produces ice every hour. Upgrade to increase production!
          </p>
        </div>
      </Card>
    </div>
  )
}

