import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRE Site Intelligence | Exa-Powered Research',
  description: 'AI-powered site intelligence reports for commercial real estate developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
