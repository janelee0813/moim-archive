import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '여기벙어때',
  description: '여기벙어때 - 모임 가게 아카이브',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={geist.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}