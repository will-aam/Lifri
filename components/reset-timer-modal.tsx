"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { XMarkIcon, ExclamationTriangleIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

interface ResetTimerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (note?: string, relapseDate?: Date) => void
  habitName: string
  habitStartDate: Date
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"]
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export function ResetTimerModal({ isOpen, onClose, onConfirm, habitName, habitStartDate }: ResetTimerModalProps) {
  const [note, setNote] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(note || undefined, selectedDate)
    setNote("")
    setSelectedDate(new Date())
    setShowDatePicker(false)
    onClose()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const isDateValid = (day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return date >= habitStartDate && date <= today
  }

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div
        className="fixed inset-x-0 bottom-0 sm:inset-x-4 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto max-w-md mx-auto bg-card rounded-t-3xl sm:rounded-2xl border border-border p-5 sm:p-6 shadow-xl max-h-[90dvh] overflow-y-auto safe-bottom bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag indicator for mobile */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-destructive">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <h2 className="text-base sm:text-lg font-bold">Resetar Timer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors touch-feedback"
            aria-label="Fechar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Voce esta prestes a resetar o timer de <strong className="text-foreground">{habitName}</strong>. Isso
          registrara uma recaida.
        </p>

        <div className="mb-4">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full flex items-center justify-between p-3.5 bg-muted/50 rounded-xl border border-border active:border-primary/30 transition-colors touch-feedback"
          >
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Data da recaida</p>
                <p className="text-xs text-muted-foreground">
                  {selectedDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
            <ChevronRightIcon
              className={cn("h-5 w-5 text-muted-foreground transition-transform", showDatePicker && "rotate-90")}
            />
          </button>

          {showDatePicker && (
            <div className="mt-3 p-3 sm:p-4 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                  className="p-2.5 hover:bg-muted rounded-lg transition-colors touch-feedback"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <span className="font-medium text-sm text-foreground">
                  {MONTHS[month]} {year}
                </span>
                <button
                  onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                  className="p-2.5 hover:bg-muted rounded-lg transition-colors touch-feedback"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((day, i) => (
                  <div key={i} className="text-center text-[11px] text-muted-foreground py-1 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day !== null && (
                      <button
                        disabled={!isDateValid(day)}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                        className={cn(
                          "w-full h-full rounded-full flex items-center justify-center text-sm transition-colors touch-feedback",
                          !isDateValid(day) && "text-muted-foreground/30 cursor-not-allowed",
                          isDateValid(day) && !isSelected(day) && "active:bg-muted",
                          isSelected(day) && "bg-primary text-primary-foreground",
                          isToday(day) && !isSelected(day) && "ring-1 ring-primary",
                        )}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="O que aconteceu? Como voce se sentiu? (opcional)"
            rows={3}
            className="resize-none text-sm"
          />
        </div>

        <div className="flex gap-3 pb-2">
          <Button variant="outline" onClick={onClose} className="flex-1 h-11 bg-transparent">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="flex-1 h-11">
            Confirmar Recaida
          </Button>
        </div>
      </div>
    </div>
  )
}
