"use client"

import { useState, useEffect } from "react"
import type { Habit } from "@/lib/types"
import { HabitIcon } from "@/components/habit-icon"
import { formatDuration, calculateProgress, getElapsedSeconds } from "@/lib/utils"
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ClockIcon,
  FireIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { useHabits } from "@/hooks/use-habits"
import { ResetTimerModal } from "@/components/reset-timer-modal"
import { EditHabitModal } from "@/components/edit-habit-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HabitCardProps {
  habit: Habit
  goalDays?: number
  onMenu?: () => void
}

export function HabitCard({ habit, goalDays = 7, onMenu }: HabitCardProps) {
  const { resetTimer, updateHabit } = useHabits()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [elapsed, setElapsed] = useState(getElapsedSeconds(habit.startDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedSeconds(habit.startDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [habit.startDate])

  const progress = calculateProgress(habit.startDate, goalDays)
  const daysPassed = Math.floor(elapsed / 86400)
  const hoursPassed = Math.floor((elapsed % 86400) / 3600)

  return (
    <>
      <Link href={`/habit/${habit.id}`} className="block">
        <div
          className="relative bg-card rounded-2xl border border-border active:scale-[0.98] transition-all duration-150 overflow-hidden"
          style={{ borderColor: `${habit.color}25` }}
        >

          {/* Background watermark — smaller, corners */}
          <div className="absolute -right-6 -bottom-6 opacity-[0.06] pointer-events-none">
            <HabitIcon icon={habit.icon} className="w-24 h-24" />
          </div>
          <div className="absolute -left-4 -top-4 opacity-[0.04] pointer-events-none rotate-12">
            <HabitIcon icon={habit.icon} className="w-16 h-16" />
          </div>

          <div className="relative z-10 p-4">
            {/* Top row: name + menu */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-semibold text-foreground text-sm truncate">{habit.name}</h3>
              </div>

              <div onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-1 -mr-1 -mt-1 rounded-full shrink-0 relative outline-none active:bg-muted/60 transition-colors"
                  aria-label="Editar"
                >
                  <PencilIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Timer + icon stats row */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 font-medium">Abstinência</p>
                <p
                  className="text-2xl font-bold tabular-nums tracking-tight"
                  style={{ color: habit.color }}
                >
                  {formatDuration(elapsed)}
                </p>
              </div>

              {/* Mini stats chips */}
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CalendarDaysIcon className="h-3 w-3" />
                  <span className="font-medium tabular-nums">{daysPassed}d</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ClockIcon className="h-3 w-3" />
                  <span className="font-medium tabular-nums">{hoursPassed}h hoje</span>
                </div>
                <div className="flex items-center gap-1 text-[10px]" style={{ color: habit.color }}>
                  <FireIcon className="h-3 w-3" />
                  <span className="font-medium tabular-nums">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Progress bar + reset button */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: habit.color,
                  }}
                />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsResetOpen(true)
                }}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full outline-none active:opacity-70 transition-opacity shrink-0"
                style={{
                  backgroundColor: habit.color,
                  color: '#fff',
                }}
              >
                <ArrowPathIcon className="h-3 w-3" />
                Resetar
              </button>
            </div>
          </div>
        </div>
      </Link>

      <ResetTimerModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={(note, date) => resetTimer(habit.id, note, date)}
        habitName={habit.name}
        habitStartDate={habit.startDate}
      />
      <EditHabitModal 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onEdit={updateHabit}
        habit={habit}
      />
    </>
  )
}
