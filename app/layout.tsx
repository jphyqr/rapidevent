// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/shared/nav'
import { ThemeProvider } from '@/components/theme-provider'
import { SubmissionProvider } from './providers/SubmissionProvider'


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
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
           <SubmissionProvider>
        <div className="min-h-screen bg-background">
          <Nav />
          <main className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        </SubmissionProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}

