"use client"

import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import { QuoteCard } from "@/components/quote-card"
import { HabitCard } from "@/components/habit-card"
import { useHabits } from "@/hooks/use-habits"

export default function HomePage() {
  const { habits, mounted } = useHabits()

  if (!mounted) {
    return (
      <MobileShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 pb-28 space-y-4">
          <QuoteCard />

          {habits.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-2 text-sm sm:text-base">Nenhum habito cadastrado</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Toque no botao + para adicionar seu primeiro habito
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Comprometo-me a abandonar:
              </h2>
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </MobileShell>
  )
}
