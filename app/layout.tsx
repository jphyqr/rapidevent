// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/shared/nav'
import { ThemeProviderClientWrapper } from './providers/ThemeProviderClientWrapper'
import { SubmissionProvider } from './providers/SubmissionProvider'
import { Toaster } from '@/components/ui/toaster'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EventFlow Dashboard',
  description: 'Event management dashboard'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProviderClientWrapper>

    
           <SubmissionProvider>
        <div className="min-h-screen bg-background">
          <Nav />
          <main className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
            <Toaster />
          </main>
        </div>
        </SubmissionProvider>
        </ThemeProviderClientWrapper>
      </body>
    </html>
  )
}

