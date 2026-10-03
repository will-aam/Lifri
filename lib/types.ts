export interface Habit {
  id: string
  name: string
  icon: string
  color: string
  startDate: Date

  frequency: number
  isActive: boolean
}

export interface Goal {
  id: string
  habitId: string
  name: string
  days: number
  achieved: boolean
  achievedAt?: Date
}

export interface Achievement {
  id: string
  habitId: string
  type: string
  name: string
  unlockedAt: Date
}

export interface Relapse {
  id: string
  habitId: string
  date: Date
  note?: string
  duration: number
}

export interface DiaryEntry {
  id: string
  habitId?: string
  date: Date
  mood: number
  note: string
}

export interface Note {
  id: string
  text: string
  author?: string
  isQuote: boolean
  createdAt: Date
}

export interface Statistics {
  startDate: Date
  maxAbstinence: number
  minAbstinence: number
  avgAbstinence: number
  previousAbstinence: number
  totalResets: number
}
