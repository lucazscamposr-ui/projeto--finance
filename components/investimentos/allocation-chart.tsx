'use client'

import { Cell, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { investimentos } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)']

const config = { valor: { label: 'Valor' } } satisfies ChartConfig

export function AllocationChart() {
  const data = investimentos.map((i, idx) => ({
    name: i.tipo,
    valor: i.valor,
    fill: colors[idx % colors.length],
  }))

  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-[220px]">
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="name" formatter={(value) => formatCurrency(Number(value))} />}
        />
        <Pie data={data} dataKey="valor" nameKey="name" innerRadius={55} outerRadius={90} strokeWidth={2}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.fill} stroke="var(--card)" />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
