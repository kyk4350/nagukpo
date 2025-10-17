import type { Metadata } from 'next'
import { QueryProvider } from '@/components/providers/QueryProvider'
import './globals.css'

export const metadata: Metadata = {
  title: '나국포 - AI 국어 학습 플랫폼',
  description: '국어를 포기한 자(국포자) 탈출! AI 기반 맞춤형 한국어 학습 서비스',
  keywords: ['국어', '학습', 'AI', '챗봇', '교육', '문제풀이'],
  authors: [{ name: 'kyk4350' }],
  openGraph: {
    title: '나국포 - AI 국어 학습 플랫폼',
    description: '국어를 포기한 자(국포자) 탈출! AI 기반 맞춤형 한국어 학습 서비스',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
