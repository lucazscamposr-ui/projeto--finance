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
import type { Transacao } from '@/lib/mock-data'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: 'receita' | 'despesa'
  initialData?: Transacao
}

export function AddTransactionModal({ open, onOpenChange, defaultType = 'despesa', initialData }: Props) {
  const { addReceita, addDespesa, updateTransacao } = useFinance()
  const [tipo, setTipo] = useState<'receita' | 'despesa'>(initialData?.tipo || defaultType)
  const [nome, setNome] = useState(initialData?.nome || '')
  const [valor, setValor] = useState(initialData?.valor ? String(initialData.valor) : '')
  const [categoria, setCategoria] = useState(initialData?.categoria || '')
  const [conta, setConta] = useState(initialData?.conta || 'Nubank')
  const [data, setData] = useState(initialData?.data || new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<'pago' | 'pendente'>(initialData?.status || 'pago')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numValor = parseFloat(valor.replace(',', '.'))
    if (!nome || isNaN(numValor) || numValor <= 0) return

    const transactionData = {
      nome,
      valor: numValor,
      categoria: categoria || (tipo === 'receita' ? 'Geral' : 'Outros'),
      conta: conta || 'Nubank',
      data,
      status,
    }

    if (initialData) {
      updateTransacao(initialData.id, tipo, transactionData)
    } else {
      if (tipo === 'receita') {
        addReceita(transactionData)
      } else {
        addDespesa(transactionData)
      }
    }

    // Reset & close
    if (!initialData) {
      setNome('')
      setValor('')
      setCategoria('')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Movimentação' : 'Nova Movimentação'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              type="button"
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                tipo === 'receita' ? 'bg-background text-success shadow-xs' : 'text-muted-foreground'
              }`}
              onClick={() => setTipo('receita')}
            >
              Receita (+)
            </button>
            <button
              type="button"
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                tipo === 'despesa' ? 'bg-background text-destructive shadow-xs' : 'text-muted-foreground'
              }`}
              onClick={() => setTipo('despesa')}
            >
              Despesa (-)
            </button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nome">Descrição / Nome</Label>
            <Input
              id="nome"
              placeholder={tipo === 'receita' ? 'Ex: Freelance UI' : 'Ex: Supermercado'}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                placeholder={tipo === 'receita' ? 'Ex: Trabalho' : 'Ex: Alimentação'}
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="conta">Conta / Banco</Label>
              <select
                id="conta"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                value={conta}
                onChange={(e) => setConta(e.target.value)}
              >
                <option value="Nubank">Nubank</option>
                <option value="Inter">Inter</option>
                <option value="XP">XP</option>
                <option value="Itaú">Itaú</option>
                <option value="Bradesco">Bradesco</option>
                <option value="Carteira">Dinheiro Físico</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pago"
                  checked={status === 'pago'}
                  onChange={() => setStatus('pago')}
                  className="accent-primary"
                />
                {tipo === 'receita' ? 'Recebido' : 'Pago'}
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pendente"
                  checked={status === 'pendente'}
                  onChange={() => setStatus('pendente')}
                  className="accent-primary"
                />
                {tipo === 'receita' ? 'A receber' : 'Pendente'}
              </label>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-primary">
              Salvar {tipo === 'receita' ? 'Receita' : 'Despesa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
