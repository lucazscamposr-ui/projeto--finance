'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { TransactionsTable } from '@/components/transactions-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AddTransactionModal } from '@/components/modals/add-transaction-modal'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency } from '@/lib/format'

export default function DespesasPage() {
  const { despesas, hideValues } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)

  const total = despesas.reduce((acc, d) => acc + d.valor, 0)
  const pago = despesas.filter((d) => d.status === 'pago').reduce((a, d) => a + d.valor, 0)
  const pendente = total - pago

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader
        title="Despesas"
        description="Todas as suas saídas financeiras do mês."
        action={
          <Button className="glow-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Nova despesa
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total do mês</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCurrency(total, { hideValues })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Pago</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-success">
              {formatCurrency(pago, { hideValues })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">A pagar</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
              {formatCurrency(pendente, { hideValues })}
            </p>
          </CardContent>
        </Card>
      </div>

      <TransactionsTable items={despesas} />

      <AddTransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultType="despesa"
      />
    </div>
  )
}
