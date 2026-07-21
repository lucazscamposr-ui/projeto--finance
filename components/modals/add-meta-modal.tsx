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
  depositModeMetaId?: string | null
}

export function AddMetaModal({ open, onOpenChange, depositModeMetaId }: Props) {
  const { addMeta, contributeMeta, metas } = useFinance()
  const targetMeta = metas.find((m) => m.id === depositModeMetaId)

  // Meta creation fields
  const [nome, setNome] = useState('')
  const [alvo, setAlvo] = useState('')
  const [prazo, setPrazo] = useState('')

  // Deposit field
  const [valorAporte, setValorAporte] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (depositModeMetaId && targetMeta) {
      const val = parseFloat(valorAporte.replace(',', '.'))
      if (isNaN(val) || val <= 0) return
      contributeMeta(targetMeta.id, val)
      setValorAporte('')
      onOpenChange(false)
      return
    }

    const numAlvo = parseFloat(alvo.replace(',', '.'))
    if (!nome || isNaN(numAlvo) || numAlvo <= 0 || !prazo) return

    addMeta({
      nome,
      alvo: numAlvo,
      prazo,
    })

    setNome('')
    setAlvo('')
    setPrazo('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {depositModeMetaId && targetMeta ? `Adicionar Aporte: ${targetMeta.nome}` : 'Nova Meta Financeira'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {depositModeMetaId && targetMeta ? (
            <>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Progresso Atual</p>
                <p className="text-lg font-semibold text-primary">
                  R$ {targetMeta.guardado.toFixed(2)} de R$ {targetMeta.alvo.toFixed(2)}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valorAporte">Valor a Guardar (R$)</Label>
                <Input
                  id="valorAporte"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={valorAporte}
                  onChange={(e) => setValorAporte(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="nome">Objetivo / Nome da Meta</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Viagem de Férias, Reserva de Emergência"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="alvo">Valor Alvo (R$)</Label>
                  <Input
                    id="alvo"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={alvo}
                    onChange={(e) => setAlvo(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prazo">Data Limite / Prazo</Label>
                  <Input
                    id="prazo"
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-primary">
              {depositModeMetaId ? 'Confirmar Aporte' : 'Salvar Meta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
