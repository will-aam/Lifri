"use client"

import { useState, useEffect } from "react"
import { getElapsedSeconds, calculateProgress } from "@/lib/utils"

interface CircularProgressProps {
  startDate: Date
  goalDays: number
  color: string
  size?: number
  showLabel?: boolean
}

export function CircularProgress({ startDate, goalDays, color, size = 150, showLabel = false }: CircularProgressProps) {
  const [elapsed, setElapsed] = useState(getElapsedSeconds(startDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedSeconds(startDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [startDate])

  const progress = calculateProgress(startDate, goalDays)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const goalLabel =
    goalDays === 1 ? "1 DIA" : goalDays === 7 ? "1 SEMANA" : goalDays === 30 ? "1 MES" : `${goalDays} DIAS`

  // Responsive size calculation
  const responsiveSize = typeof window !== "undefined" && window.innerWidth < 360 ? Math.min(size, 140) : size

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[min(150px,40vw)] h-[min(150px,40vw)] sm:w-[180px] sm:h-[180px]">
        <svg className="-rotate-90 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="progress-animate"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-bold tabular-nums" style={{ color }}>
            {Math.round(progress)}%
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{goalLabel}</span>
        </div>
      </div>
    </div>
  )
}
