'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGame } from "@/context/game-context"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { ArrowRight, Check, Coins, Gift, Star, AlertTriangle } from 'lucide-react'

interface Task {
  id: string;
  title: string;
  reward: number;
  image: string;
  link: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 'youtube-1',
    title: 'Watch Tutorial Video',
    reward: 1000,
    image: '/youtube.svg',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'twitter-1',
    title: 'Follow on Twitter',
    reward: 500,
    image: '/twitter-x.svg',
    link: 'https://twitter.com/example'
  },
  {
    id: 'telegram-1',
    title: 'Join Telegram Channel',
    reward: 750,
    image: '/telegram.svg',
    link: 'https://t.me/example'
  },
  {
    id: 'discord-1',
    title: 'Join Discord Server',
    reward: 600,
    image: '/discord.svg',
    link: 'https://discord.gg/example'
  },
  {
    id: 'medium-1',
    title: 'Read Blog Post',
    reward: 300,
    image: '/blog.svg',
    link: 'https://medium.com/example'
  }
]

interface DailyReward {
  day: number
  coins: number
  special?: boolean
}

const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 100 },
  { day: 2, coins: 200 },
  { day: 3, coins: 300 },
  { day: 4, coins: 400 },
  { day: 5, coins: 500 },
  { day: 6, coins: 750 },
  { day: 7, coins: 1500, special: true },
]

export default function Earn() {
  const { completedTasks, completeTask, addCoins } = useGame()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [waitingTasks, setWaitingTasks] = useState<Record<string, number>>({})
  const [taskToComplete, setTaskToComplete] = useState<{ id: string, reward: number } | null>(null)
  const [currentStreak, setCurrentStreak] = useState(1)
  const [lastClaim, setLastClaim] = useState<string | null>(null)
  const [canClaim, setCanClaim] = useState(false)

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aCompleted = completedTasks.includes(a.id)
      const bCompleted = completedTasks.includes(b.id)
      if (aCompleted === bCompleted) return 0
      return aCompleted ? 1 : -1
    })
  }, [tasks, completedTasks])

  const handleCompleteTask = useCallback((taskId: string, reward: number) => {
    setTaskToComplete({ id: taskId, reward })
  }, [])

  useEffect(() => {
    if (taskToComplete && !completedTasks.includes(taskToComplete.id)) {
      completeTask(taskToComplete.id)
      addCoins(taskToComplete.reward)
      toast({
        title: "Task Completed",
        description: `You earned ${taskToComplete.reward} coins!`,
      })
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter(task => task.id !== taskToComplete.id)
        const completedTask = prevTasks.find(task => task.id === taskToComplete.id)
        if (completedTask) {
          updatedTasks.push(completedTask)
        }
        return updatedTasks
      })
      setTaskToComplete(null)
    }
  }, [taskToComplete, completedTasks, completeTask, addCoins, toast])

  useEffect(() => {
    const timer = setInterval(() => {
      setWaitingTasks((prev) => {
        const newWaiting = { ...prev }
        Object.keys(newWaiting).forEach((taskId) => {
          if (newWaiting[taskId] > 0) {
            newWaiting[taskId]--
          } else {
            delete newWaiting[taskId]
            const task = tasks.find(t => t.id === taskId)
            if (task) {
              handleCompleteTask(taskId, task.reward)
            }
          }
        })
        return newWaiting
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [tasks, handleCompleteTask])

  const handleTaskStart = (task: Task) => {
    if (!completedTasks.includes(task.id) && !waitingTasks[task.id]) {
      window.open(task.link, '_blank')
      setWaitingTasks((prev) => ({ ...prev, [task.id]: 10 }))
      toast({
        title: "Task Started",
        description: "Wait 10 seconds before completing this task.",
      })
    }
  }

  useEffect(() => {
    const savedStreak = localStorage.getItem('dailyStreak')
    const savedLastClaim = localStorage.getItem('lastClaim')
    
    if (savedStreak) setCurrentStreak(Number(savedStreak))
    if (savedLastClaim) setLastClaim(savedLastClaim)

    const now = new Date()
    const lastClaimDate = savedLastClaim ? new Date(savedLastClaim) : null
    
    if (lastClaimDate) {
      const timeDiff = now.getTime() - lastClaimDate.getTime()
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      
      if (daysDiff > 1) {
        setCurrentStreak(1)
        localStorage.setItem('dailyStreak', '1')
        toast({
          title: "Streak Reset!",
          description: "You missed a day. Your streak has been reset.",
          variant: "destructive",
        })
      }
      
      setCanClaim(daysDiff >= 1)
    } else {
      setCanClaim(true)
    }
  }, [])

  const handleClaim = () => {
    if (!canClaim) return

    const reward = DAILY_REWARDS[(currentStreak - 1) % 7]
    addCoins(reward.coins)
    
    const now = new Date()
    setLastClaim(now.toISOString())
    localStorage.setItem('lastClaim', now.toISOString())
    
    const newStreak = currentStreak % 7 === 0 ? 1 : currentStreak + 1
    setCurrentStreak(newStreak)
    localStorage.setItem('dailyStreak', String(newStreak))
    
    setCanClaim(false)
    
    toast({
      title: "Reward Claimed!",
      description: `You received ${reward.coins} coins!`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20 bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Earn Ice</h1>
        <p className="text-gray-300">Complete tasks and claim daily rewards to earn ice</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Daily Rewards</h2>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {DAILY_REWARDS.map((reward, index) => {
            const isActive = index === (currentStreak - 1) % 7
            const isPast = index < (currentStreak - 1) % 7
            return (
              <Card
                key={reward.day}
                className={`p-2 relative overflow-hidden transition-all duration-300 
                  ${isActive ? 'bg-emerald-900/50 border-emerald-500' : 'bg-gray-800/50 border-gray-700'}
                  ${isPast ? 'opacity-50' : ''}
                  ${reward.special ? 'border-2' : 'border'}
                `}
              >
                {reward.special && (
                  <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none" />
                )}
                <div className="flex flex-col items-center justify-center h-full">
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                    {reward.special ? (
                      <Star className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Gift className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-center mt-1">
                    <div className="text-xs font-semibold">Day {reward.day}</div>
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">+{reward.coins}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        <Button
          onClick={handleClaim}
          disabled={!canClaim}
          className={`w-full ${canClaim ? 'animate-pulse' : ''}`}
        >
          {canClaim ? 'Claim Daily Reward' : 'Already Claimed'}
        </Button>
        {!canClaim && lastClaim && (
          <p className="text-sm text-gray-400 mt-2 text-center">
            Next reward available at: {new Date(new Date(lastClaim).getTime() + 24 * 60 * 60 * 1000).toLocaleTimeString()}
          </p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="space-y-4">
        {sortedTasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id)
          const isWaiting = waitingTasks[task.id] > 0
          return (
            <Card 
              key={task.id} 
              className={`p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl transition-all duration-300 ${isCompleted ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={task.image}
                    alt={task.title}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">+{task.reward}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => !isCompleted && handleTaskStart(task)}
                  disabled={isCompleted || isWaiting}
                  className="flex items-center gap-2"
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Completed</span>
                    </>
                  ) : isWaiting ? (
                    <>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                      <span>In Progress</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Start Task</span>
                    </>
                  )}
                </Button>
              </div>
              {isWaiting && (
                <div className="mt-2">
                  <Progress value={(10 - waitingTasks[task.id]) / 10 * 100} className="h-2" />
                  <p className="text-sm text-gray-400 mt-1">Wait {waitingTasks[task.id]} seconds</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

