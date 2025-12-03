import type { Quote, Habit, Goal, Achievement } from "./types"

export const defaultQuotes: Quote[] = [
  {
    id: "1",
    text: "A jornada de mil milhas começa com um único passo.",
    author: "Lao Tzu",
  },
  {
    id: "2",
    text: "Podemos encontrar muitas derrotas mas não devemos ser derrotados.",
    author: "Maya Angelou",
  },
  {
    id: "3",
    text: "O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.",
    author: "Winston Churchill",
  },
  {
    id: "4",
    text: "Você não pode voltar e mudar o começo, mas pode começar onde está e mudar o final.",
    author: "C.S. Lewis",
  },
  {
    id: "5",
    text: "Cada dia é uma nova chance de mudar sua vida.",
    author: "Anônimo",
  },
  {
    id: "6",
    text: "A força não vem da capacidade física. Vem de uma vontade indomável.",
    author: "Mahatma Gandhi",
  },
  {
    id: "7",
    text: "O único modo de fazer um excelente trabalho é amar o que você faz.",
    author: "Steve Jobs",
  },
  {
    id: "8",
    text: "Acredite que você pode e você já está no meio do caminho.",
    author: "Theodore Roosevelt",
  },
]

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

// Dados mock para demonstração
export const mockHabits: Habit[] = [
  {
    id: "1",
    name: "Álcool",
    icon: "alcohol",
    color: "#3B82F6",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
    costPerDay: 25,
    frequency: 1,
    isActive: true,
  },
  {
    id: "2",
    name: "Redes Sociais",
    icon: "social",
    color: "#6366F1",
    startDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    costPerDay: 0,
    frequency: 10,
    isActive: true,
  },
  {
    id: "3",
    name: "Procrastinação",
    icon: "procrastination",
    color: "#10B981",
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000),
    costPerDay: 0,
    frequency: 1,
    isActive: true,
  },
]

export const mockAchievements: Achievement[] = [
  {
    id: "1",
    habitId: "1",
    type: "24h",
    name: "24 Horas",
    unlockedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    habitId: "1",
    type: "3d",
    name: "3 Dias",
    unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]
