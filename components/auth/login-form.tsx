'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // UI apenas: a autenticação segura (Neon + Better Auth) será conectada depois.
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 700)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-balance">
          {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          {mode === 'login'
            ? 'Acesse seu painel financeiro inteligente.'
            : 'Comece a controlar sua vida financeira hoje.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {mode === 'signup' && (
          <div className="grid gap-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" placeholder="Seu nome" autoComplete="name" required />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            {mode === 'login' && (
              <button type="button" className="text-xs text-primary hover:underline">
                Esqueceu a senha?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="pl-9 pr-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full glow-primary" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === 'login' ? 'Ainda não tem conta?' : 'Já possui conta?'}{' '}
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="font-medium text-primary hover:underline"
        >
          {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
        </button>
      </p>

      <p className="mt-6 text-center text-xs text-muted-foreground/70">
        Protegido com criptografia. Login seguro via Better Auth (em breve).
      </p>
    </div>
  )
}
