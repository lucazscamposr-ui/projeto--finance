'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import {
  user as initialUser,
  receitas as initialReceitas,
  despesas as initialDespesas,
  dividas as initialDividas,
  contasFixas as initialContasFixas,
  metas as initialMetas,
  cartoes as initialCartoes,
  investimentos as initialInvestimentos,
  insights as initialInsights,
  type Transacao,
  type Divida,
  type ContaFixa,
  type Meta,
  type Cartao,
  type Investimento,
  type Insight,
} from '@/lib/mock-data'

export type UserProfile = {
  name: string
  email: string
  initials: string
  avatarUrl?: string
  whatsappNumber?: string
  whatsappConnected?: boolean
}

type FinanceContextType = {
  user: UserProfile
  receitas: Transacao[]
  despesas: Transacao[]
  dividas: Divida[]
  contasFixas: ContaFixa[]
  metas: Meta[]
  cartoes: Cartao[]
  investimentos: Investimento[]
  insights: Insight[]
  hideValues: boolean
  
  // Computed summary
  saldoDisponivel: number
  patrimonio: number
  receitasMes: number
  despesasMes: number
  economiaMes: number
  variacaoSaldo: number
  variacaoDespesas: number

  // Actions
  updateUser: (data: Partial<UserProfile>) => void
  toggleHideValues: () => void
  addReceita: (data: Omit<Transacao, 'id' | 'tipo'>) => void
  addDespesa: (data: Omit<Transacao, 'id' | 'tipo'>) => void
  toggleTransacaoStatus: (id: string, tipo: 'receita' | 'despesa') => void
  deleteTransacao: (id: string, tipo: 'receita' | 'despesa') => void
  addDivida: (data: Omit<Divida, 'id' | 'pago'>) => void
  payDivida: (id: string, valor: number) => void
  deleteDivida: (id: string) => void
  addContaFixa: (data: Omit<ContaFixa, 'id'>) => void
  toggleContaFixaAtiva: (id: string) => void
  deleteContaFixa: (id: string) => void
  addMeta: (data: Omit<Meta, 'id' | 'guardado'>) => void
  contributeMeta: (id: string, valor: number) => void
  deleteMeta: (id: string) => void
  addCartao: (data: Omit<Cartao, 'id'>) => void
  deleteCartao: (id: string) => void
  addInvestimento: (data: Omit<Investimento, 'id'>) => void
  deleteInvestimento: (id: string) => void
  exportData: () => void
  importData: (jsonStr: string) => boolean
  resetData: () => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const STORAGE_KEY = 'finance_ai_data_v2'

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hideValues, setHideValues] = useState(false)
  const [user, setUser] = useState<UserProfile>({
    ...initialUser,
    avatarUrl: '',
    whatsappNumber: '+55 11 98765-4321',
    whatsappConnected: true,
  })
  const [receitas, setReceitas] = useState<Transacao[]>(initialReceitas)
  const [despesas, setDespesas] = useState<Transacao[]>(initialDespesas)
  const [dividas, setDividas] = useState<Divida[]>(initialDividas)
  const [contasFixas, setContasFixas] = useState<ContaFixa[]>(initialContasFixas)
  const [metas, setMetas] = useState<Meta[]>(initialMetas)
  const [cartoes, setCartoes] = useState<Cartao[]>(initialCartoes)
  const [investimentos, setInvestimentos] = useState<Investimento[]>(initialInvestimentos)
  const [insights, setInsights] = useState<Insight[]>(initialInsights)

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.user) setUser(parsed.user)
        if (parsed.receitas) setReceitas(parsed.receitas)
        if (parsed.despesas) setDespesas(parsed.despesas)
        if (parsed.dividas) setDividas(parsed.dividas)
        if (parsed.contasFixas) setContasFixas(parsed.contasFixas)
        if (parsed.metas) setMetas(parsed.metas)
        if (parsed.cartoes) setCartoes(parsed.cartoes)
        if (parsed.investimentos) setInvestimentos(parsed.investimentos)
        if (parsed.insights) setInsights(parsed.insights)
        if (parsed.hideValues !== undefined) setHideValues(parsed.hideValues)
      }
    } catch (e) {
      console.error('Erro ao carregar dados do localStorage:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to local storage on changes
  useEffect(() => {
    if (!isLoaded) return
    try {
      const dataToSave = {
        user,
        receitas,
        despesas,
        dividas,
        contasFixas,
        metas,
        cartoes,
        investimentos,
        insights,
        hideValues,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (e) {
      console.error('Erro ao salvar dados no localStorage:', e)
    }
  }, [isLoaded, user, receitas, despesas, dividas, contasFixas, metas, cartoes, investimentos, insights, hideValues])

  // Actions
  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...data }
      if (data.name) {
        const parts = data.name.trim().split(' ')
        updated.initials =
          parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase()
      }
      return updated
    })
  }

  // Dynamic calculations
  const receitasMes = useMemo(() => {
    return receitas.reduce((acc, r) => acc + r.valor, 0)
  }, [receitas])

  const despesasMes = useMemo(() => {
    return despesas.reduce((acc, d) => acc + d.valor, 0)
  }, [despesas])

  const receitasPagas = useMemo(() => {
    return receitas.filter((r) => r.status === 'pago').reduce((acc, r) => acc + r.valor, 0)
  }, [receitas])

  const despesasPagas = useMemo(() => {
    return despesas.filter((d) => d.status === 'pago').reduce((acc, d) => acc + d.valor, 0)
  }, [despesas])

  const saldoDisponivel = useMemo(() => {
    return Math.max(0, 4820.55 + (receitasPagas - despesasPagas))
  }, [receitasPagas, despesasPagas])

  const totalInvestimentos = useMemo(() => {
    return investimentos.reduce((acc, i) => acc + i.valor, 0)
  }, [investimentos])

  const totalGuardadoMetas = useMemo(() => {
    return metas.reduce((acc, m) => acc + m.guardado, 0)
  }, [metas])

  const patrimonio = useMemo(() => {
    return saldoDisponivel + totalInvestimentos + totalGuardadoMetas
  }, [saldoDisponivel, totalInvestimentos, totalGuardadoMetas])

  const economiaMes = useMemo(() => {
    return Math.max(0, receitasMes - despesasMes)
  }, [receitasMes, despesasMes])

  const variacaoSaldo = 12.4
  const variacaoDespesas = -4.2

  const toggleHideValues = () => setHideValues((prev) => !prev)

  const addReceita = (data: Omit<Transacao, 'id' | 'tipo'>) => {
    const newItem: Transacao = {
      ...data,
      id: 'r_' + Date.now(),
      tipo: 'receita',
    }
    setReceitas((prev) => [newItem, ...prev])
  }

  const addDespesa = (data: Omit<Transacao, 'id' | 'tipo'>) => {
    const newItem: Transacao = {
      ...data,
      id: 'd_' + Date.now(),
      tipo: 'despesa',
    }
    setDespesas((prev) => [newItem, ...prev])
  }

  const toggleTransacaoStatus = (id: string, tipo: 'receita' | 'despesa') => {
    if (tipo === 'receita') {
      setReceitas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: r.status === 'pago' ? 'pendente' : 'pago' } : r))
      )
    } else {
      setDespesas((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: d.status === 'pago' ? 'pendente' : 'pago' } : d))
      )
    }
  }

  const deleteTransacao = (id: string, tipo: 'receita' | 'despesa') => {
    if (tipo === 'receita') {
      setReceitas((prev) => prev.filter((r) => r.id !== id))
    } else {
      setDespesas((prev) => prev.filter((d) => d.id !== id))
    }
  }

  const addDivida = (data: Omit<Divida, 'id' | 'pago'>) => {
    const newItem: Divida = {
      ...data,
      id: 'v_' + Date.now(),
      pago: 0,
    }
    setDividas((prev) => [newItem, ...prev])
  }

  const payDivida = (id: string, valor: number) => {
    setDividas((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const novoPago = Math.min(d.total, d.pago + valor)
          return { ...d, pago: novoPago }
        }
        return d
      })
    )
  }

  const deleteDivida = (id: string) => {
    setDividas((prev) => prev.filter((d) => d.id !== id))
  }

  const addContaFixa = (data: Omit<ContaFixa, 'id'>) => {
    const newItem: ContaFixa = {
      ...data,
      id: 'c_' + Date.now(),
    }
    setContasFixas((prev) => [newItem, ...prev])
  }

  const toggleContaFixaAtiva = (id: string) => {
    setContasFixas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ativo: !c.ativo } : c))
    )
  }

  const deleteContaFixa = (id: string) => {
    setContasFixas((prev) => prev.filter((c) => c.id !== id))
  }

  const addMeta = (data: Omit<Meta, 'id' | 'guardado'>) => {
    const newItem: Meta = {
      ...data,
      id: 'm_' + Date.now(),
      guardado: 0,
    }
    setMetas((prev) => [newItem, ...prev])
  }

  const contributeMeta = (id: string, valor: number) => {
    setMetas((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const novoGuardado = Math.min(m.alvo, m.guardado + valor)
          return { ...m, guardado: novoGuardado }
        }
        return m
      })
    )
  }

  const deleteMeta = (id: string) => {
    setMetas((prev) => prev.filter((m) => m.id !== id))
  }

  const addCartao = (data: Omit<Cartao, 'id'>) => {
    const newItem: Cartao = {
      ...data,
      id: 'ct_' + Date.now(),
    }
    setCartoes((prev) => [...prev, newItem])
  }

  const deleteCartao = (id: string) => {
    setCartoes((prev) => prev.filter((ct) => ct.id !== id))
  }

  const addInvestimento = (data: Omit<Investimento, 'id'>) => {
    const newItem: Investimento = {
      ...data,
      id: 'i_' + Date.now(),
    }
    setInvestimentos((prev) => [...prev, newItem])
  }

  const deleteInvestimento = (id: string) => {
    setInvestimentos((prev) => prev.filter((i) => i.id !== id))
  }

  const exportData = () => {
    const exportObject = {
      user,
      receitas,
      despesas,
      dividas,
      contasFixas,
      metas,
      cartoes,
      investimentos,
      exportDate: new Date().toISOString(),
      version: '2.0',
    }
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance_ai_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr)
      if (parsed.user) setUser(parsed.user)
      if (parsed.receitas) setReceitas(parsed.receitas)
      if (parsed.despesas) setDespesas(parsed.despesas)
      if (parsed.dividas) setDividas(parsed.dividas)
      if (parsed.contasFixas) setContasFixas(parsed.contasFixas)
      if (parsed.metas) setMetas(parsed.metas)
      if (parsed.cartoes) setCartoes(parsed.cartoes)
      if (parsed.investimentos) setInvestimentos(parsed.investimentos)
      return true
    } catch (e) {
      console.error('Erro ao importar dados:', e)
      return false
    }
  }

  const resetData = () => {
    setUser({ ...initialUser, avatarUrl: '', whatsappNumber: '+55 11 98765-4321', whatsappConnected: true })
    setReceitas(initialReceitas)
    setDespesas(initialDespesas)
    setDividas(initialDividas)
    setContasFixas(initialContasFixas)
    setMetas(initialMetas)
    setCartoes(initialCartoes)
    setInvestimentos(initialInvestimentos)
    setInsights(initialInsights)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <FinanceContext.Provider
      value={{
        user,
        receitas,
        despesas,
        dividas,
        contasFixas,
        metas,
        cartoes,
        investimentos,
        insights,
        hideValues,
        saldoDisponivel,
        patrimonio,
        receitasMes,
        despesasMes,
        economiaMes,
        variacaoSaldo,
        variacaoDespesas,
        updateUser,
        toggleHideValues,
        addReceita,
        addDespesa,
        toggleTransacaoStatus,
        deleteTransacao,
        addDivida,
        payDivida,
        deleteDivida,
        addContaFixa,
        toggleContaFixaAtiva,
        deleteContaFixa,
        addMeta,
        contributeMeta,
        deleteMeta,
        addCartao,
        deleteCartao,
        addInvestimento,
        deleteInvestimento,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider')
  }
  return context
}
