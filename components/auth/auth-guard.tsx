'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { BrandLogo } from '@/components/brand-logo'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (loading || !mounted) return

    const isLoginPage = pathname === '/login'

    if (!currentUser && !isLoginPage) {
      router.replace('/login')
    } else if (currentUser && isLoginPage) {
      router.replace('/dashboard')
    }
  }, [currentUser, loading, pathname, router, mounted])

  // Don't render anything until client-side hydration is complete
  if (!mounted) return null

  // Splash screen state while checking session
  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
        {/* Modern glowing radial gradient inspired by premium apps */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--primary) 25%, transparent), transparent 50%)',
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center gap-4 text-center">
          {/* Logo with smooth pulse animation */}
          <div className="relative animate-pulse flex items-center justify-center p-4 rounded-full bg-primary/5 border border-primary/10">
            <BrandLogo className="size-16" />
          </div>
          
          <div className="mt-4 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Finance AI</h1>
            <p className="text-sm text-muted-foreground">Iniciando ambiente seguro...</p>
          </div>

          {/* Loader spinner */}
          <div className="mt-8 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  const isLoginPage = pathname === '/login'

  // Route guarding display
  if (!currentUser && !isLoginPage) {
    // Return a blank loading screen to avoid flashes of protected content while redirecting
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (currentUser && isLoginPage) {
    // Return blank loading screen while redirecting to dashboard
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  // Render content normally if routes match auth state
  return <>{children}</>
}
