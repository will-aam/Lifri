"use client"

import { useState, useEffect, useCallback } from "react"
import type { Habit, Goal, Achievement, Relapse, DiaryEntry } from "@/lib/types"
import { defaultGoals } from "@/lib/data"
import {
  getSyncData,
  createHabitAction,
  updateHabitAction,
  deleteHabitAction,
  createGoalsAction,
  updateGoalsAction,
  createRelapseAction,
  createDiaryEntryAction
} from "@/app/actions"

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [relapses, setRelapses] = useState<Relapse[]>([])
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from database on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await getSyncData()
        setHabits(data.habits as Habit[])
        setGoals(data.goals as Goal[])
        setAchievements(data.achievements as Achievement[])
        setRelapses(data.relapses as Relapse[])
        setDiaryEntries(data.diaryEntries as DiaryEntry[])
      } catch (err) {
        console.error("Failed to sync from database:", err)
      } finally {
        setMounted(true)
      }
    }
    load()
  }, [])

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

    // API calls (fire and forget)
    createHabitAction(newHabit)
    createGoalsAction(newGoals)

    return newHabit
  }, [])

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)))
    
    // API call
    updateHabitAction(id, updates)
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setGoals((prev) => prev.filter((g) => g.habitId !== id))
    setAchievements((prev) => prev.filter((a) => a.habitId !== id))
    setRelapses((prev) => prev.filter((r) => r.habitId !== id))

    // API call
    deleteHabitAction(id)
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

      // Reset start date to the relapse date
      setHabits((prev) => prev.map((h) => (h.id === habitId ? { ...h, startDate: effectiveRelapseDate } : h)))

      // Reset goals
      setGoals((prev) =>
        prev.map((g) => (g.habitId === habitId ? { ...g, achieved: false, achievedAt: undefined } : g)),
      )

      // API calls
      createRelapseAction(relapse)
      updateHabitAction(habitId, { startDate: effectiveRelapseDate })
      updateGoalsAction(habitId)
    },
    [habits],
  )

  const addDiaryEntry = useCallback((entry: Omit<DiaryEntry, "id">) => {
    const newEntry: DiaryEntry = {
      ...entry,
      id: crypto.randomUUID(),
    }
    setDiaryEntries((prev) => [...prev, newEntry])

    // API call
    createDiaryEntryAction(newEntry)
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
