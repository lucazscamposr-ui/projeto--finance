import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  HandCoins,
  Receipt,
  Waypoints,
  CalendarDays,
  CreditCard,
  Target,
  LineChart,
  FileBarChart,
  Sparkles,
  User,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Visão geral',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Assistente IA', href: '/assistente', icon: Sparkles },
    ],
  },
  {
    label: 'Movimentações',
    items: [
      { title: 'Receitas', href: '/receitas', icon: TrendingUp },
      { title: 'Despesas', href: '/despesas', icon: TrendingDown },
      { title: 'Dívidas', href: '/dividas', icon: HandCoins },
      { title: 'Contas fixas', href: '/contas-fixas', icon: Receipt },
    ],
  },
  {
    label: 'Planejamento',
    items: [
      { title: 'Fluxo de caixa', href: '/fluxo-caixa', icon: Waypoints },
      { title: 'Calendário', href: '/calendario', icon: CalendarDays },
      { title: 'Cartões', href: '/cartoes', icon: CreditCard },
      { title: 'Metas', href: '/metas', icon: Target },
      { title: 'Investimentos', href: '/investimentos', icon: LineChart },
      { title: 'Relatórios', href: '/relatorios', icon: FileBarChart },
    ],
  },
  {
    label: 'Configurações',
    items: [
      { title: 'Meu Perfil', href: '/perfil', icon: User },
    ],
  },
]

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items)
