"use client"

import {
  FireIcon,
  BeakerIcon,
  BoltIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  PuzzlePieceIcon,
  ClockIcon,
  ShoppingBagIcon,
  NoSymbolIcon,
  MinusCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"
import type { ComponentType, SVGProps } from "react"

// In Heroicons v2, the icon components have this type
type HeroIcon = ComponentType<React.SVGProps<SVGSVGElement>>

const iconMap: { [key: string]: HeroIcon } = {
  cigarette: FireIcon,
  alcohol: BeakerIcon,
  coffee: BoltIcon,
  sugar: SparklesIcon,
  social: DevicePhoneMobileIcon,
  gambling: CurrencyDollarIcon,
  shopping: ShoppingCartIcon,
  gaming: PuzzlePieceIcon,
  procrastination: ClockIcon,
  junkfood: ShoppingBagIcon,
  porn: NoSymbolIcon,
  drugs: MinusCircleIcon,
  other: QuestionMarkCircleIcon,
}

interface HabitIconProps {
  icon: string
  className?: string
  color?: string
}

export function HabitIcon({ icon, className = "h-5 w-5", color }: HabitIconProps) {
  const IconComponent = iconMap[icon] || QuestionMarkCircleIcon
  return <IconComponent className={className} style={color ? { color } : undefined} />
}

export function getIconComponent(icon: string): HeroIcon {
  return iconMap[icon] || QuestionMarkCircleIcon
}

export const availableIcons = Object.keys(iconMap)
