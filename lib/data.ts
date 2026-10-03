import type { Goal } from "./types"

export const defaultGoals: Omit<Goal, "id" | "habitId" | "achieved" | "achievedAt">[] = [
  { name: "24 Horas", days: 1 },
  { name: "3 Dias", days: 3 },
  { name: "1 Semana", days: 7 },
  { name: "10 Dias", days: 10 },
  { name: "2 Semanas", days: 14 },
  { name: "1 Mês", days: 30 },
  { name: "3 Meses", days: 90 },
  { name: "6 Meses", days: 180 },
  { name: "1 Ano", days: 365 },
]

export const habitIconNames: { [key: string]: string } = {
  cigarette: "Cigarette",
  alcohol: "Wine",
  coffee: "Coffee",
  sugar: "Candy",
  social: "Smartphone",
  gambling: "Dices",
  shopping: "ShoppingCart",
  gaming: "Gamepad2",
  procrastination: "Clock",
  junkfood: "Pizza",
  porn: "Ban",
  drugs: "Pill",
  other: "CircleSlash",
}

export const habitColors = [
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#0EA5E9", // Sky
  "#84CC16", // Lime
  "#F59E0B", // Amber
  "#64748B", // Slate
]
