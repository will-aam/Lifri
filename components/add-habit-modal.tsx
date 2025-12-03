"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { habitColors } from "@/lib/data"
import { HabitIcon, availableIcons } from "@/components/habit-icon"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import type { Habit } from "@/lib/types"

interface AddHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (habit: Omit<Habit, "id" | "isActive">) => void
}

const iconLabels: { [key: string]: string } = {
  cigarette: "Cigarro",
  alcohol: "Alcool",
  coffee: "Cafe",
  sugar: "Acucar",
  social: "Redes Sociais",
  gambling: "Apostas",
  shopping: "Compras",
  gaming: "Games",
  procrastination: "Procrastinar",
  junkfood: "Fast Food",
  porn: "Pornografia",
  drugs: "Drogas",
  other: "Outro",
}

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState("")
  const [icon, setIcon] = useState("cigarette")
  const [color, setColor] = useState(habitColors[0])
  const [costPerDay, setCostPerDay] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAdd({
      name: name.trim(),
      icon,
      color,
      startDate: new Date(),
      costPerDay: costPerDay ? Number.parseFloat(costPerDay) : undefined,
      frequency: 1,
    })

    setName("")
    setIcon("cigarette")
    setColor(habitColors[0])
    setCostPerDay("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div
        className="fixed inset-x-0 bottom-0 sm:inset-x-4 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto max-w-md mx-auto bg-card rounded-t-3xl sm:rounded-2xl border border-border p-5 sm:p-6 shadow-xl max-h-[85dvh] overflow-y-auto safe-bottom bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag indicator for mobile */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Novo Habito</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors touch-feedback"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm">
              Nome do habito
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alcool, Cigarro..."
              className="mt-1.5 h-11"
            />
          </div>

          <div>
            <Label className="text-sm">Icone</Label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-1.5">
              {availableIcons.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  className={cn(
                    "p-2.5 sm:p-3 rounded-xl flex flex-col items-center gap-1 transition-all touch-feedback",
                    icon === key
                      ? "bg-primary text-primary-foreground scale-105 ring-2 ring-primary ring-offset-2 ring-offset-card"
                      : "bg-muted active:bg-muted/80",
                  )}
                >
                  <HabitIcon icon={key} className="h-5 w-5" />
                  <span className="text-[9px] sm:text-[10px] truncate w-full text-center leading-tight">
                    {iconLabels[key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm">Cor</Label>
            <div className="flex gap-2.5 mt-1.5 flex-wrap">
              {habitColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-9 h-9 sm:w-8 sm:h-8 rounded-full transition-all touch-feedback",
                    color === c && "ring-2 ring-offset-2 ring-offset-card ring-foreground scale-110",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="cost" className="text-sm">
              Custo diario (opcional)
            </Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              inputMode="decimal"
              value={costPerDay}
              onChange={(e) => setCostPerDay(e.target.value)}
              placeholder="R$ 0,00"
              className="mt-1.5 h-11"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Para calcular quanto voce esta economizando</p>
          </div>

          <div className="flex gap-3 pt-3 pb-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-11">
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
