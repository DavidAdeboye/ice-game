'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

interface CircleLevel {
  tapLimit: number
  image: string
}

interface User {
  telegramUsername: string
  coins: number
  tappablePoints: number
  maxTappablePoints: number
  refillSpeed: number
  completedTasks: string[]
  walletConnected: boolean
  icePerHour: number
  minerLevel: number
  walletAddress: string | null
  lastActive: Date
  isOnline: boolean
  ipAddress: string
  device: string
  currentCircleLevel: number
  totalTaps: number
  profilePicture: string | null
}

interface GameState extends User {
  addCoins: (amount: number) => void
  removeCoins: (amount: number) => void
  addTappablePoints: (amount: number) => void
  removeTappablePoint: () => void
  completeTask: (taskId: string) => void
  increaseRefillSpeed: (amount: number) => void
  connectWallet: (address: string) => void
  upgradeMiner: () => void
  setUserInfo: (info: Partial<User>) => void
  incrementTotalTaps: () => void
  circleLevels: CircleLevel[]
}

const GameContext = createContext<GameState | null>(null)

const CIRCLE_LEVELS: CircleLevel[] = [
  { 
    tapLimit: 1000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E 2024-12-26 06.50.10 - A flat, 2D minimalist logo for a cryptocurrency airdrop platform named \'ClawFi\'. The design features a skeletal claw gripping a glowing coin with a sl-MEIcdReRlgu30CxErnKwMhBfZNLcNf.webp'
  },
  { 
    tapLimit: 2000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixlr-image-generator-8c3d5e7d-2959-4dc8-8c81-db01e8e0a7ad.png-8NsH8R1FmN5Z9vohVb6YWj1jiSRnpw.webp'
  },
  { 
    tapLimit: 4000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixlr-image-generator-f8feef3a-93c9-4957-b1ae-da265c9b7a5a.png-Cn4zOsB165fGnuvn7jM3V3AZkIBbDa.webp'
  },
  { 
    tapLimit: 8000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixlr-image-generator-a8ae3e32-f498-483b-a023-8f2d0d2c2821.png-BjMV4qGLetvtiPl9s8g6amN2wkCPDb.webp'
  },
  { 
    tapLimit: 16000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixlr-image-generator-2f9edf29-7684-4661-ae05-2c25bfb4259d.png-m17LMvXlA4ZkljRAuORtA1dnI9yUKK.webp'
  },
  { 
    tapLimit: 32000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixlr-image-generator-f4353d9d-16b2-4971-85fd-b69b9aa06277.png-xHvJz5jjQog5DFQC5i5GtSNB2hJqE0.webp'
  },
  { 
    tapLimit: 64000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixlr-image-generator-bcc08d89-6f56-462b-8ab0-5f417a22c727.png-Ey1x8G1TfG2AU9KknG9cD6cazzrZe0.webp'
  },
  { 
    tapLimit: 128000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL·E 2024-12-26 06.50.10 - A flat, 2D minimalist logo for a cryptocurrency airdrop platform named \'ClawFi\'. The design features a skeletal claw gripping a glowing coin with a sl-MEIcdReRlgu30CxErnKwMhBfZNLcNf.webp'
  },
  { 
    tapLimit: 256000, 
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pixlr-image-generator-5a6c6ff5-985a-46b3-9a42-bd859942b568.png-tPkbE6Wl8EQC7g7ujSM6rWPOMjo2Oc.webp'
  },
]

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    telegramUsername: '',
    coins: 1000,
    tappablePoints: 8,
    maxTappablePoints: 8,
    refillSpeed: 1,
    completedTasks: [],
    walletConnected: false,
    icePerHour: 0,
    minerLevel: 0,
    walletAddress: null,
    lastActive: new Date(),
    isOnline: true,
    ipAddress: '',
    device: '',
    currentCircleLevel: 0,
    totalTaps: 0,
    profilePicture: null,
  })

  const initialLoadDone = useRef(false)

  useEffect(() => {
    if (!initialLoadDone.current) {
      const savedState = localStorage.getItem('gameState')
      if (savedState) {
        setUser(JSON.parse(savedState))
      }
      initialLoadDone.current = true
    }
  }, [])

  useEffect(() => {
    if (initialLoadDone.current) {
      localStorage.setItem('gameState', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    const updateActivity = () => {
      setUser(prev => ({ ...prev, lastActive: new Date(), isOnline: true }))
    }

    updateActivity()
    const interval = setInterval(updateActivity, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const refillInterval = setInterval(() => {
      setUser(prev => ({
        ...prev,
        tappablePoints: Math.min(prev.tappablePoints + prev.refillSpeed, prev.maxTappablePoints)
      }))
    }, 1000)

    return () => clearInterval(refillInterval)
  }, [])

  const addCoins = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, coins: prev.coins + amount }))
  }, [])

  const removeCoins = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }))
  }, [])

  const addTappablePoints = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      maxTappablePoints: prev.maxTappablePoints + amount,
      tappablePoints: prev.tappablePoints + amount
    }))
  }, [])

  const removeTappablePoint = useCallback(() => {
    setUser(prev => ({ ...prev, tappablePoints: Math.max(0, prev.tappablePoints - 1) }))
  }, [])

  const completeTask = useCallback((taskId: string) => {
    setUser(prev => ({ ...prev, completedTasks: [...prev.completedTasks, taskId] }))
  }, [])

  const increaseRefillSpeed = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, refillSpeed: prev.refillSpeed + amount }))
  }, [])

  const connectWallet = useCallback((address: string) => {
    setUser(prev => ({ ...prev, walletConnected: true, walletAddress: address }))
  }, [])

  const upgradeMiner = useCallback(() => {
    setUser(prev => {
      const upgradeCost = Math.floor(1000 * Math.pow(1.15, prev.minerLevel))
      if (prev.coins >= upgradeCost) {
        return {
          ...prev,
          coins: prev.coins - upgradeCost,
          minerLevel: prev.minerLevel + 1,
          icePerHour: prev.icePerHour + 120 * Math.pow(1.1, prev.minerLevel)
        }
      }
      return prev
    })
  }, [])

  const setUserInfo = useCallback((info: Partial<User>) => {
    setUser(prev => ({ ...prev, ...info }))
  }, [])

  const incrementTotalTaps = useCallback(() => {
    setUser(prev => {
      const newTotalTaps = prev.totalTaps + 1
      const newCircleLevel = CIRCLE_LEVELS.findIndex(level => newTotalTaps < level.tapLimit)
      return {
        ...prev,
        totalTaps: newTotalTaps,
        currentCircleLevel: newCircleLevel === -1 ? CIRCLE_LEVELS.length - 1 : newCircleLevel
      }
    })
  }, [])

  return (
    <GameContext.Provider 
      value={{
        ...user,
        addCoins,
        removeCoins,
        addTappablePoints,
        removeTappablePoint,
        completeTask,
        increaseRefillSpeed,
        connectWallet,
        upgradeMiner,
        setUserInfo,
        incrementTotalTaps,
        circleLevels: CIRCLE_LEVELS
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

