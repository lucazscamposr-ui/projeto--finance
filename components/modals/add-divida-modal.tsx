'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFinance } from '@/lib/finance-context'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  payModeDebtId?: string | null
}

export function AddDividaModal({ open, onOpenChange, payModeDebtId }: Props) {
  const { addDivida, payDivida, dividas } = useFinance()
  const targetDebt = dividas.find((d) => d.id === payModeDebtId)

  // Debt fields
  const [pessoa, setPessoa] = useState('')
  const [total, setTotal] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [prioridade, setPrioridade] = useState<'alta' | 'média' | 'baixa'>('média')

  // Payment field
  const [valorPagamento, setValorPagamento] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (payModeDebtId && targetDebt) {
      const val = parseFloat(valorPagamento.replace(',', '.'))
      if (isNaN(val) || val <= 0) return
      payDivida(targetDebt.id, val)
      setValorPagamento('')
      onOpenChange(false)
      return
    }

    const numTotal = parseFloat(total.replace(',', '.'))
    if (!pessoa || isNaN(numTotal) || numTotal <= 0 || !vencimento) return

    addDivida({
      pessoa,
      total: numTotal,
      vencimento,
      prioridade,
    })

    setPessoa('')
    setTotal('')
    setVencimento('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {payModeDebtId && targetDebt ? `Registrar Pagamento: ${targetDebt.pessoa}` : 'Nova Dívida'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {payModeDebtId && targetDebt ? (
            <>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Valor Restante Devido</p>
                <p className="text-lg font-semibold text-destructive">
                  R$ {(targetDebt.total - targetDebt.pago).toFixed(2)}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valorPagamento">Valor a Abater (R$)</Label>
                <Input
                  id="valorPagamento"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={valorPagamento}
                  onChange={(e) => setValorPagamento(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="pessoa">Credor / Cartão / Pessoa</Label>
                <Input
                  id="pessoa"
                  placeholder="Ex: Empréstimo Santander, Cartão Nubank"
                  value={pessoa}
                  onChange={(e) => setPessoa(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="total">Valor Total (R$)</Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vencimento">Vencimento</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prioridade">Prioridade de Quitação</Label>
                <select
                  id="prioridade"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value as 'alta' | 'média' | 'baixa')}
                >
                  <option value="alta">Alta (Juros altos / Cartão)</option>
                  <option value="média">Média (Financiamentos)</option>
                  <option value="baixa">Baixa (Amigos / Família)</option>
                </select>
              </div>
            </>
          )}

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-primary">
              {payModeDebtId ? 'Confirmar Pagamento' : 'Salvar Dívida'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
