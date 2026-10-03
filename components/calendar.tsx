"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon, InformationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  startDate: Date
  relapses?: Date[]
  color?: string
  onMarkRelapse?: (date: Date) => void
  editable?: boolean
}

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"]
const MONTHS = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
]

export function Calendar({
  startDate,
  relapses = [],
  color = "#6366F1",
  onMarkRelapse,
  editable = true,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const isRelapse = (day: number) => {
    return relapses.some((r) => {
      const relapseDate = new Date(r)
      return relapseDate.getDate() === day && relapseDate.getMonth() === month && relapseDate.getFullYear() === year
    })
  }

  const isSuccess = (day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    return date >= start && date <= today && !isRelapse(day)
  }

  const isFutureDate = (day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return date > today
  }

  const isBeforeStart = (day: number) => {
    const date = new Date(year, month, day)
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    return date < start
  }

  const handleDayClick = (day: number) => {
    if (!editable || !onMarkRelapse) return
    if (isFutureDate(day)) return
    if (isBeforeStart(day)) return
    if (isRelapse(day)) return // Ja e uma recaida

    const clickedDate = new Date(year, month, day, 12, 0, 0)
    setSelectedDate(clickedDate)
    setShowConfirmModal(true)
  }

  const handleConfirmRelapse = () => {
    if (selectedDate && onMarkRelapse) {
      onMarkRelapse(selectedDate)
    }
    setShowConfirmModal(false)
    setSelectedDate(null)
  }

  const days: (number | null)[] = []
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">


        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="p-2.5 hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-feedback"
            >
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <span className="font-medium text-foreground capitalize text-sm sm:text-base">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2.5 hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-feedback"
            >
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1.5">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-[10px] sm:text-xs text-muted-foreground py-1.5">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="aspect-square p-0.5" />
              }

              const future = isFutureDate(day)
              const beforeStart = isBeforeStart(day)
              const relapse = isRelapse(day)
              const success = isSuccess(day)
              const clickable = editable && onMarkRelapse && !future && !beforeStart && !relapse

              return (
                <div key={index} className="aspect-square p-0.5">
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => clickable && handleDayClick(day)}
                    className={cn(
                      "w-full h-full rounded-full flex items-center justify-center text-xs sm:text-sm transition-all",
                      isToday(day) && "ring-2 ring-primary ring-offset-1 ring-offset-card",
                      relapse && "bg-destructive/20 text-destructive",
                      success && !relapse && "text-foreground",
                      future && "opacity-30",
                      beforeStart && "opacity-30",
                      clickable && "hover:bg-muted active:scale-95 cursor-pointer touch-feedback",
                      !clickable && "cursor-default",
                    )}
                    style={success && !relapse ? { backgroundColor: `${color}25`, color } : undefined}
                  >
                    {day}
                  </button>
                </div>
              )
            })}
          </div>


        </div>
      </div>

      {showConfirmModal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          <div className="relative w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-2xl p-6 pb-8 sm:pb-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full touch-feedback"
            >
              <XMarkIcon className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-destructive" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">Marcar Recaida</h3>

              <p className="text-sm text-muted-foreground mb-1">Voce teve uma recaida no dia:</p>
              <p className="text-base font-medium text-foreground mb-4">
                {selectedDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p className="text-xs text-muted-foreground mb-6">
                Isso ira reiniciar seu cronometro a partir desta data. Nao desanime, cada dia e uma nova oportunidade!
              </p>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </Button>
                <Button variant="destructive" className="flex-1 h-12" onClick={handleConfirmRelapse}>
                  Confirmar Recaida
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
