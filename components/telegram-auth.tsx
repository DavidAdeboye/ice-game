'use client'

import { useEffect } from 'react'
import { useGame } from '@/context/game-context'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
          };
        };
      };
    };
  }
}

export function TelegramAuth() {
  const { setUserInfo } = useGame()

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData
    const user = window.Telegram?.WebApp?.initDataUnsafe.user

    if (initData && user) {
      setUserInfo({
        telegramUsername: user.username || `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`,
        profilePicture: `https://avatars.githubusercontent.com/u/${user.id}?v=4`, // This is a placeholder. Telegram doesn't provide profile pictures directly.
        device: navigator.userAgent,
        ipAddress: '', // You would need to get this from the server side
      })

      // Send user data to the server
      fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user.id,
          telegramUsername: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          languageCode: user.language_code,
          isPremium: user.is_premium,
          device: navigator.userAgent,
          ipAddress: '',
        }),
      })
    }
  }, [setUserInfo])

  return null
}

