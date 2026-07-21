'use client'

import { Cell, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { type Investimento } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

const colors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

const config = { valor: { label: 'Valor' } } satisfies ChartConfig

type Props = {
  items: Investimento[]
  hideValues?: boolean
}

export function AllocationChart({ items, hideValues }: Props) {
  const data = items.map((i, idx) => ({
    name: i.tipo,
    valor: i.valor,
    fill: colors[idx % colors.length],
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-xs text-muted-foreground">
        Nenhum investimento cadastrado
      </div>
    )
  }

  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-[220px]">
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="name"
              formatter={(value) => formatCurrency(Number(value), { hideValues })}
            />
          }
        />
        <Pie
          data={data}
          dataKey="valor"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          strokeWidth={2}
        >
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.fill} stroke="var(--card)" />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
