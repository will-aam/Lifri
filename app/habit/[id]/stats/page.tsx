"use client"

import { useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { MobileShell } from "@/components/mobile-shell"
import { HabitHeader } from "@/components/habit-header"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/use-habits"
import { formatDuration } from "@/lib/utils"
import { Calendar, TrendingUp, TrendingDown, Activity, Clock, RotateCcw, Share2, Hourglass } from "lucide-react"

export default function StatsPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { habits, getHabitRelapses, mounted } = useHabits()

  const habit = habits.find((h) => h.id === id)
  const relapses = habit ? getHabitRelapses(habit.id) : []

  const statistics = useMemo(() => {
    if (!habit) return null

    const now = new Date()
    const currentAbstinence = Math.floor((now.getTime() - habit.startDate.getTime()) / 1000)

    // Todas as duracoes: anteriores (relapses) + atual
    const previousDurations = relapses.map((r) => r.duration)
    const allDurations = [...previousDurations, currentAbstinence]

    // Ordenar relapses por data para pegar o mais recente
    const sortedRelapses = [...relapses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const lastRelapse = sortedRelapses[0]
    const previousAbstinence = lastRelapse ? lastRelapse.duration : 0

    // Calcular estatisticas
    const maxAbstinence = allDurations.length > 0 ? Math.max(...allDurations) : 0
    const minAbstinence = allDurations.length > 0 ? Math.min(...allDurations) : 0
    const avgAbstinence = allDurations.length > 0 ? allDurations.reduce((a, b) => a + b, 0) / allDurations.length : 0

    return {
      currentAbstinence,
      maxAbstinence,
      minAbstinence,
      avgAbstinence,
      previousAbstinence,
      totalResets: relapses.length,
    }
  }, [habit, relapses])

  if (!mounted) {
    return (
      <MobileShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileShell>
    )
  }

  if (!habit || !statistics) {
    return (
      <MobileShell>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-muted-foreground mb-4 text-sm">Habito nao encontrado</p>
          <Button onClick={() => router.push("/")}>Voltar ao inicio</Button>
        </div>
      </MobileShell>
    )
  }

  const stats = [
    {
      icon: Calendar,
      label: "O dia em que desistiu",
      value: habit.startDate.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    {
      icon: TrendingUp,
      label: "Periodo maximo de abstinencia",
      value: statistics.maxAbstinence > 0 ? formatDuration(statistics.maxAbstinence) : "Ainda sem dados",
    },
    {
      icon: TrendingDown,
      label: "Periodo minimo de abstinencia",
      value: statistics.minAbstinence > 0 ? formatDuration(statistics.minAbstinence) : "Ainda sem dados",
    },
    {
      icon: Activity,
      label: "Periodo em media de abstinencia",
      value: statistics.avgAbstinence > 0 ? formatDuration(Math.round(statistics.avgAbstinence)) : "Ainda sem dados",
    },
    {
      icon: Hourglass,
      label: "Tempo anterior de abstinencia",
      value:
        statistics.previousAbstinence > 0 ? formatDuration(statistics.previousAbstinence) : "Sem recaidas anteriores",
    },
    {
      icon: RotateCcw,
      label: "Numero de reinicializacoes do cronometro",
      value: statistics.totalResets.toString(),
    },
  ]

  return (
    <MobileShell>
      <HabitHeader
        title={habit.name}
        habitId={habit.id}
        rightAction={
          <button className="p-2.5 hover:bg-muted active:bg-muted/80 rounded-xl transition-colors touch-feedback">
            <Share2 className="h-5 w-5 text-primary" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto overscroll-contain">
        {/* Section Header */}
        <div className="bg-muted/50 border-b border-border">
          <div className="px-4 py-2.5 sm:py-3">
            <h2 className="text-xs sm:text-sm font-medium text-muted-foreground">Estatistica</h2>
          </div>
        </div>

        {/* Stats List */}
        <div className="divide-y divide-border">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4 px-4 py-3.5 sm:py-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground">{stat.label}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 mt-2">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Tempo atual de abstinencia</span>
            </div>
            <p className="text-2xl font-bold text-primary">{formatDuration(statistics.currentAbstinence)}</p>
          </div>
        </div>
      </main>
    </MobileShell>
  )
}
