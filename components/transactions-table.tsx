import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AddTransactionModal } from '@/components/modals/add-transaction-modal'
import { useFinance } from '@/lib/finance-context'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDayMonth } from '@/lib/format'
import type { Transacao } from '@/lib/mock-data'

export function TransactionsTable({ items }: { items: Transacao[] }) {
  const { deleteTransacao } = useFinance()
  const [editingItem, setEditingItem] = useState<Transacao | null>(null)
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
              <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
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
                      'text-xs',
                      t.status === 'pago'
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-warning/30 bg-warning/10 text-warning',
                    )}
                  >
                    {t.status === 'pago' ? 'Pago' : 'Pendente'}
                  </Badge>
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right font-semibold tabular-nums',
                    t.tipo === 'receita' ? 'text-success' : 'text-destructive',
                  )}
                >
                  {t.tipo === 'receita' ? '+' : '-'}
                  {formatCurrency(t.valor)}
                </td>
                <td className="px-2 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8" aria-label="Ações">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingItem(t)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteTransacao(t.id, t.tipo)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <AddTransactionModal
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          defaultType={editingItem.tipo}
          initialData={editingItem}
        />
      )}
    </Card>
  )
}
