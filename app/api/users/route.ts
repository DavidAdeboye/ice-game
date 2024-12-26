import { NextResponse } from 'next/server'

interface User {
  telegramUsername: string;
  coins: number;
  minerLevel: number;
  icePerHour: number;
  walletAddress: string | null;
  lastActive: string;
  isOnline: boolean;
  ipAddress: string;
  device: string;
}

const users: User[] = []

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const userData = await request.json() as User
  const existingUserIndex = users.findIndex(u => u.telegramUsername === userData.telegramUsername)

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = { ...users[existingUserIndex], ...userData }
  } else {
    users.push(userData)
  }

  return NextResponse.json({ success: true })
}

