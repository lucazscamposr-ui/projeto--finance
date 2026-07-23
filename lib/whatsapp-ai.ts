/**
 * WhatsApp AI — Módulo de interpretação de mensagens via linguagem natural.
 *
 * Recebe uma mensagem de texto como "gastei 50 no mercado" e devolve
 * um objeto estruturado { tipo, valor, nome, categoria, conta }.
 *
 * Funciona com pattern matching local (sem API externa) e, opcionalmente,
 * pode ser conectado a uma API OpenAI para respostas mais inteligentes.
 */

export type ParsedTransaction = {
  tipo: 'receita' | 'despesa'
  nome: string
  valor: number
  categoria: string
  conta: string
  confianca: number // 0–100 — quão confiante a IA está na interpretação
  mensagemOriginal: string
  // Opcional: se a mensagem indica que é para pagar depois (dívida/parcelada)
  registroComoDivida?: boolean
  vencimento?: string // ISO date string or partial date extracted from text
}

export type WhatsAppMessage = {
  id: string
  from: string
  body: string
  timestamp: string
  tipo: 'entrada' | 'saida' | 'sistema'
  parsed?: ParsedTransaction | null
}

// ─── Categorias conhecidas ───────────────────────────────────────────────────

const CATEGORIAS_DESPESA: Record<string, string[]> = {
  Alimentação: ['mercado', 'supermercado', 'mercadinho', 'açougue', 'padaria', 'feira', 'hortifruti', 'restaurante', 'lanche', 'almoço', 'janta', 'jantar', 'ifood', 'delivery', 'pizza', 'hamburguer', 'sushi', 'café', 'cafeteria', 'bar'],
  Transporte: ['uber', 'gasolina', 'combustível', 'ônibus', 'metrô', 'estacionamento', 'pedágio', 'moto', 'táxi', '99', 'oficina', 'borracharia', 'lavagem', 'carro'],
  Moradia: ['aluguel', 'condomínio', 'iptu', 'água', 'luz', 'gás', 'energia', 'conta de luz', 'conta de água'],
  Saúde: ['farmácia', 'remédio', 'médico', 'hospital', 'dentista', 'exame', 'consulta', 'plano de saúde', 'academia'],
  Educação: ['faculdade', 'curso', 'escola', 'livro', 'udemy', 'alura', 'matrícula', 'mensalidade'],
  Lazer: ['cinema', 'show', 'festa', 'viagem', 'netflix', 'spotify', 'games', 'jogo', 'shopping', 'roupa', 'presente'],
  Pessoal: ['cabelo', 'barbearia', 'salão', 'manicure', 'cosméticos', 'perfume'],
  Serviços: ['internet', 'celular', 'telefone', 'plano', 'streaming', 'assinatura'],
  Outros: [],
}

const CATEGORIAS_RECEITA: Record<string, string[]> = {
  Trabalho: ['salário', 'salario', 'pagamento', 'holerite', 'pró-labore', 'prolabore'],
  Extra: ['freelance', 'freela', 'bico', 'venda', 'vendas', 'marketplace', 'pix', 'transferência'],
  Investimentos: ['dividendo', 'rendimento', 'juros', 'rendeu', 'retorno', 'investimento'],
  Outros: ['reembolso', 'devolução', 'prêmio', 'presente'],
}

// ─── Padrões de detecção ─────────────────────────────────────────────────────

const PADROES_DESPESA = [
  /gast[eio][iu]?\s+(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:no?|na|em|com|de|pel[oa])?\s*(.+)/i,
  /pag[uo]ei\s+(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:no?|na|em|com|de|pel[oa])?\s*(.+)/i,
  /comprei\s+(.+?)\s+(?:por\s+)?(?:r\$?\s*)?(\d+[\.,]?\d*)/i,
  /(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:no?|na|em|com|de|pel[oa])\s+(.+)/i,
  /despesa\s+(?:de\s+)?(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:[-–]\s*)?(.+)/i,
  /sa[ií](?:u|ram)\s+(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:no?|na|em|com|de|pel[oa])?\s*(.+)/i,
]

const PADROES_RECEITA = [
  /receb[ei]\s+(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:do?|da|de|pel[oa])?\s*(.+)/i,
  /entr(?:ou|aram?)\s+(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:do?|da|de|pel[oa])?\s*(.+)/i,
  /ganhei\s+(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:do?|da|de|pel[oa])?\s*(.+)/i,
  /receita\s+(?:de\s+)?(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:[-–]\s*)?(.+)/i,
  /(?:pix|transferência)\s+(?:de\s+)?(?:r\$?\s*)?(\d+[\.,]?\d*)\s*(?:reais?\s*)?(?:do?|da|de)?\s*(.+)/i,
]

// ─── Funções auxiliares ──────────────────────────────────────────────────────

function parseValor(str: string): number {
  return parseFloat(str.replace(',', '.'))
}

function detectarCategoria(descricao: string, tipo: 'receita' | 'despesa'): string {
  const lower = descricao.toLowerCase().trim()
  const categorias = tipo === 'despesa' ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA

  for (const [categoria, palavras] of Object.entries(categorias)) {
    for (const palavra of palavras) {
      if (lower.includes(palavra)) {
        return categoria
      }
    }
  }

  return 'Outros'
}

function capitalizarPrimeira(str: string): string {
  const trimmed = str.trim()
  if (!trimmed) return 'Sem descrição'
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

// ─── Parser principal ────────────────────────────────────────────────────────

export function parseMessage(body: string): ParsedTransaction | null {
  const text = body.trim()
  if (!text || text.length < 3) return null

  // Tentar padrões de despesa
  for (const padrao of PADROES_DESPESA) {
    const match = text.match(padrao)
    if (match) {
      // Para o padrão "comprei X por Y", valor e descrição ficam invertidos
      const isComprei = padrao.source.startsWith('comprei')
      const valorStr = isComprei ? match[2] : match[1]
      const descricao = isComprei ? match[1] : match[2]

      const valor = parseValor(valorStr)
      if (isNaN(valor) || valor <= 0) continue

      const nome = capitalizarPrimeira(descricao)
      const categoria = detectarCategoria(descricao, 'despesa')

      // Detectar padrão de vencimento/ex.: "pra pagar dia 20/08/2026" ou "a pagar dia 20/08"
      const vencRegex = /(?:pagar|pra pagar|a pagar|vencer|vencimento|vencimento em)\s*(?:no dia|dia)?\s*(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)/i
      const vencMatch = text.match(vencRegex)
      let vencimento: string | undefined = undefined
      let registroComoDivida = false
      if (vencMatch) {
        // tentar normalizar para ISO (YYYY-MM-DD) quando possível
        const raw = vencMatch[1]
        const parts = raw.split(/[\/\-]/).map((p) => parseInt(p, 10))
        if (parts.length >= 2) {
          let day = parts[0]
          let month = parts[1]
          let year = parts.length === 3 ? parts[2] : new Date().getFullYear()
          if (year < 100) year += 2000
          // criar string ISO simples (não ajustar timezone)
          try {
            const iso = new Date(year, month - 1, day)
            if (!isNaN(iso.getTime())) {
              vencimento = iso.toISOString().split('T')[0]
              registroComoDivida = true
            }
          } catch (e) {
            // ignore
          }
        }
      }

      return {
        tipo: 'despesa',
        nome,
        valor,
        categoria,
        conta: 'Nubank',
        confianca: 85,
        mensagemOriginal: text,
        registroComoDivida,
        vencimento,
      }
    }
  }

  // Tentar padrões de receita
  for (const padrao of PADROES_RECEITA) {
    const match = text.match(padrao)
    if (match) {
      const valorStr = match[1]
      const descricao = match[2]

      const valor = parseValor(valorStr)
      if (isNaN(valor) || valor <= 0) continue

      const nome = capitalizarPrimeira(descricao)
      const categoria = detectarCategoria(descricao, 'receita')

      return {
        tipo: 'receita',
        nome,
        valor,
        categoria,
        conta: 'Nubank',
        confianca: 85,
        mensagemOriginal: text,
      }
    }
  }

  return null
}

// ─── Gerar resposta do bot ────────────────────────────────────────────────────

export function gerarRespostBot(parsed: ParsedTransaction | null, mensagemOriginal: string): string {
  if (!parsed) {
    return `🤔 Não consegui entender essa mensagem. Tente algo como:\n\n💸 "Gastei 50 no mercado"\n💰 "Recebi 3000 do salário"\n🛒 "Paguei 120 na farmácia"\n⛽ "45 reais de gasolina"`
  }

  const emoji = parsed.tipo === 'despesa' ? '💸' : '💰'
  const tipoLabel = parsed.tipo === 'despesa' ? 'Despesa' : 'Receita'
  const valor = parsed.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return `${emoji} **${tipoLabel} registrada!**\n\n📝 **Descrição:** ${parsed.nome}\n💵 **Valor:** ${valor}\n📁 **Categoria:** ${parsed.categoria}\n🏦 **Conta:** ${parsed.conta}\n📊 **Confiança da IA:** ${parsed.confianca}%\n\n✅ Transação salva automaticamente no Finance AI.`
}

// ─── Gerar sugestões do bot ──────────────────────────────────────────────────

export function gerarSugestoes(): string[] {
  return [
    'Gastei 50 no mercado',
    'Paguei 120 na farmácia',
    'Recebi 3000 do salário',
    '45 reais de gasolina',
    'Comprei roupa por 89,90',
    'Entrou 500 do freelance',
  ]
}
