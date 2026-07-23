'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  PiggyBank,
  Calculator,
  Flame,
  Snowflake,
  CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFinance } from '@/lib/finance-context'
import { formatCurrency } from '@/lib/format'
import { parseMessage, gerarRespostBot, gerarSugestoes } from '@/lib/whatsapp-ai'

type Message = {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: string
  registrou?: boolean // indica se registrou uma transação
}

export default function AssistentePage() {
  const {
    saldoDisponivel,
    receitasMes,
    despesasMes,
    economiaMes,
    dividas,
    metas,
    investimentos,
    hideValues,
    addReceita,
    addDespesa,
  } = useFinance()

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Initial messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: `Olá! Sou seu assistente financeiro com IA. 🧠\n\nPosso te ajudar de duas formas:\n\n💬 **Perguntas** — Me pergunte sobre seus gastos, dívidas ou investimentos.\n\n💸 **Registrar transações** — Digite algo como:\n• "Gastei 50 no mercado"\n• "Recebi 3000 do salário"\n• "Paguei 120 na farmácia"\n\nSeu saldo atual é ${formatCurrency(saldoDisponivel, { hideValues })} e sua economia mensal é de ${
        receitasMes > 0 ? Math.round((economiaMes / receitasMes) * 100) : 0
      }%. Como posso ajudar?`,
      timestamp: 'Agora',
    },
  ])

  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Calculations for Financial Health Score (0 - 100)
  const poupancaRate = receitasMes > 0 ? (economiaMes / receitasMes) * 100 : 0
  const totalDividasRestante = dividas.reduce((a, d) => a + (d.total - d.pago), 0)
  const debtToIncomeRatio = receitasMes > 0 ? (despesasMes / receitasMes) * 100 : 0
  
  // Health score algorithm
  let healthScore = 70
  if (poupancaRate >= 20) healthScore += 15
  else if (poupancaRate >= 10) healthScore += 5
  if (totalDividasRestante === 0) healthScore += 15
  else if (totalDividasRestante < receitasMes) healthScore += 5
  if (debtToIncomeRatio < 70) healthScore += 10

  healthScore = Math.min(100, Math.max(0, healthScore))

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInputMsg('')
    setIsTyping(true)

    setTimeout(() => {
      // 1. Tentar interpretar como transação
      const parsed = parseMessage(text)

      let aiReply = ''
      let registrou = false

      if (parsed) {
        // Registrar a transação no contexto financeiro
        const hoje = new Date().toISOString().split('T')[0]
        // Se a mensagem indica vencimento/parcelamento, registrar como dívida
        if (parsed.registroComoDivida || parsed.vencimento) {
          // pessoa: usar a descrição para facilitar
          const pessoa = parsed.nome || 'Dívida'
          const venc = parsed.vencimento || hoje
          addDivida({
            pessoa,
            total: parsed.valor,
            vencimento: venc,
            prioridade: 'média',
          })
          aiReply = `💸 **Dívida registrada!**\n\n📝 **Descrição:** ${parsed.nome}\n💵 **Total:** ${parsed.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n📅 **Vencimento:** ${venc}\n\n✅ Adicionei ao seu painel de dívidas.`
          registrou = true
        } else if (parsed.tipo === 'despesa') {
          addDespesa({
            nome: parsed.nome,
            categoria: parsed.categoria,
            valor: parsed.valor,
            data: hoje,
            status: 'pago',
            conta: parsed.conta,
          })
          aiReply = gerarRespostBot(parsed, text)
          registrou = true
        } else {
          addReceita({
            nome: parsed.nome,
            categoria: parsed.categoria,
            valor: parsed.valor,
            data: hoje,
            status: 'pago',
            conta: parsed.conta,
          })
          aiReply = gerarRespostBot(parsed, text)
          registrou = true
        }
      } else {
        // 2. Responder como assistente financeiro
        const lower = text.toLowerCase()

        if (lower.includes('dívida') || lower.includes('divida') || lower.includes('quitar')) {
          aiReply = `📊 Para quitar suas dívidas (restam ${formatCurrency(totalDividasRestante, { hideValues })}), recomendo a estratégia **Avalanche** — pague primeiro as de maior juros.\n\nDestinando R$ 500 adicionais por mês, você quita tudo em cerca de ${Math.ceil(
            totalDividasRestante / 500
          )} meses.`
        } else if (lower.includes('invest') || lower.includes('sobra') || lower.includes('reserva')) {
          aiReply = `📈 Seu saldo atual é de ${formatCurrency(saldoDisponivel, { hideValues })}.\n\nPrimeira prioridade: completar a Reserva de Emergência. Recomendo aportar no **Tesouro Selic** ou **CDB 100%+ do CDI** com liquidez diária.`
        } else if (lower.includes('cortar') || lower.includes('gastos') || lower.includes('economia') || lower.includes('economizar')) {
          aiReply = `✂️ Analisando suas despesas, Moradia e Alimentação representam ~60% das saídas.\n\nSe reduzir 10% no mercado e streaming, economiza cerca de **R$ 150/mês**, turbinando suas metas!`
        } else if (lower.includes('saldo') || lower.includes('quanto tenho') || lower.includes('como estou')) {
          aiReply = `💰 **Resumo atual:**\n\n• Saldo disponível: ${formatCurrency(saldoDisponivel, { hideValues })}\n• Receitas do mês: ${formatCurrency(receitasMes, { hideValues })}\n• Despesas do mês: ${formatCurrency(despesasMes, { hideValues })}\n• Economia: ${formatCurrency(economiaMes, { hideValues })}\n• Score de saúde: ${healthScore}/100`
        } else if (lower.includes('meta') || lower.includes('objetivo')) {
          const metasTexto = metas.map((m) => `• ${m.nome}: ${formatCurrency(m.guardado, { hideValues })} / ${formatCurrency(m.alvo, { hideValues })} (${Math.round((m.guardado / m.alvo) * 100)}%)`).join('\n')
          aiReply = `🎯 **Suas metas:**\n\n${metasTexto}\n\nContinue contribuindo regularmente para atingir seus objetivos!`
        } else if (lower.includes('ajuda') || lower.includes('help') || lower.includes('como usar') || lower.includes('o que você faz')) {
          aiReply = `🤖 **O que posso fazer:**\n\n💸 **Registrar gastos** — Digite:\n• "Gastei 50 no mercado"\n• "Paguei 120 na farmácia"\n• "45 reais de gasolina"\n\n💰 **Registrar receitas** — Digite:\n• "Recebi 3000 do salário"\n• "Entrou 500 do freelance"\n\n💬 **Tirar dúvidas** — Pergunte sobre:\n• Dívidas, investimentos, metas\n• Saldo, economia, como cortar gastos`
        } else {
          aiReply = `Com base nas suas receitas (${formatCurrency(receitasMes, { hideValues })}) e despesas (${formatCurrency(despesasMes, { hideValues })}), sua saúde financeira está com Score **${healthScore}/100**.\n\n💡 Dica: você pode registrar transações aqui! Basta digitar algo como "gastei 30 no almoço" ou "recebi 500 do pix".`
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        registrou,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 800)
  }

  const promptChips = [
    'Gastei 50 no mercado',
    'Recebi 3000 do salário',
    'Como quitar minhas dívidas?',
    'Qual meu saldo atual?',
    'Como economizar este mês?',
    'Ajuda',
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Assistente IA Financial Copilot"
        description="Chat inteligente: tire dúvidas e registre transações por linguagem natural."
      />

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="chat" className="gap-2">
            <Bot className="size-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <ShieldCheck className="size-4" />
            Saúde Financeira
          </TabsTrigger>
          <TabsTrigger value="debt-strategy" className="gap-2">
            <Calculator className="size-4" />
            Estratégia Dívidas
          </TabsTrigger>
        </TabsList>

        {/* CHAT TAB */}
        <TabsContent value="chat" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Chat Box */}
            <Card className="lg:col-span-2 flex flex-col h-[580px]">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Finance AI Chat</CardTitle>
                    <CardDescription className="text-xs">
                      Pergunte ou registre transações digitando em linguagem natural
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                        <Bot className="size-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-xs'
                          : 'bg-muted text-foreground rounded-tl-xs'
                      }`}
                    >
                      {m.registrou && (
                        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                          <CheckCircle2 className="size-3.5" />
                          Transação registrada com sucesso!
                        </div>
                      )}
                      <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                      <span className="mt-1 block text-[10px] opacity-70 text-right">
                        {m.timestamp}
                      </span>
                    </div>
                    {m.role === 'user' && (
                      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                        <User className="size-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                      <Bot className="size-4 animate-pulse" />
                    </div>
                    <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground rounded-tl-xs flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary animate-bounce" />
                      <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </CardContent>

              <div className="p-3 border-t border-border space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {promptChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder="Ex: 'Gastei 80 no mercado' ou 'Qual meu saldo?'"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="glow-primary shrink-0">
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            </Card>

            {/* Quick Metrics Panel */}
            <div className="space-y-4">
              <Card className="border-primary/30 bg-primary/[0.03]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    Score de Saúde
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                      {healthScore >= 80 ? 'Excelente' : healthScore >= 60 ? 'Bom' : 'Atenção'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold tabular-nums text-primary">
                      {healthScore}/100
                    </span>
                    <span className="text-xs text-muted-foreground">Avaliação IA</span>
                  </div>
                  <Progress value={healthScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Sua saúde financeira está acima da média de 82% dos usuários da plataforma.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Dicas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2.5 items-start text-xs rounded-lg border border-border p-2.5">
                    <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Registre pelo chat</p>
                      <p className="text-muted-foreground">
                        Digite &quot;gastei 50 no mercado&quot; e a IA registra automaticamente.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start text-xs rounded-lg border border-border p-2.5">
                    <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Taxa de Poupança OK</p>
                      <p className="text-muted-foreground">
                        Você está poupando {Math.round(poupancaRate)}% das suas receitas.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start text-xs rounded-lg border border-border p-2.5">
                    <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Atenção ao Cartão</p>
                      <p className="text-muted-foreground">
                        Quite primeiramente as pendências do Nubank para evitar juros.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* HEALTH TAB */}
        <TabsContent value="health" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground">Reserva de Emergência</p>
                  <PiggyBank className="size-4 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-bold">61%</p>
                <p className="text-xs text-muted-foreground mt-1">R$ 9.200 / R$ 15.000</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground">Taxa de Poupança</p>
                  <TrendingUp className="size-4 text-success" />
                </div>
                <p className="mt-2 text-2xl font-bold text-success">{Math.round(poupancaRate)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Meta recomendada: {'>'} 20%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground">Comprometimento</p>
                  <AlertTriangle className="size-4 text-warning" />
                </div>
                <p className="mt-2 text-2xl font-bold text-warning">{Math.round(debtToIncomeRatio)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Renda gasta em despesas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground">Índice de Dívidas</p>
                  <ShieldCheck className="size-4 text-destructive" />
                </div>
                <p className="mt-2 text-2xl font-bold text-destructive">
                  {formatCurrency(totalDividasRestante, { hideValues })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Restante a quitar</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DEBT STRATEGY TAB */}
        <TabsContent value="debt-strategy" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comparador de Estratégias de Quitação</CardTitle>
              <CardDescription>
                Simulação para quitar os seus {formatCurrency(totalDividasRestante, { hideValues })} em dívidas ativas
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="size-5 text-primary" />
                  <h3 className="font-semibold text-lg">Método Avalanche (Recomendado)</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prioriza dívidas com a **maior taxa de juros** primeiro. Economiza mais dinheiro no longo prazo.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>1º Foco:</span>
                    <span className="font-semibold">Cartão Nubank (Juros Altos)</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>2º Foco:</span>
                    <span className="font-semibold">Financiamento Notebook</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Economia de Juros Estimada:</span>
                    <span className="font-bold text-success">R$ 640.00</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Snowflake className="size-5 text-accent-foreground" />
                  <h3 className="font-semibold text-lg">Método Bola de Neve</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Prioriza as **menores dívidas em valor** primeiro. Oferece motivação psicológica rápida ao eliminar credores.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>1º Foco:</span>
                    <span className="font-semibold">Gustavo (amigo) - R$ 400</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>2º Foco:</span>
                    <span className="font-semibold">Empréstimo Família - R$ 300</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo de Quitação Total:</span>
                    <span className="font-bold text-foreground">~4 meses</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
