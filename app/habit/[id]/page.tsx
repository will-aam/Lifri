"use client"

import { useState, useEffect, use } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MobileShell } from "@/components/mobile-shell"
import { HabitHeader } from "@/components/habit-header"
import { CircularProgress } from "@/components/circular-progress"
import { Calendar } from "@/components/calendar"
import { ResetTimerModal } from "@/components/reset-timer-modal"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/use-habits"
import { formatDurationLong, getElapsedSeconds } from "@/lib/utils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  BookOpenIcon as BookOpenOutline,
  SparklesIcon as SparklesOutline,
  ChartBarIcon as ChartBarOutline,
  TrophyIcon as TrophyOutline,
  ArrowPathIcon
} from "@heroicons/react/24/outline"
import {
  BookOpenIcon as BookOpenSolid,
  SparklesIcon as SparklesSolid,
  ChartBarIcon as ChartBarSolid,
  TrophyIcon as TrophySolid
} from "@heroicons/react/24/solid"

interface HabitDetailPageProps {
  params: Promise<{ id: string }>
}

export default function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const pathname = usePathname()
  const { habits, resetTimer, getHabitRelapses, mounted } = useHabits()
  const [elapsed, setElapsed] = useState(0)
  const [showResetModal, setShowResetModal] = useState(false)

  const habit = habits.find((h) => h.id === id)
  const relapses = habit ? getHabitRelapses(habit.id) : []

  useEffect(() => {
    if (!habit) return

    setElapsed(getElapsedSeconds(habit.startDate))
    const interval = setInterval(() => {
      setElapsed(getElapsedSeconds(habit.startDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [habit])

  if (!mounted) {
    return (
      <MobileShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileShell>
    )
  }

  if (!habit) {
    return (
      <MobileShell>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-muted-foreground mb-4 text-sm">Habito nao encontrado</p>
          <Button onClick={() => router.push("/")}>Voltar ao inicio</Button>
        </div>
      </MobileShell>
    )
  }

  const handleReset = (note?: string, relapseDate?: Date) => {
    resetTimer(habit.id, note, relapseDate)
    setShowResetModal(false)
  }

  const handleCalendarRelapse = (date: Date) => {
    resetTimer(habit.id, `Recaida marcada no calendario`, date)
  }

  const navItems = [
    { href: `/habit/${id}/diary`, outlineIcon: BookOpenOutline, solidIcon: BookOpenSolid, isAction: false },
    { href: `/habit/${id}/goals`, outlineIcon: TrophyOutline, solidIcon: TrophySolid, isAction: false },
    { href: "#", outlineIcon: ArrowPathIcon, solidIcon: ArrowPathIcon, isAction: true },
    { href: `/habit/${id}/stats`, outlineIcon: ChartBarOutline, solidIcon: ChartBarSolid, isAction: false },
    { href: `/habit/${id}/reasons`, outlineIcon: SparklesOutline, solidIcon: SparklesSolid, isAction: false },
  ]

  return (
    <MobileShell>
      <HabitHeader title={habit.name} habitId={habit.id} />

      <main className="flex-1 flex flex-col overflow-hidden pb-24">
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Progress Circle */}
          <div className="flex flex-col items-center py-3 sm:py-4">
            <CircularProgress startDate={habit.startDate} goalDays={7} color={habit.color} size={180} />
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">Todos os Dias Estou a Ganhar!</p>
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Tempo de Abstinencia</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{formatDurationLong(elapsed)}</p>
          </div>

          <Calendar
            startDate={habit.startDate}
            relapses={relapses.map((r) => r.date)}
            color={habit.color}
            onMarkRelapse={handleCalendarRelapse}
            editable={true}
          />
        </div>
      </main>

      {/* Details Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 safe-bottom w-full max-w-[340px] px-4">
        <nav className="bg-card/95 backdrop-blur-xl border border-border rounded-full p-2 shadow-2xl flex items-center justify-between relative">
          {navItems.map((item, i) => {
            if (item.isAction) {
              return (
                <button
                  key="action"
                  onClick={() => setShowResetModal(true)}
                  className="relative z-10 w-[50px] h-[50px] rounded-full flex items-center justify-center shrink-0 touch-feedback group"
                  aria-label="Reiniciar cronometro"
                >
                  <div className="absolute inset-0 rounded-full bg-destructive shadow-lg shadow-destructive/30 transition-transform group-active:scale-95 group-hover:scale-105 duration-200" />
                  <item.solidIcon className="h-6 w-6 text-destructive-foreground relative z-10" />
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

      <ResetTimerModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        habitName={habit.name}
        habitStartDate={habit.startDate}
      />
    </MobileShell>
  )
}
