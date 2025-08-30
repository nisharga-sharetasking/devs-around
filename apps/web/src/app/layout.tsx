import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import StoreProvider from '@/provider/store-provider'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DevsAround',
  description: 'DevsAround Panel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${dmSans.variable} font-sans antialiased`}>
          {children}
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </StoreProvider>
  )
}
