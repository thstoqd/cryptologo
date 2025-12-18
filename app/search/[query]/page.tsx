import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import iconsMetadata from '@/data/icons-metadata.json'
import { getAllSearchKeywords, matchIconFromQuery } from '@/lib/utils/search-keywords'
import { Icon } from '@/lib/types'
import {
  generateTitle,
  generateDescription,
  getIconUrl,
  getImageUrl,
} from '@/lib/utils/seo-metadata'

// 生成所有搜索关键词的静态参数
export function generateStaticParams() {
  const keywords = getAllSearchKeywords(iconsMetadata.icons as Icon[])
  
  return keywords.map(({ query }) => ({
    query,
  }))
}

// 生成 SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { query: string }
}): Promise<Metadata> {
  const { query } = params
  const icon = matchIconFromQuery(query, iconsMetadata.icons as Icon[])
  
  if (!icon) {
    return {
      title: `${query} Logo - Cryptologo`,
      description: `Search for ${query} logo, SVG, and PNG formats`,
    }
  }
  
  const title = generateTitle(icon, true)
  const description = generateDescription(icon)
  const iconUrl = getIconUrl(icon.id)
  const imageUrl = getImageUrl(icon.svgPath)
  
  return {
    title,
    description,
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

// 搜索页面组件
export default function SearchPage({
  params,
}: {
  params: { query: string }
}) {
  const { query } = params
  
  // 匹配图标
  const icon = matchIconFromQuery(query, iconsMetadata.icons as Icon[])
  
  if (!icon) {
    // 如果没有匹配到，显示 404 页面
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Icon Not Found
          </h2>
          <p className="text-gray-600 mb-2">
            No icon found for &quot;{query}&quot;
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Try searching for a different cryptocurrency or token
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }
  
  // 匹配到图标，重定向到图标详情页
  redirect(`/icon/${icon.id}`)
}

