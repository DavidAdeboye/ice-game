'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGame } from "@/context/game-context"
import Image from "next/image"
import { ArrowRight, Check, Coins } from 'lucide-react'

const TASKS = [
  {
    id: 'daily-1',
    title: 'Daily Task',
    reward: 1000,
    progress: { current: 1, total: 3 },
    image: '/placeholder.svg'
  },
  {
    id: 'weekly-1',
    title: 'Weekly Challenge',
    reward: 5000,
    progress: { current: 3, total: 5 },
    image: '/placeholder.svg'
  },
  {
    id: 'special-1',
    title: 'Special Event',
    reward: 10000,
    image: '/placeholder.svg'
  },
  {
    id: 'achievement-1',
    title: 'First Achievement',
    reward: 2500,
    image: '/placeholder.svg'
  },
  {
    id: 'social-1',
    title: 'Social Task',
    reward: 3000,
    progress: { current: 0, total: 5 },
    image: '/placeholder.svg'
  }
]

export default function Earn() {
  const { completedTasks, completeTask, addCoins } = useGame()

  const handleCompleteTask = (taskId: string, reward: number) => {
    if (!completedTasks.includes(taskId)) {
      completeTask(taskId)
      addCoins(reward)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Earn Ice</h1>
        <p className="text-gray-400">Complete tasks to earn ice rewards</p>
      </div>

      <div className="space-y-4">
        {TASKS.map((task) => {
          const isCompleted = completedTasks.includes(task.id)
          return (
            <Card 
              key={task.id} 
              className={`p-4 bg-gray-900/50 transition-opacity duration-300 ${isCompleted ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
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
                  size="icon"
                  onClick={() => handleCompleteTask(task.id, task.reward)}
                  disabled={isCompleted}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    task.progress ? <ArrowRight className="w-6 h-6" /> : <Check className="w-6 h-6" />
                  )}
                </Button>
              </div>
              {task.progress && (
                <>
                  <Progress 
                    value={(task.progress.current / task.progress.total) * 100} 
                    className="h-2" 
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>Progress</span>
                    <span>{task.progress.current}/{task.progress.total}</span>
                  </div>
                </>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

