"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline"
import type { ReactNode } from "react"

interface HabitHeaderProps {
  title: string
  habitId?: string
  onShare?: () => void
  rightAction?: ReactNode
}

export function HabitHeader({ title, habitId, onShare, rightAction }: HabitHeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-2 py-3 shrink-0 bg-transparent">
      <button
        onClick={() => router.back()}
        className="p-2.5 hover:bg-muted active:bg-muted/80 rounded-xl transition-colors touch-feedback"
        aria-label="Voltar"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <h1 className="font-semibold text-foreground text-sm sm:text-base truncate max-w-[60%]">{title}</h1>
      {rightAction ? (
        rightAction
      ) : (
        <div className="w-10" />
      )}
    </header>
  )
}
