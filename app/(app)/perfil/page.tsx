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
  Paintbrush,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  Image as ImageIcon,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useFinance } from '@/lib/finance-context'
import { useAuth } from '@/lib/auth-context'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
]

// Preset options for themes
const THEME_PRESETS = [
  {
    name: 'Sombrio Tech (Padrão)',
    colors: {
      primaryColor: '#728cf0',
      backgroundColor: '#151b26',
      textColor: '#f5f7fa',
      cardColor: '#1d2430',
      wallpaperUrl: '',
      glassmorphism: false,
    },
    preview: 'bg-[#151b26] border-[#728cf0]',
  },
  {
    name: 'Roxo Nubank',
    colors: {
      primaryColor: '#820ad1',
      backgroundColor: '#0c0212',
      textColor: '#ffffff',
      cardColor: '#1a0826',
      wallpaperUrl: '',
      glassmorphism: false,
    },
    preview: 'bg-[#0c0212] border-[#820ad1]',
  },
  {
    name: 'Verde PicPay',
    colors: {
      primaryColor: '#11c76f',
      backgroundColor: '#0a120e',
      textColor: '#ffffff',
      cardColor: '#112119',
      wallpaperUrl: '',
      glassmorphism: false,
    },
    preview: 'bg-[#0a120e] border-[#11c76f]',
  },
  {
    name: 'Banco Inter Laranja',
    colors: {
      primaryColor: '#ff7a00',
      backgroundColor: '#121212',
      textColor: '#ffffff',
      cardColor: '#1f1f1f',
      wallpaperUrl: '',
      glassmorphism: false,
    },
    preview: 'bg-[#121212] border-[#ff7a00]',
  },
  {
    name: 'Cyberpunk Neon',
    colors: {
      primaryColor: '#ff0055',
      backgroundColor: '#040308',
      textColor: '#00ffcc',
      cardColor: '#0e0b1c',
      wallpaperUrl: '',
      glassmorphism: false,
    },
    preview: 'bg-[#040308] border-[#ff0055]',
  },
  {
    name: 'Aurora Borealis (Wallpaper)',
    colors: {
      primaryColor: '#2dd4bf',
      backgroundColor: '#030712',
      textColor: '#f8fafc',
      cardColor: 'rgba(17, 24, 39, 0.65)',
      wallpaperUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      glassmorphism: true,
    },
    preview: 'bg-[#030712] border-[#2dd4bf] ring-1 ring-teal-500/35',
  },
  {
    name: 'Abstract Fluid (Wallpaper)',
    colors: {
      primaryColor: '#ec4899',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      cardColor: 'rgba(30, 41, 59, 0.65)',
      wallpaperUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      glassmorphism: true,
    },
    preview: 'bg-[#0f172a] border-[#ec4899] ring-1 ring-pink-500/35',
  },
]

// Preset wallpapers
const WALLPAPER_PRESETS = [
  {
    name: 'Futuristic Grid',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Abstract Silk',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vibrant Aurora',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dark Space',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  },
]

export default function PerfilPage() {
  const { user, updateUser } = useFinance()
  const { theme, updateTheme, resetTheme } = useAuth()

  // Form states (Profile)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '')
  const [whatsappNumber, setWhatsappNumber] = useState(user.whatsappNumber || '+55 11 98765-4321')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // WhatsApp connection modal state
  const [qrModalOpen, setQrModalOpen] = useState(false)

  // Customizer local editing states
  const [customPrimary, setCustomPrimary] = useState(theme.primaryColor || '#728cf0')
  const [customBg, setCustomBg] = useState(theme.backgroundColor || '#151b26')
  const [customText, setCustomText] = useState(theme.textColor || '#f5f7fa')
  const [customCard, setCustomCard] = useState(theme.cardColor || '#1d2430')
  const [customWallpaper, setCustomWallpaper] = useState(theme.wallpaperUrl || '')
  const [customGlass, setCustomGlass] = useState(theme.glassmorphism || false)
  const [themeSuccess, setThemeSuccess] = useState(false)

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

  const handleApplyPreset = (presetColors: typeof THEME_PRESETS[0]['colors']) => {
    setCustomPrimary(presetColors.primaryColor || '#728cf0')
    setCustomBg(presetColors.backgroundColor || '#151b26')
    setCustomText(presetColors.textColor || '#f5f7fa')
    setCustomCard(presetColors.cardColor || '#1d2430')
    setCustomWallpaper(presetColors.wallpaperUrl || '')
    setCustomGlass(presetColors.glassmorphism || false)
    
    updateTheme(presetColors)
    setThemeSuccess(true)
    setTimeout(() => setThemeSuccess(false), 2000)
  }

  const handleApplyCustomTheme = (e: React.FormEvent) => {
    e.preventDefault()
    updateTheme({
      primaryColor: customPrimary,
      backgroundColor: customBg,
      textColor: customText,
      cardColor: customCard,
      wallpaperUrl: customWallpaper,
      glassmorphism: customGlass,
    })
    setThemeSuccess(true)
    setTimeout(() => setThemeSuccess(false), 3000)
  }

  const handleResetThemeClick = () => {
    resetTheme()
    setCustomPrimary('#728cf0')
    setCustomBg('#151b26')
    setCustomText('#f5f7fa')
    setCustomCard('#1d2430')
    setCustomWallpaper('')
    setCustomGlass(false)
    
    setThemeSuccess(true)
    setTimeout(() => setThemeSuccess(false), 2000)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Configurações do Sistema"
        description="Gerencie seu perfil de acesso, conexões e personalize a aparência do seu painel financeiro."
      />

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="size-4" /> Minha Conta
          </TabsTrigger>
          <TabsTrigger value="personalizar" className="flex items-center gap-2">
            <Paintbrush className="size-4" /> Personalizar Painel
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Minha Conta (Perfil + WhatsApp) */}
        <TabsContent value="perfil" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:col-span-1 text-center flex flex-col items-center p-6 bg-card/65 backdrop-blur-md">
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

              <h3 className="text-lg font-semibold">{user.name || 'Usuário'}</h3>
              <p className="text-xs text-muted-foreground">{user.email || 'carregando...'}</p>

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
            <Card className="md:col-span-2 bg-card/65 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription className="text-xs">
                  Atualize seu nome completo, e-mail e avatar de acesso.
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
          <Card className="bg-card/65 backdrop-blur-md">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  className="bg-success text-success-foreground hover:bg-success/90 gap-2 text-xs w-full sm:w-auto"
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
        </TabsContent>

        {/* Tab 2: Personalização */}
        <TabsContent value="personalizar" className="space-y-6">
          {/* Preset Themes Grid */}
          <Card className="bg-card/65 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Temas Rápidos (Presets)
              </CardTitle>
              <CardDescription className="text-xs">
                Escolha uma das aparências predefinidas inspiradas em bancos profissionais ou em estilos tech.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset.colors)}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/35 p-3.5 text-left transition-all hover:bg-secondary/70 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className={`size-8 rounded-full border-2 ${preset.preview}`} />
                    <span className="text-xs font-semibold text-foreground leading-tight">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theme Customizer Forms */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Customizer Panel */}
            <Card className="md:col-span-2 bg-card/65 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <LayoutGrid className="size-4 text-primary" />
                  Personalização Avançada
                </CardTitle>
                <CardDescription className="text-xs">
                  Modifique cores específicas, insira fotos de fundo (wallpaper) e ative a transparência.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApplyCustomTheme} className="space-y-5">
                  {/* Colors Pickers */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="custom-primary" className="text-xs font-semibold">Cor de Destaque (Botões, Ícones)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="custom-primary"
                          type="color"
                          value={customPrimary}
                          onChange={(e) => setCustomPrimary(e.target.value)}
                          className="size-10 p-1 cursor-pointer rounded-lg shrink-0"
                        />
                        <Input
                          type="text"
                          value={customPrimary}
                          onChange={(e) => setCustomPrimary(e.target.value)}
                          placeholder="#ffffff"
                          className="h-10 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-bg" className="text-xs font-semibold">Cor de Fundo da Tela</Label>
                      <div className="flex gap-2">
                        <Input
                          id="custom-bg"
                          type="color"
                          value={customBg}
                          onChange={(e) => setCustomBg(e.target.value)}
                          className="size-10 p-1 cursor-pointer rounded-lg shrink-0"
                        />
                        <Input
                          type="text"
                          value={customBg}
                          onChange={(e) => setCustomBg(e.target.value)}
                          placeholder="#ffffff"
                          className="h-10 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-text" className="text-xs font-semibold">Cor do Texto Principal</Label>
                      <div className="flex gap-2">
                        <Input
                          id="custom-text"
                          type="color"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          className="size-10 p-1 cursor-pointer rounded-lg shrink-0"
                        />
                        <Input
                          type="text"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          placeholder="#ffffff"
                          className="h-10 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-card" className="text-xs font-semibold">Cor dos Cartões / Sidebar</Label>
                      <div className="flex gap-2">
                        <Input
                          id="custom-card"
                          type="color"
                          value={customCard}
                          onChange={(e) => setCustomCard(e.target.value)}
                          className="size-10 p-1 cursor-pointer rounded-lg shrink-0"
                        />
                        <Input
                          type="text"
                          value={customCard}
                          onChange={(e) => setCustomCard(e.target.value)}
                          placeholder="#ffffff"
                          className="h-10 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wallpaper Customizer */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <Label htmlFor="custom-wallpaper" className="text-xs font-semibold flex items-center gap-1.5">
                      <ImageIcon className="size-4 text-muted-foreground" />
                      Imagem de Fundo (Wallpaper URL)
                    </Label>
                    <Input
                      id="custom-wallpaper"
                      type="text"
                      value={customWallpaper}
                      onChange={(e) => setCustomWallpaper(e.target.value)}
                      placeholder="https://exemplo.com/imagem-de-fundo.jpg"
                      className="text-xs"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Carregue qualquer imagem pública da internet inserindo o link direto para a imagem.
                    </p>
                  </div>

                  {/* Glassmorphism Toggle */}
                  <div className="flex items-center gap-2.5 pt-2">
                    <input
                      id="custom-glass"
                      type="checkbox"
                      checked={customGlass}
                      onChange={(e) => setCustomGlass(e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <Label htmlFor="custom-glass" className="text-xs font-semibold cursor-pointer">
                        Efeito Vidro Transparente (Glassmorphism)
                      </Label>
                      <p className="text-[10px] text-muted-foreground leading-snug">
                        Torna os cartões translúcidos com desfoque de fundo. Perfeito quando há um wallpaper ativo.
                      </p>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="border-t border-border pt-4 flex flex-wrap gap-2.5">
                    <Button type="submit" className="glow-primary text-xs gap-2">
                      <Save className="size-4" />
                      Salvar Personalização
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetThemeClick}
                      className="text-xs gap-1 border-border/80 text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="size-3.5" />
                      Resetar Padrão
                    </Button>

                    {themeSuccess && (
                      <span className="text-xs text-success inline-flex items-center gap-1 self-center ml-2">
                        <CheckCircle className="size-3.5" /> Aparência aplicada!
                      </span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Wallpapers presets */}
            <Card className="md:col-span-1 bg-card/65 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="size-4 text-primary" />
                  Papéis de Parede
                </CardTitle>
                <CardDescription className="text-xs">
                  Presets de imagens abstratas prontas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {WALLPAPER_PRESETS.map((wall) => (
                    <button
                      key={wall.name}
                      type="button"
                      onClick={() => {
                        setCustomWallpaper(wall.url)
                        setCustomGlass(true)
                        updateTheme({
                          primaryColor: customPrimary,
                          backgroundColor: customBg,
                          textColor: customText,
                          cardColor: customCard,
                          wallpaperUrl: wall.url,
                          glassmorphism: true,
                        })
                        setThemeSuccess(true)
                        setTimeout(() => setThemeSuccess(false), 2000)
                      }}
                      className="group relative h-20 rounded-lg overflow-hidden border border-border hover:border-primary transition-all cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={wall.url} alt={wall.name} className="size-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-semibold transition-opacity">
                        Aplicar
                      </div>
                    </button>
                  ))}
                </div>

                {customWallpaper && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCustomWallpaper('')
                      updateTheme({
                        primaryColor: customPrimary,
                        backgroundColor: customBg,
                        textColor: customText,
                        cardColor: customCard,
                        wallpaperUrl: '',
                        glassmorphism: false,
                      })
                      setThemeSuccess(true)
                      setTimeout(() => setThemeSuccess(false), 2000)
                    }}
                    className="w-full text-xs text-destructive hover:bg-destructive/10"
                  >
                    Remover Imagem de Fundo
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* WhatsApp QR Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-md text-center bg-card">
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
