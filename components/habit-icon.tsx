"use client"

import {
  Cigarette,
  Wine,
  Coffee,
  Candy,
  Smartphone,
  Dices,
  ShoppingCart,
  Gamepad2,
  Clock,
  Pizza,
  Ban,
  Pill,
  CircleSlash,
  type LucideIcon,
} from "lucide-react"

const iconMap: { [key: string]: LucideIcon } = {
  cigarette: Cigarette,
  alcohol: Wine,
  coffee: Coffee,
  sugar: Candy,
  social: Smartphone,
  gambling: Dices,
  shopping: ShoppingCart,
  gaming: Gamepad2,
  procrastination: Clock,
  junkfood: Pizza,
  porn: Ban,
  drugs: Pill,
  other: CircleSlash,
}

interface HabitIconProps {
  icon: string
  className?: string
  color?: string
}

export function HabitIcon({ icon, className = "h-5 w-5", color }: HabitIconProps) {
  const IconComponent = iconMap[icon] || CircleSlash
  return <IconComponent className={className} style={color ? { color } : undefined} />
}

export function getIconComponent(icon: string): LucideIcon {
  return iconMap[icon] || CircleSlash
}

export const availableIcons = Object.keys(iconMap)
