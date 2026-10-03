"use client"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/mobile-shell"
import { HabitHeader } from "@/components/habit-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useHabits } from "@/hooks/use-habits"
import { PlusIcon, SparklesIcon, TrashIcon, HeartIcon } from "@heroicons/react/24/outline"

interface ReasonsPageProps {
  params: Promise<{ id: string }>
}

interface Reason {
  id: string
  text: string
}

const STORAGE_KEY = "lifri-reasons"

export default function ReasonsPage({ params }: ReasonsPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { habits, mounted } = useHabits()
  const [reasons, setReasons] = useState<Reason[]>([])
  const [newReason, setNewReason] = useState("")

  const habit = habits.find((h) => h.id === id)

  useEffect(() => {
    if (!mounted) return
    const stored = localStorage.getItem(`${STORAGE_KEY}-${id}`)
    if (stored) {
      setReasons(JSON.parse(stored))
    } else {
      setReasons([
        { id: "1", text: "Quero ter mais saúde" },
        { id: "2", text: "Economizar dinheiro" },
        { id: "3", text: "Ser um exemplo para minha família" },
      ])
    }
  }, [id, mounted])

  useEffect(() => {
    if (!mounted || reasons.length === 0) return
    localStorage.setItem(`${STORAGE_KEY}-${id}`, JSON.stringify(reasons))
  }, [reasons, id, mounted])

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

  const handleAddReason = () => {
    if (!newReason.trim()) return
    setReasons((prev) => [...prev, { id: crypto.randomUUID(), text: newReason.trim() }])
    setNewReason("")
  }

  const handleDeleteReason = (reasonId: string) => {
    setReasons((prev) => prev.filter((r) => r.id !== reasonId))
  }

  return (
    <MobileShell>
      <HabitHeader title="Razões" habitId={habit.id} />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Por que você quer parar?</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Lembre-se das suas razões nos momentos difíceis. Elas são a sua motivação!
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Adicione uma razão..."
              onKeyDown={(e) => e.key === "Enter" && handleAddReason()}
            />
            <Button onClick={handleAddReason} size="icon">
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>

          {reasons.length === 0 ? (
            <div className="text-center py-8">
              <HeartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma razão cadastrada ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reasons.map((reason, index) => (
                <div key={reason.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-foreground">{reason.text}</p>
                  <button
                    onClick={() => handleDeleteReason(reason.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </MobileShell>
  )
}
