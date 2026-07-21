'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AddDividaModal } from '@/components/modals/add-divida-modal'
import { useFinance } from '@/lib/finance-context'
import { cn } from '@/lib/utils'
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
  const { dividas, deleteDivida, hideValues } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)
  const [payModeDebtId, setPayModeDebtId] = useState<string | null>(null)

  const totalRestante = dividas.reduce((acc, d) => acc + (d.total - d.pago), 0)

  const handleOpenPayment = (id: string) => {
    setPayModeDebtId(id)
    setModalOpen(true)
  }

  const handleOpenNew = () => {
    setPayModeDebtId(null)
    setModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader
        title="Dívidas"
        description="Acompanhe o que falta quitar e priorize os pagamentos."
        action={
          <Button className="glow-primary" onClick={handleOpenNew}>
            <Plus className="size-4" />
            Nova dívida
          </Button>
        }
      />

      <Card className="border-primary/30 bg-primary/[0.04]">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">Total ainda devido</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-destructive">
            {formatCurrency(totalRestante, { hideValues })}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {dividas.map((d) => {
          const restante = d.total - d.pago
          const pct = Math.min(100, (d.pago / d.total) * 100)
          const dias = diasRestantes(d.vencimento)
          return (
            <Card key={d.id} className="relative overflow-hidden">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{d.pessoa}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Vence {formatDate(d.vencimento)} • {dias > 0 ? `${dias} dias` : 'Vencida'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn('text-xs capitalize', prioridadeStyle[d.prioridade])}>
                    {d.prioridade}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteDivida(d.id)}
                    title="Excluir dívida"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Restante</p>
                    <p className="text-xl font-semibold tabular-nums text-destructive">
                      {formatCurrency(restante, { hideValues })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Pago</p>
                    <p className="text-sm font-medium tabular-nums text-success">
                      {formatCurrency(d.pago, { hideValues })} de {formatCurrency(d.total, { hideValues })}
                    </p>
                  </div>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{Math.round(pct)}% quitado</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenPayment(d.id)}
                  >
                    Registrar pagamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {dividas.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Nenhuma dívida cadastrada. Parabéns!
          </div>
        )}
      </div>

      <AddDividaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        payModeDebtId={payModeDebtId}
      />
    </div>
  )
}
