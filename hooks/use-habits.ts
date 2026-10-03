"use client"

import { useState, useEffect, useCallback } from "react"
import type { Habit, Goal, Achievement, Relapse, DiaryEntry } from "@/lib/types"
import { mockHabits, mockAchievements, defaultGoals, mockRelapses } from "@/lib/data"

const STORAGE_KEY = "lifri-habits"
const GOALS_KEY = "lifri-goals"
const ACHIEVEMENTS_KEY = "lifri-achievements"
const RELAPSES_KEY = "lifri-relapses"
const DIARY_KEY = "lifri-diary"

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [relapses, setRelapses] = useState<Relapse[]>([])
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage
  useEffect(() => {
    setMounted(true)
    const storedHabits = localStorage.getItem(STORAGE_KEY)
    const storedGoals = localStorage.getItem(GOALS_KEY)
    const storedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY)
    const storedRelapses = localStorage.getItem(RELAPSES_KEY)
    const storedDiary = localStorage.getItem(DIARY_KEY)

    if (storedHabits) {
      const parsed = JSON.parse(storedHabits)
      setHabits(parsed.map((h: Habit) => ({ ...h, startDate: new Date(h.startDate) })))
    } else {
      setHabits(mockHabits)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHabits))
    }

    if (storedGoals) {
      const parsed = JSON.parse(storedGoals)
      setGoals(
        parsed.map((g: Goal) => ({
          ...g,
          achievedAt: g.achievedAt ? new Date(g.achievedAt) : undefined,
        })),
      )
    }

    if (storedAchievements) {
      const parsed = JSON.parse(storedAchievements)
      setAchievements(
        parsed.map((a: Achievement) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt),
        })),
      )
    } else {
      setAchievements(mockAchievements)
    }

    if (storedRelapses) {
      const parsed = JSON.parse(storedRelapses)
      setRelapses(parsed.map((r: Relapse) => ({ ...r, date: new Date(r.date) })))
    } else {
      setRelapses(mockRelapses)
    }

    if (storedDiary) {
      const parsed = JSON.parse(storedDiary)
      setDiaryEntries(parsed.map((d: DiaryEntry) => ({ ...d, date: new Date(d.date) })))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  }, [habits, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  }, [goals, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements))
  }, [achievements, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(RELAPSES_KEY, JSON.stringify(relapses))
  }, [relapses, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(DIARY_KEY, JSON.stringify(diaryEntries))
  }, [diaryEntries, mounted])

  const addHabit = useCallback((habit: Omit<Habit, "id" | "isActive">) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      isActive: true,
    }
    setHabits((prev) => [...prev, newHabit])

    const newGoals: Goal[] = defaultGoals.map((g) => ({
      ...g,
      id: crypto.randomUUID(),
      habitId: newHabit.id,
      achieved: false,
    }))
    setGoals((prev) => [...prev, ...newGoals])

    return newHabit
  }, [])

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)))
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setGoals((prev) => prev.filter((g) => g.habitId !== id))
    setAchievements((prev) => prev.filter((a) => a.habitId !== id))
    setRelapses((prev) => prev.filter((r) => r.habitId !== id))
  }, [])

  const resetTimer = useCallback(
    (habitId: string, note?: string, relapseDate?: Date) => {
      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return

      const effectiveRelapseDate = relapseDate || new Date()
      const elapsed = Math.floor((effectiveRelapseDate.getTime() - habit.startDate.getTime()) / 1000)

      // Record relapse
      const relapse: Relapse = {
        id: crypto.randomUUID(),
        habitId,
        date: effectiveRelapseDate,
        note,
        duration: Math.max(0, elapsed),
      }
      setRelapses((prev) => [...prev, relapse])

      // Reset start date to the relapse date (recomeça a partir dali)
      setHabits((prev) => prev.map((h) => (h.id === habitId ? { ...h, startDate: effectiveRelapseDate } : h)))

      // Reset goals
      setGoals((prev) =>
        prev.map((g) => (g.habitId === habitId ? { ...g, achieved: false, achievedAt: undefined } : g)),
      )
    },
    [habits],
  )

  const addDiaryEntry = useCallback((entry: Omit<DiaryEntry, "id">) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
    }
    setDiaryEntries((prev) => [...prev, newEntry])
  }, [])

  const getHabitGoals = useCallback(
    (habitId: string) => {
      return goals.filter((g) => g.habitId === habitId)
    },
    [goals],
  )

  const getHabitAchievements = useCallback(
    (habitId: string) => {
      return achievements.filter((a) => a.habitId === habitId)
    },
    [achievements],
  )

  const getHabitRelapses = useCallback(
    (habitId: string) => {
      return relapses.filter((r) => r.habitId === habitId)
    },
    [relapses],
  )

  const getHabitDiary = useCallback(
    (habitId: string) => {
      return diaryEntries.filter((d) => d.habitId === habitId)
    },
    [diaryEntries],
  )

  return {
    habits,
    goals,
    achievements,
    relapses,
    diaryEntries,
    addHabit,
    updateHabit,
    deleteHabit,
    resetTimer,
    addDiaryEntry,
    getHabitGoals,
    getHabitAchievements,
    getHabitRelapses,
    getHabitDiary,
    mounted,
  }
}
