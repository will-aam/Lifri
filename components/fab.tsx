"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FABProps {
  onClick: () => void
  className?: string
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25 flex items-center justify-center active:scale-95 transition-transform z-40 touch-feedback",
        className,
      )}
      aria-label="Adicionar habito"
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </button>
  )
}
