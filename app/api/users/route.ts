import { NextResponse } from 'next/server'

interface User {
  telegramId: number;
  telegramUsername?: string;
  firstName: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
  device: string;
  ipAddress: string;
  coins: number;
  minerLevel: number;
  icePerHour: number;
  walletAddress: string | null;
  lastActive: string;
  isOnline: boolean;
}

const users: User[] = []

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const userData = await request.json() as User
  const existingUserIndex = users.findIndex(u => u.telegramId === userData.telegramId)

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = { 
      ...users[existingUserIndex], 
      ...userData,
      lastActive: new Date().toISOString(),
      isOnline: true
    }
  } else {
    users.push({
      ...userData,
      coins: 1000,
      minerLevel: 0,
      icePerHour: 0,
      walletAddress: null,
      lastActive: new Date().toISOString(),
      isOnline: true
    })
  }

  return NextResponse.json({ success: true })
}

