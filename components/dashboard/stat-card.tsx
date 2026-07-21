import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  hint,
  accent = false,
}: {
  label: string
  value: string
  icon: LucideIcon
  trend?: number
  hint?: string
  accent?: boolean
}) {
  const positive = (trend ?? 0) >= 0
  return (
    <Card className={cn('overflow-hidden', accent && 'border-primary/30 bg-primary/[0.04]')}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div
            className={cn(
              'grid size-8 place-items-center rounded-lg',
              accent ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground',
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {trend !== undefined ? (
            <span
              className={cn(
                'flex items-center gap-0.5 font-medium',
                positive ? 'text-success' : 'text-destructive',
              )}
            >
              {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(trend)}%
            </span>
          ) : null}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
