"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps, useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const { theme, setTheme } = useNextTheme()
  return {
    theme: (theme || "dark") as "dark" | "light",
    setTheme: (newTheme: "dark" | "light") => setTheme(newTheme),
  }
}
