import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { dividas } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/format'

const prioridadeStyle: Record<string, string> = {
  alta: 'border-destructive/30 bg-destructive/10 text-destructive',
  média: 'border-warning/30 bg-warning/10 text-warning',
  baixa: 'border-border bg-secondary text-muted-foreground',
}

function diasRestantes(iso: string) {
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  return diff
}

export default function DividasPage() {
  const totalRestante = dividas.reduce((acc, d) => acc + (d.total - d.pago), 0)

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dívidas"
        description="Acompanhe o que falta quitar e priorize os pagamentos."
        action={
          <Button className="glow-primary">
            <Plus className="size-4" />
            Nova dívida
          </Button>
        }
      />

      <Card className="mb-4 border-primary/30 bg-primary/[0.04]">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Total ainda devido</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{formatCurrency(totalRestante)}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {dividas.map((d) => {
          const restante = d.total - d.pago
          const pct = (d.pago / d.total) * 100
          const dias = diasRestantes(d.vencimento)
          return (
            <Card key={d.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{d.pessoa}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Vence {formatDate(d.vencimento)} • {dias > 0 ? `${dias} dias` : 'vencida'}
                  </p>
                </div>
                <Badge variant="outline" className={cn('text-xs capitalize', prioridadeStyle[d.prioridade])}>
                  {d.prioridade}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Restante</p>
                    <p className="text-xl font-semibold tabular-nums text-destructive">
                      {formatCurrency(restante)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Pago</p>
                    <p className="text-sm font-medium tabular-nums text-success">
                      {formatCurrency(d.pago)} de {formatCurrency(d.total)}
                    </p>
                  </div>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{Math.round(pct)}% quitado</span>
                  <Button variant="secondary" size="sm">
                    Registrar pagamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
