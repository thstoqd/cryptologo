import { MetadataRoute } from 'next'
import iconsMetadata from '@/data/icons-metadata.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptologo.com'
  
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

  return routes
}


