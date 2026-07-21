'use client'

import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency } from '@/lib/format'
import { useMemo } from 'react'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarioPage() {
  const { receitas, despesas, contasFixas, hideValues } = useFinance()
  const year = 2026
  const month = 6 // Julho (0-indexed)
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const eventosCalculados = useMemo(() => {
    const list: { dia: number; titulo: string; valor: number; tipo: 'entrada' | 'saida' }[] = []

    for (const r of receitas) {
      const day = new Date(r.data).getDate()
      if (!isNaN(day)) {
        list.push({ dia: day, titulo: r.nome, valor: r.valor, tipo: 'entrada' })
      }
    }

    for (const d of despesas) {
      const day = new Date(d.data).getDate()
      if (!isNaN(day)) {
        list.push({ dia: day, titulo: d.nome, valor: d.valor, tipo: 'saida' })
      }
    }

    for (const c of contasFixas.filter((cf) => cf.ativo)) {
      list.push({ dia: c.diaVencimento, titulo: c.nome, valor: c.valor, tipo: 'saida' })
    }

    return list
  }, [receitas, despesas, contasFixas])

  const eventosDoDia = (dia: number) => eventosCalculados.filter((e) => e.dia === dia)

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="Calendário financeiro"
        description="Recebimentos, contas e parcelas ao longo do mês. Julho / 2026."
      />

      <Card>
        <CardContent className="p-3 sm:p-5">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="pb-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
            {cells.map((dia, i) => {
              if (dia === null) return <div key={`empty-${i}`} className="min-h-16 sm:min-h-24" />
              const eventos = eventosDoDia(dia)
              return (
                <div
                  key={dia}
                  className="min-h-16 rounded-lg border border-border bg-secondary/20 p-1.5 sm:min-h-24 overflow-hidden"
                >
                  <span className="text-xs font-medium text-muted-foreground">{dia}</span>
                  <div className="mt-1 grid gap-1">
                    {eventos.slice(0, 3).map((e, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight',
                          e.tipo === 'entrada'
                            ? 'bg-success/15 text-success'
                            : 'bg-destructive/15 text-destructive'
                        )}
                        title={`${e.titulo} • ${formatCurrency(e.valor, { hideValues })}`}
                      >
                        {e.titulo}
                      </div>
                    ))}
                    {eventos.length > 3 && (
                      <span className="text-[9px] text-muted-foreground font-medium px-1">
                        +{eventos.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-success" /> Entradas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive" /> Saídas
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
