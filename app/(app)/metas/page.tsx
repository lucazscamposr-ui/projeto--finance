'use client'

import { useState } from 'react'
import { Plus, Target, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AddMetaModal } from '@/components/modals/add-meta-modal'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency, formatDate, formatPercent } from '@/lib/format'

export default function MetasPage() {
  const { metas, deleteMeta, hideValues } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)
  const [depositModeMetaId, setDepositModeMetaId] = useState<string | null>(null)

  const handleOpenDeposit = (id: string) => {
    setDepositModeMetaId(id)
    setModalOpen(true)
  }

  const handleOpenNew = () => {
    setDepositModeMetaId(null)
    setModalOpen(true)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="Metas"
        description="Objetivos financeiros e seu progresso de acumulação de patrimônio."
        action={
          <Button className="glow-primary" onClick={handleOpenNew}>
            <Plus className="size-4" />
            Nova meta
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metas.map((m) => {
          const pct = Math.min(100, (m.guardado / m.alvo) * 100)
          const restante = Math.max(0, m.alvo - m.guardado)
          return (
            <Card key={m.id} className="relative flex flex-col justify-between">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Target className="size-4" />
                  </div>
                  <CardTitle className="text-base">{m.nome}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMeta(m.id)}
                  title="Excluir meta"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </CardHeader>

              <CardContent className="grid gap-3 pt-2">
                <div>
                  <p className="text-2xl font-semibold tabular-nums text-foreground">
                    {formatCurrency(m.guardado, { hideValues })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    alvo de {formatCurrency(m.alvo, { hideValues })}
                  </p>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary">{formatPercent(pct)} concluído</span>
                  <span className="text-muted-foreground">
                    faltam {formatCurrency(restante, { hideValues })}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-[11px] text-muted-foreground">
                    Prazo: {formatDate(m.prazo)}
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => handleOpenDeposit(m.id)}>
                    + Aportar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {metas.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Nenhuma meta cadastrada. Clique em &quot;Nova meta&quot; para definir seus objetivos.
          </div>
        )}
      </div>

      <AddMetaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        depositModeMetaId={depositModeMetaId}
      />
    </div>
  )
}
