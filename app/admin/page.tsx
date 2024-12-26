'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ADMIN_USERNAME = 'admin123'
const ADMIN_PASSWORD = 'securepass456'

interface User {
  telegramUsername: string
  coins: number
  minerLevel: number
  icePerHour: number
  walletAddress: string | null
  lastActive: string
  isOnline: boolean
  ipAddress: string
  device: string
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
      const interval = setInterval(fetchUsers, 5000) // Refresh every 5 seconds
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
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
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
    <div className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Card className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Coins</TableHead>
              <TableHead>Miner Level</TableHead>
              <TableHead>Ice per Hour</TableHead>
              <TableHead>Wallet Address</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.telegramUsername}>
                <TableCell>{user.telegramUsername}</TableCell>
                <TableCell>{user.coins}</TableCell>
                <TableCell>{user.minerLevel}</TableCell>
                <TableCell>{user.icePerHour}</TableCell>
                <TableCell>{user.walletAddress || 'Not connected'}</TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleString()}</TableCell>
                <TableCell>{user.isOnline ? 'Online' : 'Offline'}</TableCell>
                <TableCell>{user.ipAddress}</TableCell>
                <TableCell>{user.device}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

