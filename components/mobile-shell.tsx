"use client"

import type { ReactNode } from "react"

interface MobileShellProps {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto bg-background flex flex-col overflow-hidden safe-top safe-left safe-right">
      {children}
    </div>
  )
}
