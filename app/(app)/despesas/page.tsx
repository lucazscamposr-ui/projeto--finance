import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { TransactionsTable } from '@/components/transactions-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { despesas } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

export default function DespesasPage() {
  const total = despesas.reduce((acc, d) => acc + d.valor, 0)
  const pago = despesas.filter((d) => d.status === 'pago').reduce((a, d) => a + d.valor, 0)
  const pendente = total - pago

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Despesas"
        description="Todas as suas saídas do mês."
        action={
          <Button className="glow-primary">
            <Plus className="size-4" />
            Nova despesa
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total do mês</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Pago</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-success">
              {formatCurrency(pago)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">A pagar</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
              {formatCurrency(pendente)}
            </p>
          </CardContent>
        </Card>
      </div>

      <TransactionsTable items={despesas} />
    </div>
  )
}
