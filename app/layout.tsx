'use client'

import { Inter } from 'next/font/google'
import { ToastProvider } from '@/components/Toast'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ToastProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}
