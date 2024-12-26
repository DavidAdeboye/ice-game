import { NextResponse } from 'next/server'

// This would be replaced with a real database in a production app
let users: any[] = []

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const userData = await request.json()
  const existingUserIndex = users.findIndex(u => u.telegramUsername === userData.telegramUsername)

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = { ...users[existingUserIndex], ...userData }
  } else {
    users.push(userData)
  }

  return NextResponse.json({ success: true })
}