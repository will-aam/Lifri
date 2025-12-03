"use client"

import { useState, useEffect } from "react"
import type { Habit } from "@/lib/types"
import { HabitIcon } from "@/components/habit-icon"
import { formatDuration, calculateProgress, getElapsedSeconds, formatMoney, calculateSavings } from "@/lib/utils"
import { MoreVertical } from "lucide-react"
import Link from "next/link"

interface HabitCardProps {
  habit: Habit
  goalDays?: number
  onMenu?: () => void
}

export function HabitCard({ habit, goalDays = 7, onMenu }: HabitCardProps) {
  const [elapsed, setElapsed] = useState(getElapsedSeconds(habit.startDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedSeconds(habit.startDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [habit.startDate])

  const progress = calculateProgress(habit.startDate, goalDays)
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const goalLabel =
    goalDays === 1 ? "1 DIA" : goalDays === 7 ? "1 SEMANA" : goalDays === 30 ? "1 MES" : `${goalDays} DIAS`

  return (
    <Link href={`/habit/${habit.id}`} className="block">
      <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border active:border-primary/50 transition-all card-press">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${habit.color}20` }}
          >
            <HabitIcon icon={habit.icon} color={habit.color} className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{habit.name}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Tempo de abstinencia</p>
            <p className="text-base sm:text-lg font-bold text-foreground tabular-nums">{formatDuration(elapsed)}</p>
            {habit.costPerDay && habit.costPerDay > 0 && (
              <p className="text-[10px] sm:text-xs text-success">
                Economizado: {formatMoney(calculateSavings(habit.costPerDay, elapsed))}
              </p>
            )}
          </div>

          {/* Progress circle */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="none"
                  stroke={habit.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="progress-animate"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm sm:text-base font-bold tabular-nums" style={{ color: habit.color }}>
                  {Math.round(progress)}%
                </span>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground leading-none">{goalLabel}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onMenu?.()
              }}
              className="p-2 -mr-1 hover:bg-muted rounded-lg transition-colors touch-feedback"
              aria-label="Menu"
            >
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
