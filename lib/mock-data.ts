/**
 * Dados de exemplo (mock) usados enquanto a UI é construída.
 * Depois serão substituídos por dados reais vindos do banco (Neon).
 */

export const user = {
  name: 'Gustavo Silva',
  email: 'gustavo@financeai.app',
  initials: 'GS',
}

export const summary = {
  saldoDisponivel: 4820.55,
  patrimonio: 28650.0,
  receitasMes: 6200.0,
  despesasMes: 3980.4,
  economiaMes: 1120.0,
  variacaoSaldo: 12.4,
  variacaoDespesas: -4.2,
}

export const proximos = {
  recebimento: { nome: 'Salário', valor: 3100, data: '2026-08-05' },
  pagamento: { nome: 'Aluguel', valor: 1450, data: '2026-07-25' },
}

export type Transacao = {
  id: string
  nome: string
  categoria: string
  valor: number
  data: string
  tipo: 'receita' | 'despesa'
  status: 'pago' | 'pendente'
  conta: string
}

export const receitas: Transacao[] = [
  { id: 'r1', nome: 'Salário', categoria: 'Trabalho', valor: 3100, data: '2026-07-05', tipo: 'receita', status: 'pago', conta: 'Nubank' },
  { id: 'r2', nome: 'Freelance UI', categoria: 'Extra', valor: 1800, data: '2026-07-12', tipo: 'receita', status: 'pago', conta: 'Inter' },
  { id: 'r3', nome: 'Dividendos', categoria: 'Investimentos', valor: 320, data: '2026-07-15', tipo: 'receita', status: 'pago', conta: 'XP' },
  { id: 'r4', nome: 'Venda Marketplace', categoria: 'Extra', valor: 480, data: '2026-07-20', tipo: 'receita', status: 'pendente', conta: 'Nubank' },
  { id: 'r5', nome: 'Reembolso', categoria: 'Outros', valor: 500, data: '2026-07-28', tipo: 'receita', status: 'pendente', conta: 'Inter' },
]

export const despesas: Transacao[] = [
  { id: 'd1', nome: 'Aluguel', categoria: 'Moradia', valor: 1450, data: '2026-07-05', tipo: 'despesa', status: 'pago', conta: 'Nubank' },
  { id: 'd2', nome: 'Mercado', categoria: 'Alimentação', valor: 820.4, data: '2026-07-08', tipo: 'despesa', status: 'pago', conta: 'Nubank' },
  { id: 'd3', nome: 'Combustível', categoria: 'Transporte', valor: 360, data: '2026-07-10', tipo: 'despesa', status: 'pago', conta: 'Inter' },
  { id: 'd4', nome: 'Restaurante', categoria: 'Lazer', valor: 240, data: '2026-07-14', tipo: 'despesa', status: 'pago', conta: 'Nubank' },
  { id: 'd5', nome: 'Farmácia', categoria: 'Saúde', valor: 180, data: '2026-07-18', tipo: 'despesa', status: 'pendente', conta: 'Inter' },
  { id: 'd6', nome: 'Cabelo', categoria: 'Pessoal', valor: 120, data: '2026-07-22', tipo: 'despesa', status: 'pendente', conta: 'Nubank' },
]

export type Divida = {
  id: string
  pessoa: string
  total: number
  pago: number
  vencimento: string
  prioridade: 'alta' | 'média' | 'baixa'
}

export const dividas: Divida[] = [
  { id: 'v1', pessoa: 'Cartão de Crédito Nubank', total: 2400, pago: 900, vencimento: '2026-08-10', prioridade: 'alta' },
  { id: 'v2', pessoa: 'Gustavo (amigo)', total: 600, pago: 200, vencimento: '2026-07-30', prioridade: 'média' },
  { id: 'v3', pessoa: 'Financiamento Notebook', total: 3200, pago: 2100, vencimento: '2026-09-15', prioridade: 'média' },
  { id: 'v4', pessoa: 'Empréstimo Família', total: 1500, pago: 1200, vencimento: '2026-08-01', prioridade: 'baixa' },
]

export type ContaFixa = {
  id: string
  nome: string
  valor: number
  diaVencimento: number
  categoria: string
  ativo: boolean
}

export const contasFixas: ContaFixa[] = [
  { id: 'c1', nome: 'Internet', valor: 99.9, diaVencimento: 8, categoria: 'Serviços', ativo: true },
  { id: 'c2', nome: 'Netflix', valor: 55.9, diaVencimento: 12, categoria: 'Streaming', ativo: true },
  { id: 'c3', nome: 'Spotify', valor: 21.9, diaVencimento: 12, categoria: 'Streaming', ativo: true },
  { id: 'c4', nome: 'Academia', valor: 129.9, diaVencimento: 5, categoria: 'Saúde', ativo: true },
  { id: 'c5', nome: 'Energia', valor: 210.0, diaVencimento: 15, categoria: 'Utilidades', ativo: true },
  { id: 'c6', nome: 'Faculdade', valor: 680.0, diaVencimento: 10, categoria: 'Educação', ativo: true },
]

export type Meta = {
  id: string
  nome: string
  alvo: number
  guardado: number
  prazo: string
}

export const metas: Meta[] = [
  { id: 'm1', nome: 'Reserva de emergência', alvo: 15000, guardado: 9200, prazo: '2026-12-31' },
  { id: 'm2', nome: 'Notebook novo', alvo: 6000, guardado: 2400, prazo: '2026-10-01' },
  { id: 'm3', nome: 'Viagem Chile', alvo: 8000, guardado: 3100, prazo: '2027-02-15' },
]

export type Investimento = {
  id: string
  tipo: string
  instituicao: string
  valor: number
  rentabilidade: number
}

export const investimentos: Investimento[] = [
  { id: 'i1', tipo: 'Tesouro Selic', instituicao: 'Tesouro Direto', valor: 8200, rentabilidade: 11.2 },
  { id: 'i2', tipo: 'CDB', instituicao: 'Inter', valor: 5400, rentabilidade: 12.5 },
  { id: 'i3', tipo: 'Ações', instituicao: 'XP', valor: 4300, rentabilidade: 8.7 },
  { id: 'i4', tipo: 'FIIs', instituicao: 'XP', valor: 3100, rentabilidade: 9.4 },
]

export type Cartao = {
  id: string
  nome: string
  tipo: 'Crédito' | 'Flash' | 'Bilhete'
  saldo: number
  limite: number
  cor: string
}

export const cartoes: Cartao[] = [
  { id: 'ct1', nome: 'Nubank', tipo: 'Crédito', saldo: 1240, limite: 5000, cor: 'chart-1' },
  { id: 'ct2', nome: 'Flash Benefícios', tipo: 'Flash', saldo: 680, limite: 900, cor: 'chart-3' },
  { id: 'ct3', nome: 'Bilhete Único', tipo: 'Bilhete', saldo: 42.5, limite: 200, cor: 'chart-2' },
]

/** Série mensal de entradas x saídas (últimos 6 meses). */
export const serieMensal = [
  { mes: 'Fev', receitas: 5400, despesas: 4100 },
  { mes: 'Mar', receitas: 5800, despesas: 4600 },
  { mes: 'Abr', receitas: 6100, despesas: 3900 },
  { mes: 'Mai', receitas: 5900, despesas: 4300 },
  { mes: 'Jun', receitas: 6400, despesas: 4050 },
  { mes: 'Jul', receitas: 6200, despesas: 3980 },
]

/** Distribuição de despesas por categoria. */
export const despesasPorCategoria = [
  { categoria: 'Moradia', valor: 1450 },
  { categoria: 'Alimentação', valor: 820 },
  { categoria: 'Transporte', valor: 360 },
  { categoria: 'Lazer', valor: 240 },
  { categoria: 'Saúde', valor: 180 },
  { categoria: 'Pessoal', valor: 120 },
]

/** Simulação de fluxo de caixa dos próximos dias. */
export type FluxoPasso = {
  data: string
  descricao: string
  delta: number
  saldo: number
  tipo: 'entrada' | 'saida' | 'inicio'
}

export const fluxoCaixa: FluxoPasso[] = [
  { data: 'Hoje', descricao: 'Saldo atual', delta: 0, saldo: 4820.55, tipo: 'inicio' },
  { data: '25 Jul', descricao: 'Aluguel', delta: -1450, saldo: 3370.55, tipo: 'saida' },
  { data: '28 Jul', descricao: 'Reembolso', delta: 500, saldo: 3870.55, tipo: 'entrada' },
  { data: '30 Jul', descricao: 'Gustavo (dívida)', delta: -400, saldo: 3470.55, tipo: 'saida' },
  { data: '05 Ago', descricao: 'Salário', delta: 3100, saldo: 6570.55, tipo: 'entrada' },
  { data: '08 Ago', descricao: 'Internet', delta: -99.9, saldo: 6470.65, tipo: 'saida' },
  { data: '10 Ago', descricao: 'Faculdade', delta: -680, saldo: 5790.65, tipo: 'saida' },
  { data: '12 Ago', descricao: 'Netflix + Spotify', delta: -77.8, saldo: 5712.85, tipo: 'saida' },
]

/** Recomendações do assistente de IA. */
export type Insight = {
  id: string
  tipo: 'positivo' | 'alerta' | 'dica'
  titulo: string
  descricao: string
}

export const insights: Insight[] = [
  {
    id: 'in1',
    tipo: 'positivo',
    titulo: 'Você pode economizar R$ 320 este mês',
    descricao: 'Seus gastos com lazer e delivery caíram 18% comparado à média. Mantendo o ritmo, sobra mais no fim do mês.',
  },
  {
    id: 'in2',
    tipo: 'alerta',
    titulo: 'Saldo pode ficar apertado no dia 30',
    descricao: 'A dívida com o Gustavo (R$ 400) cai antes do salário. Considere adiar 3 dias ou usar a reserva.',
  },
  {
    id: 'in3',
    tipo: 'dica',
    titulo: 'Quite o cartão Nubank primeiro',
    descricao: 'É a dívida de maior prioridade e juros. Pagando R$ 750/mês você quita em 2 meses.',
  },
  {
    id: 'in4',
    tipo: 'positivo',
    titulo: 'Você pode investir R$ 500',
    descricao: 'Após todas as contas e a reserva do mês, há folga para aportar no Tesouro Selic.',
  },
]

/** Eventos financeiros para o calendário. */
export type EventoCalendario = {
  dia: number
  titulo: string
  valor: number
  tipo: 'entrada' | 'saida'
}

export const eventosCalendario: EventoCalendario[] = [
  { dia: 5, titulo: 'Salário', valor: 3100, tipo: 'entrada' },
  { dia: 5, titulo: 'Academia', valor: 129.9, tipo: 'saida' },
  { dia: 8, titulo: 'Internet', valor: 99.9, tipo: 'saida' },
  { dia: 10, titulo: 'Faculdade', valor: 680, tipo: 'saida' },
  { dia: 12, titulo: 'Streaming', valor: 77.8, tipo: 'saida' },
  { dia: 15, titulo: 'Energia', valor: 210, tipo: 'saida' },
  { dia: 15, titulo: 'Dividendos', valor: 320, tipo: 'entrada' },
  { dia: 20, titulo: 'Venda', valor: 480, tipo: 'entrada' },
  { dia: 25, titulo: 'Aluguel', valor: 1450, tipo: 'saida' },
]
