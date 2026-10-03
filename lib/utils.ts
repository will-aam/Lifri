import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = Math.floor(seconds % 60)

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(" ")
}

export function formatDurationLong(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = Math.floor(seconds % 60)

  if (days > 30) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return `${months}mês ${remainingDays}d ${hours}h ${minutes}m ${secs}s`
  }

  return `${days}d ${hours}h ${minutes}m ${secs}s`
}

export function calculateProgress(startDate: Date, goalDays: number): number {
  const now = new Date()
  const elapsed = (now.getTime() - startDate.getTime()) / 1000
  const goalSeconds = goalDays * 24 * 60 * 60
  return Math.min((elapsed / goalSeconds) * 100, 100)
}

export function getElapsedSeconds(startDate: Date): number {
  return Math.floor((new Date().getTime() - startDate.getTime()) / 1000)
}


