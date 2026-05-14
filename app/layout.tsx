import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'
import './globals.css'

const notoSansArabic = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic"
});

export const metadata: Metadata = {
  title: 'نظام حجوزات قاعة البلدية',
  description: 'نظام إدارة حجوزات قاعات الفعاليات في البلدية',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.png',
      },
    ],
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${notoSansArabic.className} antialiased`}>
        <ConvexClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-center" />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
