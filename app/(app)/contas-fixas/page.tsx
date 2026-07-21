'use client'

import { useState } from 'react'
import { Plus, Receipt, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AddContaFixaModal } from '@/components/modals/add-conta-fixa-modal'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency } from '@/lib/format'

export default function ContasFixasPage() {
  const { contasFixas, toggleContaFixaAtiva, deleteContaFixa, hideValues } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)

  const ativas = contasFixas.filter((c) => c.ativo)
  const total = ativas.reduce((acc, c) => acc + c.valor, 0)

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="Contas fixas"
        description="Assinaturas e contas recorrentes geradas automaticamente todo mês."
        action={
          <Button className="glow-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Nova conta fixa
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">Total mensal recorrente</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCurrency(total, { hideValues })}
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            {ativas.length} contas ativas
          </Badge>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <ul className="divide-y divide-border">
          {contasFixas.map((c) => (
            <li key={c.id} className="flex items-center gap-3 p-4 hover:bg-secondary/40 transition-colors">
              <div className="grid size-10 place-items-center rounded-lg bg-secondary text-muted-foreground">
                <Receipt className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{c.nome}</p>
                  {!c.ativo && (
                    <Badge variant="secondary" className="text-[10px]">
                      Inativo
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.categoria} • Vence todo dia {c.diaVencimento}
                </p>
              </div>

              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(c.valor, { hideValues })}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => toggleContaFixaAtiva(c.id)}
                >
                  {c.ativo ? 'Pausar' : 'Ativar'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteContaFixa(c.id)}
                  title="Excluir"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}

          {contasFixas.length === 0 && (
            <li className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma conta fixa cadastrada.
            </li>
          )}
        </ul>
      </Card>

      <AddContaFixaModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
