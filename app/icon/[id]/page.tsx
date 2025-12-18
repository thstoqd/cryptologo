import { Metadata } from 'next'
import iconsMetadata from '@/data/icons-metadata.json'
import IconDetailPageClient from './IconDetailPageClient'
import { Icon } from '@/lib/types'
import {
  generateTitle,
  generateDescription,
  getIconUrl,
  getImageUrl,
  generateStructuredData,
} from '@/lib/utils/seo-metadata'

// Generate static params for all icons (required for static export)
export function generateStaticParams() {
  return iconsMetadata.icons.map((icon) => ({
    id: icon.id,
  }))
}

// Generate SEO metadata for each icon page
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const icon = iconsMetadata.icons.find((i) => i.id === params.id) as Icon | undefined
  
  if (!icon) {
    return {
      title: 'Icon Not Found - Cryptologo',
      description: 'The requested icon could not be found.',
    }
  }
  
  const title = generateTitle(icon, true)
  const description = generateDescription(icon)
  const iconUrl = getIconUrl(icon.id)
  const imageUrl = getImageUrl(icon.svgPath)
  
  return {
    title,
    description,
    keywords: [
      icon.name,
      icon.symbol,
      `${icon.name} logo`,
      `${icon.name} svg`,
      `${icon.name} png`,
      `${icon.symbol} logo`,
      'cryptocurrency logo',
      'crypto icon',
      ...(icon.tags || []),
    ].filter(Boolean).join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url: iconUrl,
      images: [
        {
          url: imageUrl,
          alt: `${icon.name} logo`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: iconUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// This is a server component that wraps the client component
export default function IconDetailPage({ params }: { params: { id: string } }) {
  const icon = iconsMetadata.icons.find((i) => i.id === params.id) as Icon | undefined
  const structuredData = icon ? generateStructuredData(icon) : null
  
  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <IconDetailPageClient id={params.id} />
    </>
  )
}
