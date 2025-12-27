'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import iconsMetadata from '@/data/icons-metadata.json'
import { matchIconFromQuery } from '@/lib/utils/search-keywords'
import { Icon } from '@/lib/types'

// 搜索处理客户端组件（使用 useSearchParams）
export default function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const query = searchParams.get('q')

    // 如果没有查询参数，重定向到首页
    if (!query || query.trim() === '') {
      router.replace('/')
      return
    }

    // 匹配图标
    const icon = matchIconFromQuery(query.trim(), iconsMetadata.icons as Icon[])

    if (!icon) {
      // 如果没有匹配到，重定向到搜索关键词页面（SEO 友好）
      router.replace(`/search/${encodeURIComponent(query.trim())}`)
      return
    }

    // 匹配到图标，重定向到图标详情页
    router.replace(`/icon/${icon.id}`)
  }, [searchParams, router])

  // 显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}

