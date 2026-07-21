import { Shield, TrendingUp, Wallet } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { LoginForm } from '@/components/auth/login-form'

const highlights = [
  { icon: Wallet, title: 'Saldo em tempo real', desc: 'Saiba exatamente quanto você tem hoje e amanhã.' },
  { icon: TrendingUp, title: 'Assistente com IA', desc: 'Recomendações para economizar e quitar dívidas.' },
  { icon: Shield, title: 'Login seguro', desc: 'Seus dados protegidos com criptografia.' },
]

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Painel lateral (branding) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 45%), radial-gradient(circle at 80% 80%, color-mix(in oklch, var(--chart-2) 16%, transparent), transparent 45%)',
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-2.5">
          <BrandLogo />
          <span className="text-lg font-semibold tracking-tight">Finance AI</span>
        </div>

        <div className="relative">
          <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-balance">
            Controle total da sua vida financeira, com inteligência.
          </h1>
          <div className="mt-8 grid gap-4">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <h.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Finance AI. Todos os direitos reservados.
        </p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6 bg-background/50 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <BrandLogo />
            <span className="text-lg font-semibold tracking-tight">Finance AI</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
