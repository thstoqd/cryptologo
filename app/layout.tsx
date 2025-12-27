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
    url: 'https://cryptologo.org',
    siteName: 'Cryptologo',
    images: [
      {
        url: 'https://cryptologo.org/logo.png',
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
    images: ['https://cryptologo.org/logo.png'],
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
      { url: 'https://cryptologo.org/favicon.ico', sizes: 'any' },
      { url: 'https://cryptologo.org/favicon-128.png', type: 'image/png', sizes: '128x128' },
    ],
    apple: [
      { url: 'https://cryptologo.org/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: 'https://cryptologo.org/favicon.ico',
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
  // Organization Schema 数据
  // 如果有社交媒体账号，可以在 organizationSchema 对象中添加 sameAs 字段
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cryptologo",
    url: "https://cryptologo.org",
    logo: "https://cryptologo.org/logo.png",
    // 示例：如果有社交媒体账号，取消注释下面这行
    // sameAs: ["https://twitter.com/your_handle", "https://github.com/your_org"]
  }

  // WebSite Schema 数据
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cryptologo",
    url: "https://cryptologo.org",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://cryptologo.org/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <html lang="en">
      <head>
        {/* Organization Logo Schema（Google 搜索 Logo 用） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* WebSite Schema（品牌识别增强，推荐） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <IconProvider>{children}</IconProvider>
      </body>
    </html>
  )
}

