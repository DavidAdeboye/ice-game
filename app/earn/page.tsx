'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGame } from "@/context/game-context"
import Image from "next/image"
import { ArrowRight, Check, Coins } from 'lucide-react'
import { toast } from '@/hooks/use-toast'


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

export default function Earn() {
  const { completedTasks, completeTask, addCoins } = useGame()
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [waitingTasks, setWaitingTasks] = useState<Record<string, number>>({})
  const [taskToComplete, setTaskToComplete] = useState<{ id: string, reward: number } | null>(null)

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
  }, [taskToComplete, completedTasks, completeTask, addCoins])

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

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20 bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Earn Ice</h1>
        <p className="text-gray-300">Complete tasks to earn ice rewards</p>
      </div>

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

