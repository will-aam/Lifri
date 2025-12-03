"use client"

import { useState } from "react"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import { QuoteCard } from "@/components/quote-card"
import { useHabits } from "@/hooks/use-habits"
import { defaultQuotes } from "@/lib/data"
import { formatMoney, calculateSavings, getElapsedSeconds } from "@/lib/utils"
import { Lightbulb, Wallet, RefreshCw, Heart, BookOpen } from "lucide-react"

const MOTIVATIONAL_TIPS = [
  {
    title: "Um dia de cada vez",
    description: "Foque apenas em hoje. Não se preocupe com amanhã ou com uma vida inteira sem o hábito.",
  },
  {
    title: "Identifique gatilhos",
    description: "Reconheça situações, emoções ou pessoas que desencadeiam o desejo pelo hábito.",
  },
  {
    title: "Substitua o hábito",
    description: "Encontre atividades saudáveis para substituir o hábito que você quer abandonar.",
  },
  {
    title: "Celebre pequenas vitórias",
    description: "Cada hora, cada dia sem ceder é uma vitória. Reconheça e celebre seu progresso.",
  },
  {
    title: "Busque apoio",
    description: "Compartilhe sua jornada com pessoas de confiança. Você não precisa fazer isso sozinho.",
  },
]

export default function MotivationPage() {
  const { habits, mounted } = useHabits()
  const [currentTip, setCurrentTip] = useState(0)

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

  // Calculate total savings
  const totalSavings = habits.reduce((acc, habit) => {
    if (!habit.costPerDay) return acc
    const elapsed = getElapsedSeconds(habit.startDate)
    return acc + calculateSavings(habit.costPerDay, elapsed)
  }, 0)

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % MOTIVATIONAL_TIPS.length)
  }

  return (
    <MobileShell>
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Motivação</h1>
          </div>

          {/* Quote of the Day */}
          <QuoteCard dismissible={false} />

          {/* Savings Card */}
          {totalSavings > 0 && (
            <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-success">Você já economizou</p>
                  <p className="text-2xl font-bold text-success">{formatMoney(totalSavings)}</p>
                </div>
              </div>
              <p className="text-sm text-success/80 mt-3">
                Invista esse dinheiro em você mesmo! Compre algo que te faça feliz.
              </p>
            </div>
          )}

          {/* Daily Tip */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Dica do Dia</h2>
              </div>
              <button
                onClick={nextTip}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Próxima dica"
              >
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <h3 className="font-medium text-foreground mb-1">{MOTIVATIONAL_TIPS[currentTip].title}</h3>
            <p className="text-sm text-muted-foreground">{MOTIVATIONAL_TIPS[currentTip].description}</p>
          </div>

          {/* Affirmations */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Afirmações</h2>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm text-muted-foreground">Eu sou mais forte do que qualquer vontade.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm text-muted-foreground">Cada dia sem esse hábito é um dia de vitória.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm text-muted-foreground">Eu mereço uma vida saudável e livre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm text-muted-foreground">Meu futuro depende das escolhas que faço hoje.</span>
              </li>
            </ul>
          </div>

          {/* Other Quotes */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Mais Citações Inspiradoras
            </h2>
            <div className="space-y-3">
              {defaultQuotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-sm text-foreground italic">{`"${quote.text}"`}</p>
                  <p className="text-xs text-muted-foreground mt-2">— {quote.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </MobileShell>
  )
}
