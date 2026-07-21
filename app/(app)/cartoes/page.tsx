'use client'

import { useState } from 'react'
import { Plus, CreditCard, Bus, Utensils, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AddCartaoModal } from '@/components/modals/add-cartao-modal'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency, formatPercent } from '@/lib/format'

const tipoIcon = {
  Crédito: CreditCard,
  Flash: Utensils,
  Bilhete: Bus,
} as const

export default function CartoesPage() {
  const { cartoes, deleteCartao, hideValues } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="Cartões"
        description="Crédito, Flash e Bilhete — controle de limites e faturas."
        action={
          <Button className="glow-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Novo cartão
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cartoes.map((c) => {
          const Icon = tipoIcon[c.tipo] || CreditCard
          const limiteVal = c.limite || 1
          const uso = Math.min(100, (c.saldo / limiteVal) * 100)
          const disponivel = Math.max(0, c.limite - c.saldo)

          return (
            <Card key={c.id} className="overflow-hidden relative flex flex-col justify-between">
              <div
                className="flex items-center justify-between p-5 text-white"
                style={{ background: `color-mix(in oklch, var(--${c.cor || 'chart-1'}) 80%, black)` }}
              >
                <div>
                  <p className="text-xs opacity-80">{c.tipo}</p>
                  <p className="text-lg font-semibold">{c.nome}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => deleteCartao(c.id)}
                    title="Excluir cartão"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                  <Icon className="size-6 opacity-90" />
                </div>
              </div>
              <CardContent className="grid gap-3 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {c.tipo === 'Crédito' ? 'Fatura atual' : 'Saldo usado'}
                    </p>
                    <p className="text-xl font-semibold tabular-nums">
                      {formatCurrency(c.saldo, { hideValues })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Disponível</p>
                    <p className="text-sm font-medium tabular-nums text-success">
                      {formatCurrency(disponivel, { hideValues })}
                    </p>
                  </div>
                </div>
                <Progress value={uso} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {formatPercent(uso)} de {formatCurrency(c.limite, { hideValues })}
                </p>
              </CardContent>
            </Card>
          )
        })}

        {cartoes.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Nenhum cartão cadastrado.
          </div>
        )}
      </div>

      <AddCartaoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
