"use client"

import { useState } from "react"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import { useHabits } from "@/hooks/use-habits"
import { HabitIcon } from "@/components/habit-icon"
import { cn } from "@/lib/utils"
import { Cog8ToothIcon, TrashIcon, ChevronRightIcon, BellIcon, ShieldCheckIcon, QuestionMarkCircleIcon, InformationCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function SettingsPage() {
  const { habits, deleteHabit, mounted } = useHabits()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

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

  const handleDeleteHabit = (id: string) => {
    deleteHabit(id)
    setShowDeleteConfirm(null)
  }

  return (
    <MobileShell>
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-2">
            <Cog8ToothIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          </div>

          {/* Notes Cog8ToothIcon */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Anotações e Citações</h2>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Link href="/settings/notes" className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Gerenciar Anotações</p>
                    <p className="text-sm text-muted-foreground">Crie anotações e escolha quais viram citações</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          </section>

          {/* Habits Management */}
          {habits.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Gerenciar Hábitos</h2>

              <div className="bg-card border border-border rounded-xl divide-y divide-border">
                {habits.map((habit) => (
                  <div key={habit.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${habit.color}20` }}
                        >
                          <HabitIcon icon={habit.icon} color={habit.color} className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{habit.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Criado em {habit.startDate.toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      {showDeleteConfirm === habit.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                            Cancelar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteHabit(habit.id)}>
                            Excluir
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(habit.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other Cog8ToothIcon */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Outros</h2>

            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Privacidade</p>
                    <p className="text-sm text-muted-foreground">Seus dados são armazenados localmente</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </button>

              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Ajuda</p>
                    <p className="text-sm text-muted-foreground">Dúvidas frequentes</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </button>

              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <InformationCircleIcon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Sobre</p>
                    <p className="text-sm text-muted-foreground">Lifri v1.0.0</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pt-4 pb-8">
            <p className="text-sm text-muted-foreground">Feito com carinho para ajudar você</p>
            <p className="text-xs text-muted-foreground mt-1">a viver uma vida mais livre</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </MobileShell>
  )
}
