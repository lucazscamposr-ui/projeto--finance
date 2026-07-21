'use client'

import { useState } from 'react'
import { Plus, LineChart as LineChartIcon, TrendingUp, Landmark, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AllocationChart } from '@/components/investimentos/allocation-chart'
import { AddInvestimentoModal } from '@/components/modals/add-investimento-modal'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency } from '@/lib/format'

export default function InvestimentosPage() {
  const { investimentos, deleteInvestimento, hideValues } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)

  const totalInvestido = investimentos.reduce((acc, i) => acc + i.valor, 0)
  const rentabilidadeMedia =
    investimentos.length > 0
      ? investimentos.reduce((acc, i) => acc + i.rentabilidade, 0) / investimentos.length
      : 0
  const rendimentoMensalEstimado = totalInvestido * (rentabilidadeMedia / 100 / 12)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Investimentos"
        description="Gestão de patrimônio, rentabilidade e alocação de ativos."
        action={
          <Button className="glow-primary" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Novo aporte
          </Button>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-primary/30 bg-primary/[0.03]">
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Total Investido</p>
              <Landmark className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
              {formatCurrency(totalInvestido, { hideValues })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Patrimônio acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Rentabilidade Média</p>
              <TrendingUp className="size-4 text-success" />
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums text-success">
              {rentabilidadeMedia.toFixed(2)}% a.a.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Média da carteira</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Rendimento Est. Mensal</p>
              <LineChartIcon className="size-4 text-warning" />
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
              +{formatCurrency(rendimentoMensalEstimado, { hideValues })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Projeção de juros compostos</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Distribution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex flex-col justify-center">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-base">Alocação de Ativos</CardTitle>
            <CardDescription className="text-xs">Distribuição percentual da carteira</CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationChart items={investimentos} hideValues={hideValues} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Meus Ativos</CardTitle>
              <CardDescription className="text-xs">Lista completa dos investimentos</CardDescription>
            </div>
            <Badge variant="outline">{investimentos.length} ativos</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-3 font-medium">Ativo / Tipo</th>
                    <th className="pb-3 font-medium">Instituição</th>
                    <th className="pb-3 font-medium text-right">Rentabilidade</th>
                    <th className="pb-3 font-medium text-right">Valor Aportado</th>
                    <th className="pb-3 font-medium text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {investimentos.map((inv) => {
                    const pct = totalInvestido > 0 ? (inv.valor / totalInvestido) * 100 : 0
                    return (
                      <tr key={inv.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 font-medium">
                          <div>
                            <span className="text-foreground">{inv.tipo}</span>
                            <span className="ml-2 text-[11px] text-muted-foreground">
                              ({Math.round(pct)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">{inv.instituicao}</td>
                        <td className="py-3 text-right">
                          <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-xs">
                            +{inv.rentabilidade}% a.a.
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-semibold tabular-nums">
                          {formatCurrency(inv.valor, { hideValues })}
                        </td>
                        <td className="py-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteInvestimento(inv.id)}
                            title="Remover investimento"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                  {investimentos.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                        Nenhum ativo cadastrado. Clique em &quot;Novo aporte&quot; para adicionar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddInvestimentoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
