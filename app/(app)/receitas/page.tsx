'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { TransactionsTable } from '@/components/transactions-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFinance } from '@/lib/finance-context'
import { AddTransactionModal } from '@/components/modals/add-transaction-modal'
import { formatCurrency } from '@/lib/format'

export default function ReceitasPage() {
  const { receitas } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)

  const total = receitas.reduce((acc, r) => acc + r.valor, 0)
  const recebido = receitas.filter((r) => r.status === 'pago').reduce((a, r) => a + r.valor, 0)
  const pendente = total - recebido

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Receitas"
        description="Todas as suas entradas do mês."
        action={
          <Button className="glow-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Nova receita
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total previsto</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Recebido</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-success">
              {formatCurrency(recebido)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">A receber</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-warning">
              {formatCurrency(pendente)}
            </p>
          </CardContent>
        </Card>
      </div>

      <TransactionsTable items={receitas} />

      <AddTransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultType="receita"
      />
    </div>
  )
}
