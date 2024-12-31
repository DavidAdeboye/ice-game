import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

interface User {
  telegramUsername: string
  referralCode: string
  referredBy: string | null
  referrals: string[]
}

const users: User[] = []

export async function POST(request: Request) {
  const { telegramUsername } = await request.json()
  
  let user = users.find(u => u.telegramUsername === telegramUsername)
  
  if (!user) {
    user = {
      telegramUsername,
      referralCode: uuidv4(),
      referredBy: null,
      referrals: []
    }
    users.push(user)
  }

  return NextResponse.json({ referralCode: user.referralCode })
}

export async function PUT(request: Request) {
  const { telegramUsername, referralCode } = await request.json()
  
  const referrer = users.find(u => u.referralCode === referralCode)
  const user = users.find(u => u.telegramUsername === telegramUsername)

  if (referrer && user && !user.referredBy) {
    user.referredBy = referrer.telegramUsername
    referrer.referrals.push(user.telegramUsername)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false }, { status: 400 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const telegramUsername = searchParams.get('username')

  const user = users.find(u => u.telegramUsername === telegramUsername)

  if (user) {
    return NextResponse.json({ referrals: user.referrals })
  }

  return NextResponse.json({ referrals: [] })
}

