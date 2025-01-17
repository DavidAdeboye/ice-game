'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Settings, Rocket, Zap, Coins } from 'lucide-react'
import Image from "next/image"
import { useGame } from '@/context/game-context'
import Link from 'next/link'
import { SplashScreen } from "@/components/splash-screen"
import { TelegramAuth } from "@/components/telegram-auth"

export default function Home() {
  const { 
    coins, 
    tappablePoints, 
    maxTappablePoints, 
    removeTappablePoint, 
    addCoins, 
    refillSpeed, 
    incrementTotalTaps,
    currentCircleLevel,
    totalTaps,
    circleLevels,
    user
  } = useGame()

  const [activeTouches, setActiveTouches] = useState(0)
  const [showSplash, setShowSplash] = useState(true)
  const circleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedHomepage')
    if (hasVisited) {
      setShowSplash(false)
    } else {
      localStorage.setItem('hasVisitedHomepage', 'true')
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleTap = () => {
    if (tappablePoints > 0) {
      removeTappablePoint()
      addCoins(1) // Add 1 coin per tap
      incrementTotalTaps()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setActiveTouches(e.touches.length)
    for (let i = 0; i < e.touches.length; i++) {
      handleTap()
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    setActiveTouches(e.touches.length)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    setActiveTouches(e.touches.length)
  }

  const currentCircle = circleLevels[currentCircleLevel]
  const nextCircle = circleLevels[currentCircleLevel + 1]
  const remainingTaps = nextCircle ? nextCircle.tapLimit - totalTaps : 0
  const progressPercentage = ((totalTaps - (currentCircle?.tapLimit || 0)) / (nextCircle?.tapLimit - (currentCircle?.tapLimit || 0))) * 100

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <>
      <TelegramAuth />
      <div className="flex flex-col min-h-screen p-4 pb-20 bg-[#1a1b1e]">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <Image
                src={user?.profilePicture || "/placeholder.svg"}
                alt="Profile Picture"
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold text-white">{user?.telegramUsername || "User"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">{Math.floor(coins)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-300">Sync</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-black/40 backdrop-blur-sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="flex flex-col items-center mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/placeholder.svg"
              alt="Ice Cubes"
              width={40}
              height={40}
            />
            <span className="text-3xl font-bold text-white">{totalTaps}</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-8">Ice Cube Intern • {currentCircleLevel + 1}/9</h2>

          <button
            ref={circleRef}
            onClick={handleTap}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            disabled={tappablePoints === 0}
            className="relative w-64 h-64 mb-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1b1e] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src={currentCircle.image}
              alt="Character"
              fill
              className="object-cover"
            />
            {activeTouches > 0 && (
              <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{activeTouches}x</span>
              </div>
            )}
          </button>

          <div className="w-full max-w-sm mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-white">Progress to next level</span>
              <span className="text-white">{remainingTaps} taps remaining</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-gray-800" />
          </div>

          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-white">Taps: {tappablePoints}/{maxTappablePoints}</span>
              </div>
              <Link href="/boost">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  <span className="font-medium text-white">Boost</span>
                </Button>
              </Link>
            </div>
            <Progress value={(tappablePoints / maxTappablePoints) * 100} className="h-2 bg-gray-800" />
            <p className="text-sm text-gray-400 mt-1">Refill speed: {refillSpeed} per second</p>
          </div>
        </div>
      </div>
    </>
  )
}

