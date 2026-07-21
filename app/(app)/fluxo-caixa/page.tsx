'use client'

import { ArrowDown, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency } from '@/lib/format'

type Step = {
  data: string
  descricao: string
  delta: number
  saldo: number
  tipo: 'entrada' | 'saida' | 'inicio'
}

export default function FluxoCaixaPage() {
  const { saldoDisponivel, receitas, despesas, contasFixas, hideValues } = useFinance()

  const fluxoCalculado = useMemo(() => {
    let runningSaldo = saldoDisponivel
    const steps: Step[] = [
      { data: 'Hoje', descricao: 'Saldo inicial disponível', delta: 0, saldo: runningSaldo, tipo: 'inicio' },
    ]

    // Pending receitas
    const pendentesRec = receitas.filter((r) => r.status === 'pendente')
    for (const r of pendentesRec) {
      runningSaldo += r.valor
      steps.push({
        data: r.data,
        descricao: r.nome,
        delta: r.valor,
        saldo: runningSaldo,
        tipo: 'entrada',
      })
    }

    // Active fixed accounts
    for (const c of contasFixas.filter((cf) => cf.ativo)) {
      runningSaldo -= c.valor
      steps.push({
        data: `Dia ${c.diaVencimento}`,
        descricao: `${c.nome} (Fixa)`,
        delta: -c.valor,
        saldo: runningSaldo,
        tipo: 'saida',
      })
    }

    // Pending despesas
    const pendentesDesp = despesas.filter((d) => d.status === 'pendente')
    for (const d of pendentesDesp) {
      runningSaldo -= d.valor
      steps.push({
        data: d.data,
        descricao: d.nome,
        delta: -d.valor,
        saldo: runningSaldo,
        tipo: 'saida',
      })
    }

    return steps
  }, [saldoDisponivel, receitas, despesas, contasFixas])

  const menorSaldo = Math.min(...fluxoCalculado.map((f) => f.saldo))
  const saldoFinal = fluxoCalculado[fluxoCalculado.length - 1]?.saldo ?? saldoDisponivel

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Fluxo de caixa"
        description="Simulação do seu saldo nos próximos dias, calculada automaticamente."
      />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Menor saldo previsto</p>
            <p
              className={cn(
                'mt-1 text-2xl font-semibold tabular-nums',
                menorSaldo < 0 ? 'text-destructive' : 'text-success'
              )}
            >
              {formatCurrency(menorSaldo, { hideValues })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Saldo ao final</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCurrency(saldoFinal, { hideValues })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Linha do tempo projetada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-stretch">
            {fluxoCalculado.map((step, i) => {
              const isEntrada = step.tipo === 'entrada'
              const isInicio = step.tipo === 'inicio'
              return (
                <Fragment key={i}>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                    <div
                      className={cn(
                        'grid size-9 shrink-0 place-items-center rounded-lg',
                        isInicio
                          ? 'bg-primary/15 text-primary'
                          : isEntrada
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {isInicio ? (
                        <Wallet className="size-4" />
                      ) : isEntrada ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowDownRight className="size-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{step.descricao}</p>
                      <p className="text-xs text-muted-foreground">{step.data}</p>
                    </div>
                    {!isInicio && (
                      <span
                        className={cn(
                          'text-sm font-medium tabular-nums',
                          isEntrada ? 'text-success' : 'text-destructive'
                        )}
                      >
                        {isEntrada ? '+' : '-'}
                        {formatCurrency(Math.abs(step.delta), { hideValues })}
                      </span>
                    )}
                    <span
                      className={cn(
                        'ml-3 w-28 text-right text-sm font-semibold tabular-nums',
                        step.saldo < 0 ? 'text-destructive' : 'text-foreground'
                      )}
                    >
                      {formatCurrency(step.saldo, { hideValues })}
                    </span>
                  </div>
                  {i < fluxoCalculado.length - 1 && (
                    <div className="flex justify-center py-1 text-muted-foreground/50">
                      <ArrowDown className="size-4" />
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
