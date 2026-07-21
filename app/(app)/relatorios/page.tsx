'use client'

import { useRef, useState } from 'react'
import {
  Download,
  Upload,
  Printer,
  FileSpreadsheet,
  RefreshCw,
  FileBarChart,
  Check,
  AlertCircle,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency } from '@/lib/format'
import { serieMensal } from '@/lib/mock-data'

export default function RelatoriosPage() {
  const {
    receitas,
    despesas,
    saldoDisponivel,
    patrimonio,
    receitasMes,
    despesasMes,
    economiaMes,
    exportData,
    importData,
    resetData,
    hideValues,
  } = useFinance()

  const [importStatus, setImportStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target?.result as string
      if (content) {
        const success = importData(content)
        if (success) {
          setImportStatus('Backup restaurado com sucesso!')
          setTimeout(() => setImportStatus(null), 4000)
        } else {
          setImportStatus('Erro: Arquivo JSON inválido.')
          setTimeout(() => setImportStatus(null), 4000)
        }
      }
    }
    reader.readAsText(file)
  }

  const exportCSV = () => {
    const headers = ['ID', 'Tipo', 'Nome', 'Categoria', 'Valor', 'Data', 'Status', 'Conta']
    const rows = [
      ...receitas.map((r) => [r.id, 'Receita', r.nome, r.categoria, r.valor, r.data, r.status, r.conta]),
      ...despesas.map((d) => [d.id, 'Despesa', d.nome, d.categoria, d.valor, d.data, d.status, d.conta]),
    ]
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `finance_ai_transacoes_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Relatórios & Exportação"
        description="Demonstrativos financeiros, gráficos de evolução e backup dos seus dados."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="size-4" />
              Imprimir
            </Button>
            <Button className="glow-primary" size="sm" onClick={exportData}>
              <Download className="size-4" />
              Exportar JSON
            </Button>
          </div>
        }
      />

      {/* Summary Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-primary/30 bg-primary/[0.03]">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Saldo Disponível</p>
            <p className="text-xl font-bold tabular-nums">
              {formatCurrency(saldoDisponivel, { hideValues })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Patrimônio Líquido</p>
            <p className="text-xl font-bold tabular-nums">
              {formatCurrency(patrimonio, { hideValues })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Receita Mensal</p>
            <p className="text-xl font-bold tabular-nums text-success">
              {formatCurrency(receitasMes, { hideValues })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Economia no Mês</p>
            <p className="text-xl font-bold tabular-nums text-primary">
              {formatCurrency(economiaMes, { hideValues })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Evolução Histórica (Receitas vs. Despesas)</span>
            <Badge variant="outline">Últimos 6 meses</Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Comparativo entre entradas e saídas de caixa
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serieMensal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <Tooltip
                formatter={(val) => formatCurrency(Number(val), { hideValues })}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="receitas" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Receitas" />
              <Bar dataKey="despesas" fill="var(--chart-5)" radius={[4, 4, 0, 0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export & Data Privacy Options */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-success" />
              Planilha CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Baixe todos os lançamentos de receitas e despesas em formato CSV para Excel ou Google Sheets.
            </p>
            <Button variant="outline" className="w-full text-xs gap-2" onClick={exportCSV}>
              <Download className="size-3.5" />
              Baixar Excel / CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Upload className="size-4 text-primary" />
              Restaurar Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Importe um arquivo JSON salvo anteriormente para restaurar todos os seus dados.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              className="w-full text-xs gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              Selecionar JSON
            </Button>

            {importStatus && (
              <div className="flex items-center gap-1.5 text-xs text-success">
                <Check className="size-3.5" />
                <span>{importStatus}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="size-4 text-destructive" />
              Redefinir Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Restaura a aplicação para os dados de demonstração iniciais (Mock Data).
            </p>
            <Button
              variant="destructive"
              className="w-full text-xs gap-2"
              onClick={() => {
                if (confirm('Tem certeza que deseja restaurar os dados iniciais de exemplo?')) {
                  resetData()
                }
              }}
            >
              <RefreshCw className="size-3.5" />
              Restaurar Exemplo Initial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
