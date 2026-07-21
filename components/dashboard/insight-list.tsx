import { Lightbulb, TrendingUp, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Insight } from '@/lib/mock-data'

const styles = {
  positivo: { icon: TrendingUp, cls: 'text-success bg-success/10' },
  alerta: { icon: TriangleAlert, cls: 'text-warning bg-warning/10' },
  dica: { icon: Lightbulb, cls: 'text-primary bg-primary/10' },
} as const

export function InsightList({ items }: { items: Insight[] }) {
  return (
    <div className="grid gap-3">
      {items.map((insight) => {
        const style = styles[insight.tipo]
        const Icon = style.icon
        return (
          <div
            key={insight.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3.5"
          >
            <div className={cn('grid size-8 shrink-0 place-items-center rounded-lg', style.cls)}>
              <Icon className="size-4" />
            </div>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-snug text-pretty">{insight.titulo}</p>
              <p className="text-sm text-muted-foreground leading-snug text-pretty">
                {insight.descricao}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
