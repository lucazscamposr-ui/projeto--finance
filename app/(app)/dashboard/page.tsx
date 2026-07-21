import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Sparkles,
  Wallet,
  CalendarClock,
} from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { InsightList } from '@/components/dashboard/insight-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { summary, proximos, insights, user } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/format'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={`Olá, ${user.name.split(' ')[0]}`}
        description="Aqui está o resumo da sua vida financeira hoje."
      />

      {/* Cards principais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Saldo disponível"
          value={formatCurrency(summary.saldoDisponivel)}
          icon={Wallet}
          trend={summary.variacaoSaldo}
          hint="vs. mês passado"
          accent
        />
        <StatCard
          label="Receitas do mês"
          value={formatCurrency(summary.receitasMes)}
          icon={ArrowUpCircle}
          hint="5 lançamentos"
        />
        <StatCard
          label="Despesas do mês"
          value={formatCurrency(summary.despesasMes)}
          icon={ArrowDownCircle}
          trend={summary.variacaoDespesas}
          hint="vs. mês passado"
        />
        <StatCard
          label="Economia do mês"
          value={formatCurrency(summary.economiaMes)}
          icon={PiggyBank}
          hint="18% da renda"
        />
      </div>

      {/* Gráficos */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <CategoryChart />
      </div>

      {/* Próximos eventos + Assistente */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                +{formatCurrency(proximos.recebimento.valor)}
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
                -{formatCurrency(proximos.pagamento.valor)}
              </span>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
              <p className="text-xs text-muted-foreground">Patrimônio total</p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums">
                {formatCurrency(summary.patrimonio)}
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
    </div>
  )
}
