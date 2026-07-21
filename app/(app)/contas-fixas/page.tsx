import { Plus, Receipt } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { contasFixas } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

export default function ContasFixasPage() {
  const total = contasFixas.reduce((acc, c) => acc + c.valor, 0)

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Contas fixas"
        description="Assinaturas e contas recorrentes geradas automaticamente todo mês."
        action={
          <Button className="glow-primary">
            <Plus className="size-4" />
            Nova conta fixa
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">Total mensal recorrente</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            {contasFixas.length} contas ativas
          </Badge>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <ul className="divide-y divide-border">
          {contasFixas.map((c) => (
            <li key={c.id} className="flex items-center gap-3 p-4 hover:bg-secondary/40">
              <div className="grid size-10 place-items-center rounded-lg bg-secondary text-muted-foreground">
                <Receipt className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{c.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {c.categoria} • vence todo dia {c.diaVencimento}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums">{formatCurrency(c.valor)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
