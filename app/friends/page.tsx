'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Copy, Check } from 'lucide-react'
import { useGame } from '@/context/game-context'

export default function Friends() {
  const { addCoins } = useGame()
  const [referralLink, setReferralLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [friends, setFriends] = useState<string[]>([])

  useEffect(() => {
    // Generate a unique referral link
    const uniqueId = Math.random().toString(36).substring(2, 15)
    setReferralLink(`https://yourgame.com/refer/${uniqueId}`)

    // Load friends from localStorage
    const storedFriends = localStorage.getItem('friends')
    if (storedFriends) {
      setFriends(JSON.parse(storedFriends))
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInvite = () => {
    // Simulate inviting a friend
    const newFriend = `Friend${friends.length + 1}`
    const updatedFriends = [...friends, newFriend]
    setFriends(updatedFriends)
    localStorage.setItem('friends', JSON.stringify(updatedFriends))
    addCoins(5000) // Reward for inviting a friend
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Invite Friends!</h1>
        <p className="text-gray-400">
          You and your friend will receive bonuses
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <Card className="p-4 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/placeholder.svg"
                alt="Gift"
                width={40}
                height={40}
              />
              <div>
                <h3 className="font-semibold">Invite a friend</h3>
                <div className="flex items-center gap-2">
                  <Image
                    src="/placeholder.svg"
                    alt="Ice"
                    width={20}
                    height={20}
                  />
                  <span className="text-yellow-400">+5.00K for you and your friend</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/placeholder.svg"
                alt="Premium Gift"
                width={40}
                height={40}
              />
              <div>
                <h3 className="font-semibold">Invite a friend with Telegram Premium</h3>
                <div className="flex items-center gap-2">
                  <Image
                    src="/placeholder.svg"
                    alt="Ice"
                    width={20}
                    height={20}
                  />
                  <span className="text-yellow-400">+25.00K for you and your friend</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-gray-800 text-white p-2 rounded"
          />
          <Button onClick={handleCopy} variant="outline" size="icon">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">List of your friends ({friends.length})</h2>
        {friends.length > 0 ? (
          <Card className="p-4 bg-gray-900/50">
            <ul>
              {friends.map((friend, index) => (
                <li key={index} className="text-gray-300">{friend}</li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="p-4 bg-gray-900/50 text-center text-gray-400">
            You haven&apos;t invited anyone yet
          </Card>
        )}
      </div>

      <div className="flex gap-4">
        <Button className="flex-1" size="lg" onClick={handleInvite}>
          Invite friend
        </Button>
      </div>
    </div>
  )
}

