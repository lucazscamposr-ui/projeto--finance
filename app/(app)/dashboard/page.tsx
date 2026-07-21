'use client'

import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Sparkles,
  Wallet,
  CalendarClock,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { InsightList } from '@/components/dashboard/insight-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddTransactionModal } from '@/components/modals/add-transaction-modal'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency, formatDate } from '@/lib/format'
import { proximos } from '@/lib/mock-data'

export default function DashboardPage() {
  const {
    user,
    saldoDisponivel,
    receitasMes,
    despesasMes,
    economiaMes,
    patrimonio,
    variacaoSaldo,
    variacaoDespesas,
    insights,
    receitas,
    despesas,
    hideValues,
  } = useFinance()

  const [modalOpen, setModalOpen] = useState(false)

  const poupancaPct = receitasMes > 0 ? Math.round((economiaMes / receitasMes) * 100) : 0

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <PageHeader
        title={`Olá, ${user.name.split(' ')[0]}`}
        description="Aqui está o resumo em tempo real da sua vida financeira hoje."
        action={
          <Button className="glow-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Nova transação
          </Button>
        }
      />

      {/* Cards principais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Saldo disponível"
          value={formatCurrency(saldoDisponivel, { hideValues })}
          icon={Wallet}
          trend={variacaoSaldo}
          hint="vs. mês passado"
          accent
        />
        <StatCard
          label="Receitas do mês"
          value={formatCurrency(receitasMes, { hideValues })}
          icon={ArrowUpCircle}
          hint={`${receitas.length} lançamentos`}
        />
        <StatCard
          label="Despesas do mês"
          value={formatCurrency(despesasMes, { hideValues })}
          icon={ArrowDownCircle}
          trend={variacaoDespesas}
          hint={`${despesas.length} lançamentos`}
        />
        <StatCard
          label="Economia do mês"
          value={formatCurrency(economiaMes, { hideValues })}
          icon={PiggyBank}
          hint={`${poupancaPct}% da renda`}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <CategoryChart />
      </div>

      {/* Próximos eventos + Assistente */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximos eventos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="grid size-9 place-items-center rounded-lg bg-success/10 text-success">
                <ArrowUpCircle className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Próximo recebimento</p>
                <p className="text-xs text-muted-foreground">
                  {proximos.recebimento.nome} • {formatDate(proximos.recebimento.data)}
                </p>
              </div>
              <span className="text-sm font-semibold text-success tabular-nums">
                +{formatCurrency(proximos.recebimento.valor, { hideValues })}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="grid size-9 place-items-center rounded-lg bg-destructive/10 text-destructive">
                <CalendarClock className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Próximo pagamento</p>
                <p className="text-xs text-muted-foreground">
                  {proximos.pagamento.nome} • {formatDate(proximos.pagamento.data)}
                </p>
              </div>
              <span className="text-sm font-semibold text-destructive tabular-nums">
                -{formatCurrency(proximos.pagamento.valor, { hideValues })}
              </span>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
              <p className="text-xs text-muted-foreground">Patrimônio total</p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums">
                {formatCurrency(patrimonio, { hideValues })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <CardTitle className="text-base">Assistente IA</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/assistente">Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <InsightList items={insights.slice(0, 3)} />
          </CardContent>
        </Card>
      </div>

      <AddTransactionModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
