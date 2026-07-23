"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { allNavItems } from '@/lib/nav'
import { useFinance } from '@/lib/finance-context'

export function AppTopbar() {
  const pathname = usePathname()
  const { user, despesas, receitas } = useFinance()
  const current = allNavItems.find((i) => i.href === pathname)
  const title = current?.title ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md md:px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            className="h-9 w-44 bg-secondary/60 pl-9 md:w-64"
            aria-label="Pesquisar"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
              <Bell className="size-4" />
              {(despesas.length === 0 || receitas.length === 0) && (
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {despesas.length === 0 && receitas.length === 0 ? (
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <span className="font-medium text-sm">Bem-vindo(a)! 🎉</span>
                <span className="text-xs text-muted-foreground">Que tal registrar sua primeira transação?</span>
              </DropdownMenuItem>
            ) : (
              <>
                {receitas.length === 0 && (
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <span className="font-medium text-sm">Adicione uma receita</span>
                    <span className="text-xs text-muted-foreground">Você ainda não registrou nenhuma entrada.</span>
                  </DropdownMenuItem>
                )}
                {despesas.length === 0 && (
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <span className="font-medium text-sm">Controle de gastos</span>
                    <span className="text-xs text-muted-foreground">Lembre-se de registrar suas despesas.</span>
                  </DropdownMenuItem>
                )}
                {despesas.length > 0 && receitas.length > 0 && (
                  <DropdownMenuItem className="p-3 text-sm text-muted-foreground">
                    Você não tem novas notificações no momento.
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        <Link href="/perfil" aria-label="Perfil">
          <Avatar className="size-8 border border-border">
            <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
              {user.initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
