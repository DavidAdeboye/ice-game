'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGame } from "@/context/game-context"
import { Coins } from 'lucide-react'
import Image from "next/image"

const BOOST_OPTIONS = [
  { points: 10, cost: 100, id: 'boost-1' },
  { points: 50, cost: 450, id: 'boost-2' },
  { points: 100, cost: 800, id: 'boost-3' },
  { points: 500, cost: 3500, id: 'boost-4' },
]

const REFILL_SPEED_OPTIONS = [
  { speed: 1, cost: 500, id: 'refill-1' },
  { speed: 5, cost: 2000, id: 'refill-2' },
  { speed: 10, cost: 3500, id: 'refill-3' },
]

export default function Boost() {
  const { coins, removeCoins, addTappablePoints, increaseRefillSpeed } = useGame()

  const handlePurchase = (points: number, cost: number) => {
    if (coins >= cost) {
      removeCoins(cost)
      addTappablePoints(points)
    }
  }

  const handleRefillSpeedPurchase = (speed: number, cost: number) => {
    if (coins >= cost) {
      removeCoins(cost)
      increaseRefillSpeed(speed)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20 bg-[#1a1b1e] text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Boost Points</h1>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400">{coins}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {BOOST_OPTIONS.map((option) => (
          <Card key={option.id} className="p-4 bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="/placeholder.svg"
                    alt="Boost"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">+{option.points} Points</h3>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">{option.cost}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handlePurchase(option.points, option.cost)}
                disabled={coins < option.cost}
              >
                Purchase
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Increase Refill Speed</h2>
        <div className="grid gap-4">
          {REFILL_SPEED_OPTIONS.map((option) => (
            <Card key={option.id} className="p-4 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src="/placeholder.svg"
                      alt="Refill Speed"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">+{option.speed} Refill Speed</h3>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">{option.cost}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleRefillSpeedPurchase(option.speed, option.cost)}
                  disabled={coins < option.cost}
                >
                  Purchase
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

