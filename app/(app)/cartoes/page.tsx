import { Plus, CreditCard, Bus, Utensils } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cartoes } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/format'

const tipoIcon = {
  Crédito: CreditCard,
  Flash: Utensils,
  Bilhete: Bus,
} as const

export default function CartoesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Cartões"
        description="Crédito, Flash e Bilhete — saldo, limite e uso."
        action={
          <Button className="glow-primary">
            <Plus className="size-4" />
            Novo cartão
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cartoes.map((c) => {
          const Icon = tipoIcon[c.tipo]
          const uso = (c.saldo / c.limite) * 100
          const disponivel = c.limite - c.saldo
          return (
            <Card key={c.id} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-5 text-white"
                style={{ background: `color-mix(in oklch, var(--${c.cor}) 80%, black)` }}
              >
                <div>
                  <p className="text-xs opacity-80">{c.tipo}</p>
                  <p className="text-lg font-semibold">{c.nome}</p>
                </div>
                <Icon className="size-6 opacity-90" />
              </div>
              <CardContent className="grid gap-3 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {c.tipo === 'Crédito' ? 'Fatura atual' : 'Saldo usado'}
                    </p>
                    <p className="text-xl font-semibold tabular-nums">{formatCurrency(c.saldo)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Disponível</p>
                    <p className="text-sm font-medium tabular-nums text-success">
                      {formatCurrency(disponivel)}
                    </p>
                  </div>
                </div>
                <Progress value={uso} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {formatPercent(uso)} de {formatCurrency(c.limite)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Movimentações recentes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Nenhuma movimentação carregada ainda — os dados aparecerão aqui quando o banco estiver
          conectado.
        </CardContent>
      </Card>
    </div>
  )
}
