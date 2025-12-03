"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/mobile-shell"
import { HabitHeader } from "@/components/habit-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useHabits } from "@/hooks/use-habits"
import { cn } from "@/lib/utils"
import { Plus, Frown, Meh, Smile, Heart, Sparkles } from "lucide-react"

interface DiaryPageProps {
  params: Promise<{ id: string }>
}

const MOODS = [
  { value: 1, icon: Frown, label: "Muito mal", color: "text-destructive" },
  { value: 2, icon: Frown, label: "Mal", color: "text-orange-500" },
  { value: 3, icon: Meh, label: "Normal", color: "text-muted-foreground" },
  { value: 4, icon: Smile, label: "Bem", color: "text-success" },
  { value: 5, icon: Heart, label: "Muito bem", color: "text-primary" },
]

export default function DiaryPage({ params }: DiaryPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { habits, diaryEntries, addDiaryEntry, mounted } = useHabits()
  const [isAdding, setIsAdding] = useState(false)
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState("")

  const habit = habits.find((h) => h.id === id)
  const entries = diaryEntries.filter((d) => d.habitId === id)

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

  const handleAddEntry = () => {
    if (!note.trim()) return
    addDiaryEntry({
      habitId: id,
      date: new Date(),
      mood,
      note: note.trim(),
    })
    setNote("")
    setMood(3)
    setIsAdding(false)
  }

  return (
    <MobileShell>
      <HabitHeader title={habit.name} habitId={habit.id} />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="bg-card border-b border-border">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Diário</h2>
            <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              Nova entrada
            </Button>
          </div>
        </div>

        {isAdding && (
          <div className="p-4 bg-card border-b border-border space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Como você está se sentindo?</p>
              <div className="flex justify-between gap-2">
                {MOODS.map((m) => {
                  const IconComponent = m.icon
                  return (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all flex-1",
                        mood === m.value ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-muted/80",
                      )}
                    >
                      <IconComponent className={cn("h-6 w-6", mood === m.value ? "text-primary" : m.color)} />
                      <span className="text-[10px] text-muted-foreground">{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Escreva seus pensamentos..."
              rows={4}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button onClick={handleAddEntry} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        )}

        {entries.length === 0 && !isAdding ? (
          <div className="text-center py-12 px-4">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma entrada no diário</p>
            <p className="text-sm text-muted-foreground mt-1">Registre seus pensamentos e sentimentos</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => {
                const moodData = MOODS.find((m) => m.value === entry.mood) || MOODS[2]
                const MoodIcon = moodData.icon
                return (
                  <div key={entry.id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center bg-muted")}>
                        <MoodIcon className={cn("h-4 w-4", moodData.color)} />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-foreground">{entry.note}</p>
                  </div>
                )
              })}
          </div>
        )}
      </main>
    </MobileShell>
  )
}
