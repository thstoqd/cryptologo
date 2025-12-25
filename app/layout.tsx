import type { Metadata } from 'next'
import './globals.css'
import { IconProvider } from '@/lib/context/IconContext'

export const metadata: Metadata = {
  title: 'Cryptologo - Free Official Cryptocurrency Icon Library',
  description: 'Download free high-quality SVG and PNG cryptocurrency icons. Search and download Bitcoin, Ethereum, and thousands of crypto icons for your projects.',
  keywords: ['cryptocurrency icons', 'crypto icons', 'bitcoin icon', 'ethereum icon', 'free icons', 'SVG icons', 'PNG icons', 'crypto logo'],
  authors: [{ name: 'Cryptologo' }],
  creator: 'Cryptologo',
  publisher: 'Cryptologo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptologo.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Free Official Cryptocurrency Icon Library',
    description: 'Download high-quality web3 SVG and PNG icons',
    url: '/',
    siteName: 'Cryptologo',
    images: [
      {
        url: '/logo-512.png',
        width: 512,
        height: 512,
        alt: 'Cryptologo Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Official Cryptocurrency Icon Library',
    description: 'Download high-quality web3 SVG and PNG icons',
    images: ['/logo-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-128.png', type: 'image/png', sizes: '128x128' },
    ],
    apple: [
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <IconProvider>{children}</IconProvider>
      </body>
    </html>
  )
}

