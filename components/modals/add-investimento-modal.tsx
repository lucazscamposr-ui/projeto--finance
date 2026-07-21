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
}

export function AddInvestimentoModal({ open, onOpenChange }: Props) {
  const { addInvestimento } = useFinance()
  const [tipo, setTipo] = useState('Tesouro Selic')
  const [instituicao, setInstituicao] = useState('Tesouro Direto')
  const [valor, setValor] = useState('')
  const [rentabilidade, setRentabilidade] = useState('11.55')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numValor = parseFloat(valor.replace(',', '.'))
    const numRent = parseFloat(rentabilidade.replace(',', '.')) || 0
    if (!tipo || isNaN(numValor) || numValor <= 0) return

    addInvestimento({
      tipo,
      instituicao: instituicao || 'XP',
      valor: numValor,
      rentabilidade: numRent,
    })

    setValor('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Aporte / Investimento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="tipo">Ativo / Tipo de Investimento</Label>
            <Input
              id="tipo"
              placeholder="Ex: Tesouro Selic 2029, CDB 120% CDI, HGLG11, PETR4"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="instituicao">Corretora / Banco</Label>
              <select
                id="instituicao"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
              >
                <option value="Tesouro Direto">Tesouro Direto</option>
                <option value="XP Corretora">XP Corretora</option>
                <option value="Banco Inter">Banco Inter</option>
                <option value="Nuinvest">Nuinvest</option>
                <option value="BTG Pactual">BTG Pactual</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rentabilidade">Rentabilidade (% a.a.)</Label>
              <Input
                id="rentabilidade"
                type="number"
                step="0.01"
                placeholder="11.50"
                value={rentabilidade}
                onChange={(e) => setRentabilidade(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="valor">Valor Total Aportado (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="1000.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-primary">
              Salvar Investimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
