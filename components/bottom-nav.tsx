"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  HomeIcon as HomeOutline,
  ChartBarIcon as ChartOutline,
  TrophyIcon as TrophyOutline,
  Cog8ToothIcon as SettingsOutline,
  PlusIcon as PlusOutline
} from "@heroicons/react/24/outline"
import {
  HomeIcon as HomeSolid,
  ChartBarIcon as ChartSolid,
  TrophyIcon as TrophySolid,
  Cog8ToothIcon as SettingsSolid,
  PlusIcon as PlusSolid
} from "@heroicons/react/24/solid"
import { AddHabitModal } from "@/components/add-habit-modal"
import { useHabits } from "@/hooks/use-habits"

const navItems = [
  { href: "/", outlineIcon: HomeOutline, solidIcon: HomeSolid, isAction: false },
  { href: "/statistics", outlineIcon: ChartOutline, solidIcon: ChartSolid, isAction: false },
  { href: "#", outlineIcon: PlusOutline, solidIcon: PlusSolid, isAction: true },
  { href: "/trophies", outlineIcon: TrophyOutline, solidIcon: TrophySolid, isAction: false },
  { href: "/settings", outlineIcon: SettingsOutline, solidIcon: SettingsSolid, isAction: false },
]

export function BottomNav() {
  const pathname = usePathname()
  const { addHabit, mounted } = useHabits()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!mounted) return null

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 safe-bottom w-full max-w-[340px] px-4">
        <nav className="bg-card/95 backdrop-blur-xl border border-border rounded-full p-2 shadow-2xl flex items-center justify-between relative">
          {navItems.map((item, i) => {
            if (item.isAction) {
              return (
                <button
                  key="action"
                  onClick={() => setIsModalOpen(true)}
                  className="relative z-10 w-[50px] h-[50px] rounded-full flex items-center justify-center shrink-0 touch-feedback group"
                  aria-label="Adicionar hábito"
                >
                  <div className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform group-active:scale-95 group-hover:scale-105 duration-200" />
                  <item.solidIcon className="h-6 w-6 text-primary-foreground relative z-10" />
                </button>
              )
            }

            const isActive = pathname === item.href
            const Icon = isActive ? item.solidIcon : item.outlineIcon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative z-10 w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors touch-feedback",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-[22px] w-[22px] transition-transform duration-300", isActive ? "scale-110" : "scale-100")} />
              </Link>
            )
          })}
        </nav>
      </div>

      <AddHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addHabit} />
    </>
  )
}

