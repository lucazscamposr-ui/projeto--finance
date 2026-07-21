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

export function AddContaFixaModal({ open, onOpenChange }: Props) {
  const { addContaFixa } = useFinance()
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [diaVencimento, setDiaVencimento] = useState('10')
  const [categoria, setCategoria] = useState('Serviços')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numValor = parseFloat(valor.replace(',', '.'))
    const numDia = parseInt(diaVencimento, 10)
    if (!nome || isNaN(numValor) || numValor <= 0 || isNaN(numDia)) return

    addContaFixa({
      nome,
      valor: numValor,
      diaVencimento: numDia,
      categoria: categoria || 'Serviços',
      ativo: true,
    })

    setNome('')
    setValor('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta Fixa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome da Conta / Recorrência</Label>
            <Input
              id="nome"
              placeholder="Ex: Aluguel, Plano de Saúde, Spotify"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor Mensal (R$)</Label>
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
              <Label htmlFor="dia">Dia do Vencimento</Label>
              <Input
                id="dia"
                type="number"
                min="1"
                max="31"
                placeholder="10"
                value={diaVencimento}
                onChange={(e) => setDiaVencimento(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              placeholder="Ex: Moradia, Saúde, Streaming, Educação"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-primary">
              Salvar Conta Fixa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
