"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, Pickaxe, DollarSign, CuboidIcon as Cube, Gift } from 'lucide-react'

const navItems = [
  { icon: Cube, label: "Game", href: "/" },
  { icon: Pickaxe, label: "Mine", href: "/mine" },
  { icon: Users, label: "Friends", href: "/friends" },
  { icon: DollarSign, label: "Earn", href: "/earn" },
  { icon: Gift, label: "Airdrop", href: "/airdrop" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-4",
                isActive ? "text-blue-400" : "text-gray-400"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

