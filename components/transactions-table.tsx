'use client'

import { MoreHorizontal, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDayMonth } from '@/lib/format'
import type { Transacao } from '@/lib/mock-data'
import { useFinance } from '@/lib/finance-context'

export function TransactionsTable({ items }: { items: Transacao[] }) {
  const { toggleTransacaoStatus, deleteTransacao, hideValues } = useFinance()

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada.
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Conta</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Data</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Valor</th>
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3 font-medium">{t.nome}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.categoria}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{t.conta}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {formatDayMonth(t.data)}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs cursor-pointer select-none',
                      t.status === 'pago'
                        ? 'border-success/30 bg-success/10 text-success hover:bg-success/20'
                        : 'border-warning/30 bg-warning/10 text-warning hover:bg-warning/20'
                    )}
                    onClick={() => toggleTransacaoStatus(t.id, t.tipo)}
                    title="Clique para alternar status"
                  >
                    {t.status === 'pago' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="size-3" /> {t.tipo === 'receita' ? 'Recebido' : 'Pago'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {t.tipo === 'receita' ? 'A receber' : 'Pendente'}
                      </span>
                    )}
                  </Badge>
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right font-semibold tabular-nums',
                    t.tipo === 'receita' ? 'text-success' : 'text-destructive'
                  )}
                >
                  {t.tipo === 'receita' ? '+' : '-'}
                  {formatCurrency(t.valor, { hideValues })}
                </td>
                <td className="px-2 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8" aria-label="Ações">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleTransacaoStatus(t.id, t.tipo)}>
                        Alternar para {t.status === 'pago' ? 'Pendente' : 'Pago'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteTransacao(t.id, t.tipo)}
                      >
                        <Trash2 className="size-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
