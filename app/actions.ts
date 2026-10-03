"use server"

import prisma from "@/lib/db"
import type { Habit, Relapse } from "@/lib/types"

// Sync all data to client
export async function getSyncData() {
  const habits = await prisma.habit.findMany({
    include: {
      goals: true,
      achievements: true,
      relapses: true,
      diaryEntries: true,
    }
  })
  
  // Transform to the flatter shape used by useHabits
  const goals = habits.flatMap((h: any) => h.goals)
  const achievements = habits.flatMap((h: any) => h.achievements)
  const relapses = habits.flatMap((h: any) => h.relapses)
  const diaryEntries = habits.flatMap((h: any) => h.diaryEntries)

  return { habits, goals, achievements, relapses, diaryEntries }
}

// Habits
export async function createHabitAction(data: Omit<Habit, "isActive">) {
  return await prisma.habit.create({
    data: {
      id: data.id,
      name: data.name,
      icon: data.icon,
      color: data.color,
      startDate: data.startDate,
      frequency: data.frequency,
      isActive: true,
    }
  })
}

export async function updateHabitAction(id: string, updates: Partial<Habit>) {
  return await prisma.habit.update({
    where: { id },
    data: updates
  })
}

export async function deleteHabitAction(id: string) {
  return await prisma.habit.delete({
    where: { id }
  })
}

// Goals
export async function createGoalsAction(goals: any[]) {
  return await prisma.goal.createMany({
    data: goals.map(g => ({
      id: g.id,
      habitId: g.habitId,
      name: g.name,
      days: g.days,
      achieved: g.achieved,
      achievedAt: g.achievedAt,
    }))
  })
}

export async function updateGoalsAction(habitId: string) {
  return await prisma.goal.updateMany({
    where: { habitId },
    data: { achieved: false, achievedAt: null }
  })
}

// Relapses
export async function createRelapseAction(relapse: Relapse) {
  return await prisma.relapse.create({
    data: {
      id: relapse.id,
      habitId: relapse.habitId,
      date: relapse.date,
      note: relapse.note,
      duration: relapse.duration,
    }
  })
}

// Diary
export async function createDiaryEntryAction(entry: any) {
  return await prisma.diaryEntry.create({
    data: {
      id: entry.id,
      habitId: entry.habitId,
      date: entry.date,
      mood: entry.mood,
      note: entry.note,
    }
  })
}
