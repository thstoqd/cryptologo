import { MetadataRoute } from 'next'
import iconsMetadata from '@/data/icons-metadata.json'
import { getAllSearchKeywords } from '@/lib/utils/search-keywords'
import { Icon } from '@/lib/types'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptologo.org'
  
  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Dynamic routes for each icon
  iconsMetadata.icons.forEach((icon) => {
    routes.push({
      url: `${baseUrl}/icon/${icon.id}`,
      lastModified: new Date(icon.addedDate),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // Search keyword routes for SEO
  const searchKeywords = getAllSearchKeywords(iconsMetadata.icons as Icon[])
  searchKeywords.forEach(({ query }) => {
    routes.push({
      url: `${baseUrl}/search/${query}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, // 略低于图标页面，但仍然是重要的 SEO 入口
    })
  })

  return routes
}


