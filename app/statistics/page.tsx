"use client"

import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import { HabitIcon } from "@/components/habit-icon"
import { useHabits } from "@/hooks/use-habits"
import { formatDuration, getElapsedSeconds, formatMoney, calculateSavings } from "@/lib/utils"
import { BarChart3, TrendingUp, Clock, Wallet, Target, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function StatisticsPage() {
  const { habits, relapses, mounted } = useHabits()

  if (!mounted) {
    return (
      <MobileShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </MobileShell>
    )
  }

  // Calculate global statistics
  const totalHabits = habits.length
  const totalRelapses = relapses.length
  const totalSavings = habits.reduce((acc, habit) => {
    if (!habit.costPerDay) return acc
    const elapsed = getElapsedSeconds(habit.startDate)
    return acc + calculateSavings(habit.costPerDay, elapsed)
  }, 0)

  const longestStreak = habits.reduce((max, habit) => {
    const elapsed = getElapsedSeconds(habit.startDate)
    return elapsed > max ? elapsed : max
  }, 0)

  const stats = [
    {
      icon: Target,
      label: "Hábitos em rastreamento",
      value: totalHabits.toString(),
      color: "text-primary",
    },
    {
      icon: Clock,
      label: "Maior sequência atual",
      value: longestStreak > 0 ? formatDuration(longestStreak) : "N/A",
      color: "text-success",
    },
    {
      icon: Wallet,
      label: "Total economizado",
      value: formatMoney(totalSavings),
      color: "text-chart-4",
    },
    {
      icon: RotateCcw,
      label: "Total de recaídas",
      value: totalRelapses.toString(),
      color: "text-destructive",
    },
  ]

  return (
    <MobileShell>
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Estatísticas</h1>
          </div>

          {/* Global Stats */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-4">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Per Habit Stats */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Por Hábito</h2>

            {habits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum hábito cadastrado</p>
              </div>
            ) : (
              habits.map((habit) => {
                const elapsed = getElapsedSeconds(habit.startDate)
                const habitRelapses = relapses.filter((r) => r.habitId === habit.id)
                const savings = habit.costPerDay ? calculateSavings(habit.costPerDay, elapsed) : 0

                return (
                  <Link key={habit.id} href={`/habit/${habit.id}/stats`}>
                    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${habit.color}20` }}
                        >
                          <HabitIcon icon={habit.icon} color={habit.color} className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{habit.name}</h3>
                          <p className="text-sm text-muted-foreground">{formatDuration(elapsed)} de abstinência</p>
                        </div>
                        <TrendingUp className="h-5 w-5" style={{ color: habit.color }} />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="text-sm font-medium text-foreground">{habitRelapses.length}</p>
                          <p className="text-xs text-muted-foreground">Recaídas</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="text-sm font-medium text-foreground">
                            {habit.costPerDay ? formatMoney(savings) : "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">Economizado</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="text-sm font-medium text-foreground">{Math.floor(elapsed / (24 * 60 * 60))}</p>
                          <p className="text-xs text-muted-foreground">Dias</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </MobileShell>
  )
}
