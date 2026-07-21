import { ArrowDown, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { Fragment } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { fluxoCaixa } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'

export default function FluxoCaixaPage() {
  const menorSaldo = Math.min(...fluxoCaixa.map((f) => f.saldo))
  const saldoFinal = fluxoCaixa[fluxoCaixa.length - 1].saldo

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Fluxo de caixa"
        description="Simulação do seu saldo nos próximos dias, calculada automaticamente."
      />

      <div className="mb-4 grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Menor saldo previsto</p>
            <p className={cn('mt-1 text-2xl font-semibold tabular-nums', menorSaldo < 0 ? 'text-destructive' : 'text-success')}>
              {formatCurrency(menorSaldo)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Saldo ao final</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCurrency(saldoFinal)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Linha do tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-stretch">
            {fluxoCaixa.map((step, i) => {
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
                            : 'bg-destructive/10 text-destructive',
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
                          isEntrada ? 'text-success' : 'text-destructive',
                        )}
                      >
                        {isEntrada ? '+' : '-'}
                        {formatCurrency(Math.abs(step.delta))}
                      </span>
                    )}
                    <span
                      className={cn(
                        'ml-3 w-28 text-right text-sm font-semibold tabular-nums',
                        step.saldo < 0 ? 'text-destructive' : 'text-foreground',
                      )}
                    >
                      {formatCurrency(step.saldo)}
                    </span>
                  </div>
                  {i < fluxoCaixa.length - 1 && (
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
