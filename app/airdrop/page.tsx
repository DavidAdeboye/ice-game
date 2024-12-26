'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ChevronRight, Wallet } from 'lucide-react'
import { useGame } from "@/context/game-context"

interface TonWindow extends Window {
  ton?: {
    send: (method: string) => Promise<string[]>;
  };
}

declare global {
  interface Window extends TonWindow {
    [key: string]: unknown;
  }
}

export default function Airdrop() {
  const { walletConnected, connectWallet } = useGame()
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    // Check if wallet was previously connected
    const storedWalletAddress = localStorage.getItem('walletAddress')
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress)
      connectWallet(storedWalletAddress)
    }
  }, [connectWallet])

  const handleConnectWallet = async () => {
    if (typeof window.ton !== 'undefined') {
      try {
        const accounts = await window.ton.send('ton_requestAccounts')
        const address = accounts[0]
        setWalletAddress(address)
        localStorage.setItem('walletAddress', address)
        connectWallet(address)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install a TON wallet extension')
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/placeholder.svg"
          alt="Airdrop"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">Airdrop Tasks</h1>
        <p className="text-gray-400 text-center">
          There is a list of challenges below. Complete them to qualify for the Airdrop.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Wallet</h2>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between h-16"
            onClick={handleConnectWallet}
            disabled={walletConnected}
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-blue-400" />
              <span className="text-lg">
                {walletConnected ? `TON Wallet Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect your TON wallet'}
              </span>
            </div>
            {!walletConnected && <ChevronRight className="w-6 h-6" />}
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <div className="space-y-4">
            <Card className="p-4 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg"
                    alt="Frost Elixir"
                    width={40}
                    height={40}
                  />
                  <div>
                    <h3 className="font-semibold">Frost Elixir</h3>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/placeholder.svg"
                        alt="Ice"
                        width={20}
                        height={20}
                      />
                      <span>+1000000</span>
                    </div>
                  </div>
                </div>
                <span className="text-xl font-bold">1.00 TON</span>
              </div>
            </Card>

            <Card className="p-4 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg"
                    alt="Ice Age Advancement"
                    width={40}
                    height={40}
                  />
                  <div>
                    <h3 className="font-semibold">Ice Age Advancement</h3>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/placeholder.svg"
                        alt="Ice"
                        width={20}
                        height={20}
                      />
                      <span>+400000</span>
                    </div>
                  </div>
                </div>
                <span className="text-xl font-bold">0.50 TON</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

