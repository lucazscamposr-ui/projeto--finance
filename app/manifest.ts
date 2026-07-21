import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Finance AI — Controle Financeiro Inteligente',
    short_name: 'Finance AI',
    description: 'Sistema profissional de controle financeiro pessoal com Inteligência Artificial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#12161f',
    theme_color: '#12161f',
    icons: [
      {
        src: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
