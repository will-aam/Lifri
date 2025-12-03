"use client"

import { cn } from "@/lib/utils"
import { Check, Lock, Shield, Award, Trophy, Star, Crown } from "lucide-react"

interface TrophyBadgeProps {
  name: string
  days: number
  achieved: boolean
  progress: number
  color?: string
}

const getBadgeIcon = (name: string) => {
  if (name.includes("Hora")) return Shield
  if (name.includes("Dia")) return Award
  if (name.includes("Semana")) return Trophy
  if (name.includes("Mês") || name.includes("Meses")) return Star
  if (name.includes("Ano")) return Crown
  return Trophy
}

export function TrophyBadge({ name, days, achieved, progress, color = "#10B981" }: TrophyBadgeProps) {
  const BadgeIcon = getBadgeIcon(name)

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-4">
        {/* Badge Icon */}
        <div className="relative">
          <div
            className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center relative overflow-hidden",
              achieved
                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                : "bg-gradient-to-br from-gray-400 to-gray-500",
            )}
          >
            {achieved ? <BadgeIcon className="h-8 w-8 text-white" /> : <Lock className="h-6 w-6 text-white/70" />}
          </div>

          {/* Name Banner */}
          <div
            className={cn(
              "absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap",
              achieved ? "bg-amber-500" : "bg-gray-500",
            )}
          >
            {name}
          </div>

          {achieved && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center ring-2 ring-card">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className={cn("text-sm font-medium", achieved ? "text-success" : "text-muted-foreground")}>
              {achieved ? "Alcançado!" : `Em ${days} dia${days !== 1 ? "s" : ""}`}
            </p>
            <span className={cn("text-sm font-bold", achieved ? "text-success" : "text-foreground")}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                achieved ? "bg-success" : progress > 50 ? "bg-amber-500" : "bg-primary",
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
