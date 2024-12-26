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
  { tapLimit: 1000, image: '/placeholder.svg' },
  { tapLimit: 2000, image: '/placeholder.svg' },
  { tapLimit: 4000, image: '/placeholder.svg' },
  { tapLimit: 8000, image: '/placeholder.svg' },
  { tapLimit: 16000, image: '/placeholder.svg' },
  { tapLimit: 32000, image: '/placeholder.svg' },
  { tapLimit: 64000, image: '/placeholder.svg' },
  { tapLimit: 128000, image: '/placeholder.svg' },
  { tapLimit: 256000, image: '/placeholder.svg' },
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

