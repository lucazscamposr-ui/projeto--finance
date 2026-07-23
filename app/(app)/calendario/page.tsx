"use client"

import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { eventosCalendario } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'
import { useFinance } from '@/lib/finance-context'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function CalendarioPage() {
  const year = 2026
  const month = 6 // Julho (0-indexed)
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const { despesas, dividas } = useFinance()

  // Map dynamic events (despesas pendentes and dividas) into calendar events
  const dynamicEventos = [
    ...despesas
      .filter((d) => d.status !== 'pago')
      .map((d) => ({ dia: new Date(d.data).getDate(), titulo: d.nome, valor: d.valor, tipo: 'saida' as const })),
    ...dividas
      .map((v) => {
        const dia = v.vencimento ? new Date(v.vencimento).getDate() : null
        return dia
          ? { dia, titulo: v.pessoa, valor: v.total - (v.pago || 0), tipo: 'saida' as const }
          : null
      })
      .filter(Boolean) as { dia: number; titulo: string; valor: number; tipo: 'saida' }[],
  ]

  const eventosDoDia = (dia: number) => {
    const staticEvt = eventosCalendario.filter((e) => e.dia === dia)
    const dyn = dynamicEventos.filter((e) => e.dia === dia)
    return [...staticEvt, ...dyn]
  }

  return (
    <div className="mx-auto max-w-5xl">
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
                  className="min-h-16 rounded-lg border border-border bg-secondary/20 p-1.5 sm:min-h-24"
                >
                  <span className="text-xs font-medium text-muted-foreground">{dia}</span>
                  <div className="mt-1 grid gap-1">
                    {eventos.map((e, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight',
                          e.tipo === 'entrada'
                            ? 'bg-success/15 text-success'
                            : 'bg-destructive/15 text-destructive',
                        )}
                        title={`${e.titulo} • ${formatCurrency(e.valor)}`}
                      >
                        {e.titulo}
                      </div>
                    ))}
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
