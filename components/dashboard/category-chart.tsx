'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { despesasPorCategoria } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

const config = {
  valor: { label: 'Gasto', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function CategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Despesas por categoria</CardTitle>
        <p className="text-sm text-muted-foreground">Julho / 2026</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <BarChart
            data={despesasPorCategoria}
            layout="vertical"
            margin={{ left: 8, right: 12 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="categoria"
              tickLine={false}
              axisLine={false}
              width={90}
              className="text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
            />
            <Bar dataKey="valor" fill="var(--color-valor)" radius={[0, 6, 6, 0]} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
