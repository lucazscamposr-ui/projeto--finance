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

export function AddCartaoModal({ open, onOpenChange }: Props) {
  const { addCartao } = useFinance()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'Crédito' | 'Flash' | 'Bilhete'>('Crédito')
  const [limite, setLimite] = useState('')
  const [saldo, setSaldo] = useState('')
  const [cor, setCor] = useState('chart-1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numLimite = parseFloat(limite.replace(',', '.')) || 0
    const numSaldo = parseFloat(saldo.replace(',', '.')) || 0
    if (!nome) return

    addCartao({
      nome,
      tipo,
      limite: numLimite,
      saldo: numSaldo,
      cor,
    })

    setNome('')
    setLimite('')
    setSaldo('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Cartão / Benefício</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome do Cartão / Emissor</Label>
            <Input
              id="nome"
              placeholder="Ex: Nubank Violeta, C6 Mastercard, Flash Vale"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de Cartão</Label>
              <select
                id="tipo"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'Crédito' | 'Flash' | 'Bilhete')}
              >
                <option value="Crédito">Cartão de Crédito</option>
                <option value="Flash">Benefício / VR / VA</option>
                <option value="Bilhete">Transporte / Mobilidade</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cor">Estilo do Cartão</Label>
              <select
                id="cor"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
              >
                <option value="chart-1">Azul Tech</option>
                <option value="chart-2">Ciano Moderno</option>
                <option value="chart-3">Esmeralda Pro</option>
                <option value="chart-4">Dourado VIP</option>
                <option value="chart-5">Roxo Néon</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="limite">Limite Total (R$)</Label>
              <Input
                id="limite"
                type="number"
                step="0.01"
                placeholder="5000.00"
                value={limite}
                onChange={(e) => setLimite(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="saldo">Fatura / Usado (R$)</Label>
              <Input
                id="saldo"
                type="number"
                step="0.01"
                placeholder="1200.00"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-primary">
              Salvar Cartão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
