'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { BrandLogo } from '@/components/brand-logo'
import { navGroups } from '@/lib/nav'
import { useFinance } from '@/lib/finance-context'
import { useSidebar } from '@/components/ui/sidebar'

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useFinance()

  // Redesigned sidebar: grouped sections, collapse toggle, badges
  const { toggleSidebar, state } = useSidebar()

  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar className="border-sidebar-border bg-sidebar/70">
      <SidebarHeader className="p-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <BrandLogo />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-semibold">Finance AI</span>
            <span className="text-xs text-muted-foreground">Assistente financeiro</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary navigation */}
        <div className="px-2 py-1">
          <nav aria-label="Main navigation" className="space-y-1">
            {navGroups.flatMap((group) => group.items).map((item) => {
              const active = pathname === item.href
              const count =
                item.href.includes('despesas') ? (despesas?.length || 0) : item.href.includes('receitas') ? (receitas?.length || 0) : 0

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className="flex items-center gap-3 p-2"
                  >
                    <Link href={item.href} className="flex items-center gap-3 w-full">
                      <item.icon className="size-5 text-primary" />
                      <span className={`text-sm transition-all ${isCollapsed ? 'opacity-0 w-0 hidden' : ''}`}>{item.title}</span>
                      {count > 0 && (
                        <span className={`ml-auto text-xs font-medium text-primary ${isCollapsed ? 'hidden' : ''}`}>{count}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </nav>
        </div>

        {/* Quick actions / grouped links */}
        <div className="mt-3 border-t border-border/50 px-2 pt-3">
          <SidebarGroupLabel className="text-xs">Movimentações</SidebarGroupLabel>
          <SidebarMenu className="mt-1">
            {navGroups
              .filter((g) => g.label.toLowerCase().includes('movimenta'))
              .flatMap((g) => g.items)
              .slice(0, 6)
              .map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.title} className="flex items-center gap-3 p-2">
                    <Link href={item.href} className="flex items-center gap-3 w-full">
                      <item.icon className="size-5" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center text-primary text-sm font-medium">{user?.initials || 'U'}</div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user?.name || 'Usuário'}</div>
              <div className="text-xs text-muted-foreground">{user?.email || ''}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSidebar()}
              aria-label="Toggle sidebar"
              className="rounded-md p-1 hover:bg-sidebar-accent"
            >
              {isCollapsed ? '→' : '←'}
            </button>
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground">Sair</Link>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
