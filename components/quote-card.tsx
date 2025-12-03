"use client"

import { useState, useEffect } from "react"
import { defaultQuotes } from "@/lib/data"
import { X, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuoteCardProps {
  dismissible?: boolean
  className?: string
}

export function QuoteCard({ dismissible = true, className }: QuoteCardProps) {
  const [quote, setQuote] = useState(defaultQuotes[0])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * defaultQuotes.length)
    setQuote(defaultQuotes[randomIndex])
  }, [])

  if (dismissed) return null

  return (
    <div
      className={cn(
        "relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-primary-foreground",
        className,
      )}
    >
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors touch-feedback"
          aria-label="Fechar citacao"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/20 rounded-full shrink-0">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex-1 pr-5">
          <p className="text-xs sm:text-sm font-medium mb-1">Citacao do Dia</p>
          <p className="text-xs sm:text-sm opacity-90 leading-relaxed">{quote.text}</p>
          <p className="text-[10px] sm:text-xs mt-2 opacity-75">{quote.author}</p>
        </div>
      </div>
    </div>
  )
}
