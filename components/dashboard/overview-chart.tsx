'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { serieMensal } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

const config = {
  receitas: { label: 'Receitas', color: 'var(--chart-1)' },
  despesas: { label: 'Despesas', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Entradas x Saídas</CardTitle>
        <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={serieMensal} margin={{ left: 4, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillReceitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-receitas)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-receitas)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-despesas)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-despesas)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              className="text-xs"
              tickFormatter={(v) => formatCurrency(Number(v), { compact: true })}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
            />
            <Area
              dataKey="receitas"
              type="monotone"
              stroke="var(--color-receitas)"
              fill="url(#fillReceitas)"
              strokeWidth={2}
            />
            <Area
              dataKey="despesas"
              type="monotone"
              stroke="var(--color-despesas)"
              fill="url(#fillDespesas)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
