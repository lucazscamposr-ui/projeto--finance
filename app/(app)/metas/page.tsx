import { Plus, Target } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { metas } from '@/lib/mock-data'
import { formatCurrency, formatDate, formatPercent } from '@/lib/format'

export default function MetasPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Metas"
        description="Objetivos financeiros e seu progresso."
        action={
          <Button className="glow-primary">
            <Plus className="size-4" />
            Nova meta
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metas.map((m) => {
          const pct = (m.guardado / m.alvo) * 100
          const restante = m.alvo - m.guardado
          return (
            <Card key={m.id}>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Target className="size-4" />
                </div>
                <CardTitle className="text-base">{m.nome}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{formatCurrency(m.guardado)}</p>
                  <p className="text-xs text-muted-foreground">de {formatCurrency(m.alvo)}</p>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary">{formatPercent(pct)} concluído</span>
                  <span className="text-muted-foreground">faltam {formatCurrency(restante)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Prazo: {formatDate(m.prazo)}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
