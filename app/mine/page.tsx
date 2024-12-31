'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { AlertCircle, Coins } from 'lucide-react'
import { useGame } from "@/context/game-context"

export default function Mine() {
  const { coins, icePerHour, minerLevel, upgradeMiner, telegramUsername } = useGame()

  const upgradeCost = Math.floor(1000 * Math.pow(1.15, minerLevel))
  const nextLevelIcePerHour = Math.floor((icePerHour + 120 * Math.pow(1.1, minerLevel)) * 10) / 10

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20 bg-[#1a1b1e] text-white">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image
            src="/claw.svg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold text-white">{telegramUsername || "User"}</h1>
        </div>
        <div className="bg-gray-800/50 rounded-full px-4 py-1 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400">{Math.floor(coins)}</span>
        </div>
      </header>

      <Card className="flex flex-col p-6 bg-gray-900/50">
        <h2 className="text-2xl font-bold mb-6 text-white">Upgrade Claw Production</h2>
        <div className="flex justify-center mb-6">
        <Image
            src="/claw.svg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex justify-center items-center text-2xl font-bold text-white">
            Miner Level {minerLevel}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-300">Current claws per hour:</span>
            <span className="text-yellow-400">{icePerHour.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Upgrade cost:</span>
            <span className="text-yellow-400">{upgradeCost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Claws per hour increase:</span>
            <span className="text-green-400">+{(nextLevelIcePerHour - icePerHour).toFixed(1)}</span>
          </div>
        </div>

        <Button className="w-full mb-4" size="lg" onClick={upgradeMiner} disabled={coins < upgradeCost}>
          Upgrade
        </Button>

        <div className="flex gap-2 p-4 bg-gray-800/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            Your cave automatically produces claws every hour. Upgrade to increase production!  
          </p>
        </div>
      </Card>
    </div>
  )
}
