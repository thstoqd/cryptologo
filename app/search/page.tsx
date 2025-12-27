import { Suspense } from 'react'
import SearchClient from './SearchClient'

// 搜索页面组件（处理查询参数 ?q=）
// 使用 Suspense 包裹客户端组件，符合 Next.js 最佳实践
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  )
}

