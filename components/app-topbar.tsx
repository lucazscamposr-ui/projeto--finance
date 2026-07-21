'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { allNavItems } from '@/lib/nav'
import { user } from '@/lib/mock-data'

export function AppTopbar() {
  const pathname = usePathname()
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
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </Button>
        <ThemeToggle />
        <Avatar className="size-8 border border-border">
          <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
