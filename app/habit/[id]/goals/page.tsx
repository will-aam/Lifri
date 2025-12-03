"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/mobile-shell"
import { HabitHeader } from "@/components/habit-header"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/use-habits"
import { calculateProgress } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Check, Shield, Award, Trophy, Star, Crown, Medal, Gem, Flame } from "lucide-react"
import { defaultGoals } from "@/lib/data"

interface GoalsPageProps {
  params: Promise<{ id: string }>
}

const goalIcons = [Shield, Award, Trophy, Star, Crown, Medal, Gem, Flame, Crown]
const goalColors = {
  achieved: ["#10B981", "#059669"], // green
  pending: ["#9CA3AF", "#6B7280"], // gray
}

export default function GoalsPage({ params }: GoalsPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { habits, getHabitGoals, mounted } = useHabits()

  const habit = habits.find((h) => h.id === id)
  const goals = habit ? getHabitGoals(habit.id) : []

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
          <p className="text-muted-foreground mb-4">Hábito não encontrado</p>
          <Button onClick={() => router.push("/")}>Voltar ao início</Button>
        </div>
      </MobileShell>
    )
  }

  const displayGoals =
    goals.length > 0
      ? goals
      : defaultGoals.map((g, i) => ({
          ...g,
          id: `default-${i}`,
          habitId: habit.id,
          achieved: calculateProgress(habit.startDate, g.days) >= 100,
        }))

  return (
    <MobileShell>
      <HabitHeader title={habit.name} habitId={habit.id} />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-3">
          {displayGoals.map((goal, index) => {
            const progress = calculateProgress(habit.startDate, goal.days)
            const isAchieved = progress >= 100
            const remaining = Math.max(
              0,
              goal.days - Math.floor((new Date().getTime() - habit.startDate.getTime()) / (1000 * 60 * 60 * 24)),
            )
            const IconComponent = goalIcons[index % goalIcons.length]

            return (
              <div key={goal.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-4">
                  {/* Trophy Badge */}
                  <div className="relative">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center",
                        isAchieved
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                          : "bg-gradient-to-br from-gray-400 to-gray-500",
                      )}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    {isAchieved && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap",
                        isAchieved ? "bg-amber-500" : "bg-gray-500",
                      )}
                    >
                      {goal.name}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn("text-sm font-medium", isAchieved ? "text-success" : "text-muted-foreground")}
                      >
                        {isAchieved ? "Alcançado!" : `Em ${remaining} dia${remaining !== 1 ? "s" : ""}`}
                      </span>
                      <span className={cn("text-sm font-bold", isAchieved ? "text-success" : "text-foreground")}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isAchieved ? "bg-success" : progress > 50 ? "bg-amber-500" : "bg-primary",
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </MobileShell>
  )
}
