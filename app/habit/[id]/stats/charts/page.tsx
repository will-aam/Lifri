"use client"

import { useMemo, useState, use } from "react"
import { useRouter } from "next/navigation"
import { MobileShell } from "@/components/mobile-shell"
import { HabitHeader } from "@/components/habit-header"
import { Button } from "@/components/ui/button"
import { useHabits } from "@/hooks/use-habits"
import { formatDuration } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ChartData {
  id: string
  index: number
  duration: number
  startDate: Date
  endDate: Date
  isActive: boolean
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ChartsPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { habits, getHabitRelapses, mounted } = useHabits()
  const [selectedBar, setSelectedBar] = useState<ChartData | null>(null)

  const habit = habits.find((h) => h.id === id)
  const relapses = habit ? getHabitRelapses(habit.id) : []

  const chartData = useMemo(() => {
    if (!habit) return []

    // Sort relapses by date (oldest first) to build timeline
    const sortedRelapses = [...relapses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    const data: ChartData[] = []
    
    sortedRelapses.forEach((relapse, index) => {
      const endDate = new Date(relapse.date)
      const startDate = new Date(endDate.getTime() - relapse.duration * 1000)
      
      data.push({
        id: relapse.id,
        index: index + 1,
        duration: relapse.duration, // em segundos
        startDate,
        endDate,
        isActive: false
      })
    })

    // Add current streak
    const now = new Date()
    const currentDuration = Math.floor((now.getTime() - habit.startDate.getTime()) / 1000)
    data.push({
      id: "current",
      index: sortedRelapses.length + 1,
      duration: currentDuration,
      startDate: habit.startDate,
      endDate: now,
      isActive: true
    })

    return data
  }, [habit, relapses])

  if (!mounted) {
    return (
      <MobileShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MobileShell>
    )
  }

  if (!habit) {
    return (
      <MobileShell>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-muted-foreground mb-4 text-sm">Hábito não encontrado</p>
          <Button onClick={() => router.push("/")}>Voltar ao início</Button>
        </div>
      </MobileShell>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short"
    })
  }

  return (
    <MobileShell>
      <HabitHeader
        title={`Gráficos: ${habit.name}`}
        habitId={habit.id}
      />

      <main className="flex-1 flex flex-col overflow-hidden pb-24">
        <div className="p-4 pt-6 flex-1 flex flex-col">
          <h2 className="text-lg font-bold mb-6 text-foreground text-center">Períodos de Abstinência</h2>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis 
                  dataKey="index" 
                  tickFormatter={(val) => `#${val}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartData
                      return (
                        <div className="bg-popover border border-border rounded-xl p-3 shadow-lg">
                          <p className="text-sm font-bold text-popover-foreground mb-1">
                            {formatDuration(data.duration)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(data.startDate)} a {formatDate(data.endDate)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="duration" 
                  radius={[4, 4, 4, 4]} 
                  maxBarSize={48}
                  onClick={(data: any) => setSelectedBar(data)}
                >
                  {chartData.map((entry) => (
                    <Cell 
                      key={entry.id} 
                      fill={entry.isActive ? habit.color : "hsl(var(--muted-foreground))"} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 mb-6 p-4 rounded-2xl border border-border bg-card">
            {selectedBar ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Detalhes do período #{selectedBar.index}</p>
                <p className="text-xl font-bold text-foreground">{formatDuration(selectedBar.duration)}</p>
                <p className="text-sm text-muted-foreground">
                  De: <span className="text-foreground">{formatDate(selectedBar.startDate)}</span>
                  <br/>
                  Até: <span className="text-foreground">{formatDate(selectedBar.endDate)}</span>
                </p>
                {selectedBar.isActive && (
                  <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                    Período Atual
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-center">
                <p className="text-sm text-muted-foreground">Toque em uma barra do gráfico para ver os detalhes do período</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </MobileShell>
  )
}
