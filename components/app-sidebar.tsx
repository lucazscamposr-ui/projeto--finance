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

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useFinance()

  return (
    <Sidebar className="border-sidebar-border">
      <SidebarHeader className="p-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <BrandLogo />
          <div className="grid group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold leading-tight">Finance AI</span>
            <span className="text-xs text-muted-foreground leading-tight">Assistente financeiro</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title} className="min-h-[44px] py-2 md:min-h-9 md:py-1.5">
                        <Link href={item.href}>
                          <item.icon className="size-5 md:size-4" />
                          <span className="text-sm md:text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sair" className="min-h-[44px] md:min-h-9">
              <Link href="/login">
                <LogOut className="size-5 md:size-4" />
                <span>Sair {user?.name ? `(${user.name.split(' ')[0]})` : ''}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
