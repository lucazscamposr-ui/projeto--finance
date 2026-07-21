'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock, Mail, User, Check, X, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'

export function LoginForm() {
  const router = useRouter()
  const { login, signup, sendPasswordRecovery, resetPassword } = useAuth()
  
  // UI states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup' | 'recovery' | 'reset'>('login')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [keepConnected, setKeepConnected] = useState(true)

  // Reset form when changing mode
  useEffect(() => {
    setErrorMsg('')
    setSuccessMsg('')
    setPassword('')
    setConfirmPassword('')
  }, [mode])

  // Real-time validations for Signup
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isPasswordMatch = password === confirmPassword && password !== ''

  const isSignupValid =
    name.trim() !== '' &&
    isEmailValid &&
    isMinLength &&
    hasUpperCase &&
    hasNumber &&
    isPasswordMatch

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const res = await login(email, password, keepConnected)
        if (res.success) {
          router.push('/dashboard')
        } else {
          setErrorMsg(res.message)
          setLoading(false)
        }
      } else if (mode === 'signup') {
        if (!isSignupValid) {
          setErrorMsg('Por favor, atenda a todos os requisitos de validação.')
          setLoading(false)
          return
        }
        const res = await signup(name, email, password)
        if (res.success) {
          router.push('/dashboard')
        } else {
          setErrorMsg(res.message)
          setLoading(false)
        }
      } else if (mode === 'recovery') {
        if (!isEmailValid) {
          setErrorMsg('Informe um e-mail válido.')
          setLoading(false)
          return
        }
        const res = await sendPasswordRecovery(email)
        if (res.success) {
          setSuccessMsg(res.message)
          setMode('reset') // Mudar para redefinir
        } else {
          setErrorMsg(res.message)
        }
        setLoading(false)
      } else if (mode === 'reset') {
        if (!isMinLength || !hasUpperCase || !hasNumber) {
          setErrorMsg('A nova senha deve atender aos requisitos.')
          setLoading(false)
          return
        }
        if (!isPasswordMatch) {
          setErrorMsg('As senhas não coincidem.')
          setLoading(false)
          return
        }
        const res = await resetPassword(email, password)
        if (res.success) {
          setSuccessMsg('Senha alterada! Faça o login com suas novas credenciais.')
          setMode('login')
        } else {
          setErrorMsg(res.message)
        }
        setLoading(false)
      }
    } catch (err) {
      setErrorMsg('Ocorreu um erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {mode === 'login' && 'Acesse sua conta'}
          {mode === 'signup' && 'Comece sua jornada'}
          {mode === 'recovery' && 'Recuperar acesso'}
          {mode === 'reset' && 'Redefinir senha'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === 'login' && 'O controle da sua vida financeira inteligente.'}
          {mode === 'signup' && 'Crie sua conta em poucos segundos.'}
          {mode === 'recovery' && 'Informe seu e-mail para recuperar sua senha.'}
          {mode === 'reset' && `Defina uma nova senha para ${email}`}
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive animate-shake">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && mode !== 'reset' && (
        <div className="flex items-center gap-2.5 rounded-lg border border-success/20 bg-success/10 p-3.5 text-xs text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome Completo (Apenas Cadastro) */}
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                autoComplete="name"
                className="pl-9 bg-secondary/35 border-border/80 focus:border-primary/80 transition-colors"
                required
              />
            </div>
          </div>
        )}

        {/* Campo E-mail (Oculto na redefinição) */}
        {mode !== 'reset' && (
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                autoComplete="email"
                className="pl-9 bg-secondary/35 border-border/80 focus:border-primary/80 transition-colors"
                required
              />
            </div>
            {mode === 'signup' && email !== '' && !isEmailValid && (
              <span className="text-[11px] text-destructive flex items-center gap-1">
                <X className="size-3" /> Formato de e-mail inválido.
              </span>
            )}
          </div>
        )}

        {/* Campos de Senha (Login, Cadastro, Redefinição) */}
        {mode !== 'recovery' && (
          <>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {mode === 'reset' ? 'Nova senha' : 'Senha'}
                </Label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('recovery')}
                    className="text-xs text-primary font-medium hover:underline focus:outline-none"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="pl-9 pr-9 bg-secondary/35 border-border/80 focus:border-primary/80 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Senha (Cadastro e Redefinição) */}
            {(mode === 'signup' || mode === 'reset') && (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pl-9 pr-9 bg-secondary/35 border-border/80 focus:border-primary/80 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Requisitos da Senha (Cadastro e Redefinição) */}
            {(mode === 'signup' || mode === 'reset') && password !== '' && (
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3 space-y-1.5 text-[11px] text-muted-foreground">
                <p className="font-semibold text-xs text-foreground mb-1">Requisitos da senha:</p>
                <div className="flex items-center gap-1.5">
                  {isMinLength ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <X className="size-3.5 text-destructive" />
                  )}
                  <span className={isMinLength ? 'text-success' : ''}>Mínimo de 8 caracteres</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUpperCase ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <X className="size-3.5 text-destructive" />
                  )}
                  <span className={hasUpperCase ? 'text-success' : ''}>Pelo menos uma letra maiúscula</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasNumber ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <X className="size-3.5 text-destructive" />
                  )}
                  <span className={hasNumber ? 'text-success' : ''}>Pelo menos um número</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isPasswordMatch ? (
                    <Check className="size-3.5 text-success" />
                  ) : (
                    <X className="size-3.5 text-destructive" />
                  )}
                  <span className={isPasswordMatch ? 'text-success' : ''}>Senhas coincidem</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Permanecer conectado (Apenas Login) */}
        {mode === 'login' && (
          <div className="flex items-center gap-2 pt-1">
            <input
              id="keepConnected"
              type="checkbox"
              checked={keepConnected}
              onChange={(e) => setKeepConnected(e.target.checked)}
              className="size-4 rounded border-border bg-secondary/40 text-primary focus:ring-primary focus:ring-offset-background"
            />
            <Label htmlFor="keepConnected" className="text-xs font-normal text-muted-foreground cursor-pointer select-none">
              Permanecer conectado
            </Label>
          </div>
        )}

        {/* Botão de Envio */}
        <Button
          type="submit"
          className="mt-2 w-full glow-primary font-medium flex items-center justify-center gap-2"
          disabled={loading || (mode === 'signup' && !isSignupValid) || (mode === 'reset' && (!isMinLength || !hasUpperCase || !hasNumber || !isPasswordMatch))}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {mode === 'login' && 'Entrar'}
          {mode === 'signup' && 'Criar conta'}
          {mode === 'recovery' && 'Enviar link de recuperação'}
          {mode === 'reset' && 'Redefinir Senha'}
        </Button>
      </form>

      {/* Alternância de Modo */}
      <div className="text-center pt-2">
        {mode === 'login' && (
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="font-medium text-primary hover:underline focus:outline-none"
            >
              Cadastre-se
            </button>
          </p>
        )}
        {mode === 'signup' && (
          <p className="text-sm text-muted-foreground">
            Já possui conta?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="font-medium text-primary hover:underline focus:outline-none"
            >
              Entrar
            </button>
          </p>
        )}
        {(mode === 'recovery' || mode === 'reset') && (
          <button
            type="button"
            onClick={() => setMode('login')}
            className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors focus:outline-none"
          >
            <ArrowLeft className="size-3.5" /> Voltar para o Login
          </button>
        )}
      </div>

      {mode === 'reset' && (
        <div className="rounded-lg border border-warning/25 bg-warning/5 p-3.5 text-[11px] leading-relaxed text-warning/85 max-w-sm mx-auto">
          <strong>Modo de Simulação:</strong> O e-mail simulou o recebimento de um token de redefinição. 
          Defina sua nova senha acima para atualizá-la no banco local do seu navegador.
        </div>
      )}

      {mode === 'login' && (
        <div className="text-center text-xs text-muted-foreground/60 border-t border-border/40 pt-4">
          Para testes, utilize: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">gustavo@financeai.app</code> / <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">Senha123!</code>
        </div>
      )}
    </div>
  )
}
