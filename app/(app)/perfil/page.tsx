'use client'

import { useState } from 'react'
import {
  User,
  Mail,
  Camera,
  MessageSquare,
  Shield,
  CheckCircle,
  QrCode,
  Smartphone,
  Save,
  Link2,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useFinance } from '@/lib/finance-context'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
]

export default function PerfilPage() {
  const { user, updateUser } = useFinance()

  // Form states
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '')
  const [whatsappNumber, setWhatsappNumber] = useState(user.whatsappNumber || '+55 11 98765-4321')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // WhatsApp connection modal state
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser({
      name,
      email,
      avatarUrl,
      whatsappNumber,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleConnectWhatsapp = () => {
    updateUser({ whatsappConnected: true })
    setQrModalOpen(false)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Meu Perfil & Configurações"
        description="Gerencie seus dados pessoais, foto de perfil e integração com o WhatsApp."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 text-center flex flex-col items-center p-6">
          <div className="relative group cursor-pointer mb-4">
            <Avatar className="size-24 border-2 border-primary/40 shadow-lg">
              <AvatarImage src={avatarUrl || user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-2xl font-bold text-primary">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs gap-1 font-medium">
              <Camera className="size-4" /> Alterar
            </div>
          </div>

          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>

          <div className="mt-4 flex flex-col gap-2 w-full">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-left space-y-1">
              <span className="text-[11px] text-muted-foreground">Status do WhatsApp</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  {user.whatsappConnected ? 'Conectado' : 'Desconectado'}
                </span>
                <Badge
                  variant="outline"
                  className={
                    user.whatsappConnected
                      ? 'border-success/40 bg-success/10 text-success'
                      : 'border-destructive/40 bg-destructive/10 text-destructive'
                  }
                >
                  {user.whatsappConnected ? 'Ativo' : 'Pendente'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="size-4 text-primary" />
              Informações Pessoais
            </CardTitle>
            <CardDescription className="text-xs">
              Atualize seu nome, foto e contatos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-mail de Acesso</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  required
                />
              </div>

              {/* Photo Options */}
              <div className="grid gap-2">
                <Label>Foto de Perfil (URL ou Presets)</Label>
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://suafoto.com/avatar.jpg"
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">Ou escolha uma foto de demonstração:</p>
                <div className="flex gap-2 pt-1">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`size-10 rounded-full overflow-hidden border-2 transition-all ${
                        avatarUrl === preset ? 'border-primary scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preset} alt="preset" className="size-full object-cover" />
                    </button>
                  ))}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-xs text-muted-foreground hover:text-foreground self-center ml-2"
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <Button type="submit" className="glow-primary gap-2">
                  <Save className="size-4" />
                  Salvar Alterações
                </Button>
                {savedSuccess && (
                  <span className="ml-3 text-xs text-success inline-flex items-center gap-1">
                    <CheckCircle className="size-3.5" /> Salvo com sucesso!
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Integration Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-lg bg-success/15 text-success">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">Integração com WhatsApp (Finance AI Bot)</CardTitle>
                <CardDescription className="text-xs">
                  Envie áudios ou textos para registrar gastos instantaneamente pelo WhatsApp.
                </CardDescription>
              </div>
            </div>

            <Button
              className="bg-success text-success-foreground hover:bg-success/90 gap-2 text-xs"
              onClick={() => setQrModalOpen(true)}
            >
              <QrCode className="size-4" />
              {user.whatsappConnected ? 'Reconectar WhatsApp' : 'Conectar WhatsApp'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border p-3 space-y-1">
              <p className="text-xs font-semibold flex items-center gap-1.5">
                <Smartphone className="size-3.5 text-primary" /> Número Vinculado
              </p>
              <p className="text-sm text-muted-foreground">{whatsappNumber}</p>
            </div>

            <div className="rounded-lg border border-border p-3 space-y-1">
              <p className="text-xs font-semibold flex items-center gap-1.5">
                <Link2 className="size-3.5 text-success" /> Registro por Áudio
              </p>
              <p className="text-xs text-muted-foreground">
                Mande áudio: &quot;Gastei 45 no mercado&quot; que a IA categoriza.
              </p>
            </div>

            <div className="rounded-lg border border-border p-3 space-y-1">
              <p className="text-xs font-semibold flex items-center gap-1.5">
                <Shield className="size-3.5 text-warning" /> Alertas Automáticos
              </p>
              <p className="text-xs text-muted-foreground">
                Receba lembretes no dia de vencimento das contas fixas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp QR Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <MessageSquare className="size-5 text-success" />
              Conectar WhatsApp Finance AI
            </DialogTitle>
            <DialogDescription className="text-xs">
              Abra o WhatsApp no seu celular → Aparelhos Conectados → Conectar um aparelho
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-white text-black">
            {/* SVG QR Code Simulation */}
            <div className="size-48 bg-black/5 p-2 rounded-lg flex items-center justify-center border-2 border-black">
              <QrCode className="size-36 text-black" />
            </div>
            <p className="mt-3 text-xs font-semibold text-zinc-800">
              Escaneie o QR Code acima para parear
            </p>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              className="bg-success text-success-foreground hover:bg-success/90 w-full"
              onClick={handleConnectWhatsapp}
            >
              Simular Conexão Concluída
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
