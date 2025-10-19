import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FHEVM SDK Demo - Privacy-Preserving Construction Bidding',
  description: 'Next.js App Router demo showcasing the universal FHEVM SDK for building confidential frontends',
  keywords: ['fhEVM', 'Zama', 'encryption', 'privacy', 'blockchain', 'Next.js'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
