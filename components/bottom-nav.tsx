"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Trophy, BarChart3, Settings, Lightbulb } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/motivation", icon: Lightbulb, label: "Motivacao" },
  { href: "/statistics", icon: BarChart3, label: "Stats" },
  { href: "/trophies", icon: Trophy, label: "Trofeus" },
  { href: "/settings", icon: Settings, label: "Ajustes" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 pt-2 pb-2 safe-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-3 rounded-xl transition-all touch-feedback",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground active:text-foreground active:bg-muted/50",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
