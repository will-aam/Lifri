"use client"

import { useState } from "react"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import { TrophyBadge } from "@/components/trophy-badge"
import { HabitIcon } from "@/components/habit-icon"
import { useHabits } from "@/hooks/use-habits"
import { calculateProgress } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

const ACHIEVEMENT_LEVELS = [
  { type: "24h", name: "24 Horas", days: 1 },
  { type: "3d", name: "3 Dias", days: 3 },
  { type: "1w", name: "1 Semana", days: 7 },
  { type: "10d", name: "10 Dias", days: 10 },
  { type: "2w", name: "2 Semanas", days: 14 },
  { type: "1m", name: "1 Mês", days: 30 },
  { type: "3m", name: "3 Meses", days: 90 },
  { type: "6m", name: "6 Meses", days: 180 },
  { type: "1y", name: "1 Ano", days: 365 },
]

export default function TrophiesPage() {
  const { habits, mounted } = useHabits()
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null)

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

  const activeHabit = selectedHabit ? habits.find((h) => h.id === selectedHabit) : habits[0]

  return (
    <MobileShell>
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Troféus</h1>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum hábito cadastrado</p>
              <p className="text-sm text-muted-foreground mt-1">Adicione um hábito para começar a ganhar troféus</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {habits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => setSelectedHabit(habit.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors",
                      activeHabit?.id === habit.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-muted",
                    )}
                  >
                    <HabitIcon
                      icon={habit.icon}
                      className="h-4 w-4"
                      color={activeHabit?.id === habit.id ? undefined : habit.color}
                    />
                    <span className="text-sm font-medium">{habit.name}</span>
                  </button>
                ))}
              </div>

              {activeHabit && (
                <div className="space-y-3">
                  {ACHIEVEMENT_LEVELS.map((level) => {
                    const progress = calculateProgress(activeHabit.startDate, level.days)
                    const achieved = progress >= 100
                    const remaining = Math.max(
                      0,
                      level.days -
                        Math.floor((new Date().getTime() - activeHabit.startDate.getTime()) / (1000 * 60 * 60 * 24)),
                    )

                    return (
                      <TrophyBadge
                        key={level.type}
                        name={level.name}
                        days={remaining}
                        achieved={achieved}
                        progress={progress}
                        color={activeHabit.color}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </MobileShell>
  )
}
