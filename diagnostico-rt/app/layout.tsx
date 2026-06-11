import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Diagnóstico RT — Páreo by CLA Brasil',
  description: 'Descubra em minutos se sua cadeia de fornecedores está pronta para a Reforma Tributária',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
