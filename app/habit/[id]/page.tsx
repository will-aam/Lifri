"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/mobile-shell"
import { HabitHeader } from "@/components/habit-header"
import { CircularProgress } from "@/components/circular-progress"
import { Calendar } from "@/components/calendar"
import { ResetTimerModal } from "@/components/reset-timer-modal"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/use-habits"
import { formatDurationLong, getElapsedSeconds, formatMoney, calculateSavings } from "@/lib/utils"
import { Book, Sparkles, BarChart3, Trophy, RotateCcw } from "lucide-react"
import Link from "next/link"

interface HabitDetailPageProps {
  params: Promise<{ id: string }>
}

export default function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
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

  return (
    <MobileShell>
      <HabitHeader title={habit.name} habitId={habit.id} />

      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 pb-8 space-y-4">
          {/* Progress Circle */}
          <div className="flex flex-col items-center py-3 sm:py-4">
            <CircularProgress startDate={habit.startDate} goalDays={7} color={habit.color} size={180} />
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">Todos os Dias Estou a Ganhar!</p>
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-1 pb-4 border-b border-border">
            <p className="text-xs sm:text-sm text-muted-foreground">Tempo de Abstinencia</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{formatDurationLong(elapsed)}</p>
            {habit.costPerDay && habit.costPerDay > 0 && (
              <p className="text-success font-medium text-sm">
                Economizado: {formatMoney(calculateSavings(habit.costPerDay, elapsed))}
              </p>
            )}
          </div>

          <Calendar
            startDate={habit.startDate}
            relapses={relapses.map((r) => r.date)}
            color={habit.color}
            onMarkRelapse={handleCalendarRelapse}
            editable={true}
          />

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full h-11 sm:h-12 text-destructive border-destructive/30 hover:bg-destructive/10 active:bg-destructive/20 bg-transparent gap-2 text-sm sm:text-base"
            onClick={() => setShowResetModal(true)}
          >
            <RotateCcw className="h-4 w-4" />
            Resetar Timer
          </Button>

          {/* Quick Links */}
          <div className="space-y-2">
            <Link href={`/habit/${id}/diary`} className="block">
              <div className="bg-card border border-border rounded-xl p-3.5 sm:p-4 active:border-primary/30 transition-colors flex items-center gap-3 sm:gap-4 card-press">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Book className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base">Ver Diario</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Registre seus pensamentos</p>
                </div>
              </div>
            </Link>

            <Link href={`/habit/${id}/goals`} className="block">
              <div className="bg-card border border-border rounded-xl p-3.5 sm:p-4 active:border-primary/30 transition-colors flex items-center gap-3 sm:gap-4 card-press">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base">Trofeus</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Veja suas conquistas</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Options Section */}
          <div className="pt-2">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2.5 sm:mb-3">
              Opcoes
            </h3>
            <div className="space-y-2">
              <Link href={`/habit/${id}/stats`} className="block">
                <div className="bg-card border border-border rounded-xl p-3.5 sm:p-4 active:border-primary/30 transition-colors flex items-center gap-3 sm:gap-4 card-press">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Estatisticas</span>
                </div>
              </Link>

              <Link href={`/habit/${id}/reasons`} className="block">
                <div className="bg-card border border-border rounded-xl p-3.5 sm:p-4 active:border-primary/30 transition-colors flex items-center gap-3 sm:gap-4 card-press">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 shrink-0" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Minhas Razoes</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

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
