'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'securepassword123'

interface User {
  telegramId: number
  telegramUsername?: string
  firstName: string
  lastName?: string
  languageCode?: string
  isPremium?: boolean
  device: string
  ipAddress: string
  coins: number
  minerLevel: number
  icePerHour: number
  walletAddress: string | null
  lastActive: string
  isOnline: boolean
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    }

    if (isAuthenticated) {
      fetchUsers()
      const interval = setInterval(fetchUsers, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Invalid credentials')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">Admin Login</h1>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Card className="p-4 overflow-x-auto bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Telegram ID</TableHead>
              <TableHead className="text-white">Username</TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Premium</TableHead>
              <TableHead className="text-white">Coins</TableHead>
              <TableHead className="text-white">Miner Level</TableHead>
              <TableHead className="text-white">Ice per Hour</TableHead>
              <TableHead className="text-white">Wallet Address</TableHead>
              <TableHead className="text-white">Last Active</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">IP Address</TableHead>
              <TableHead className="text-white">Device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.telegramId}>
                <TableCell className="text-white">{user.telegramId}</TableCell>
                <TableCell className="text-white">{user.telegramUsername || 'N/A'}</TableCell>
                <TableCell className="text-white">{`${user.firstName} ${user.lastName || ''}`}</TableCell>
                <TableCell className="text-white">{user.isPremium ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-white">{user.coins}</TableCell>
                <TableCell className="text-white">{user.minerLevel}</TableCell>
                <TableCell className="text-white">{user.icePerHour}</TableCell>
                <TableCell className="text-white">{user.walletAddress || 'Not connected'}</TableCell>
                <TableCell className="text-white">{new Date(user.lastActive).toLocaleString()}</TableCell>
                <TableCell className="text-white">{user.isOnline ? 'Online' : 'Offline'}</TableCell>
                <TableCell className="text-white">{user.ipAddress}</TableCell>
                <TableCell className="text-white">{user.device}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

