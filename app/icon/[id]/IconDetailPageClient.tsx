'use client'

import { useIcons } from '@/lib/context/IconContext'
import { downloadSVG, downloadPNG } from '@/lib/utils/download'
import Link from 'next/link'

export default function IconDetailPageClient({ id }: { id: string }) {
  const { icons, categories } = useIcons()
  const icon = icons.find(i => i.id === id)

  if (!icon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Icon Not Found</h2>
          <p className="text-gray-600 mb-8">The icon you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const category = categories.find(c => c.id === icon.category)
  const relatedIcons = icons
    .filter(i => i.id !== icon.id && (i.category === icon.category || i.tags.some(tag => icon.tags.includes(tag))))
    .slice(0, 6)

  const handleDownloadSVG = () => {
    downloadSVG(icon.svgPath, icon.name)
  }

  const handleDownloadPNG = (size: number) => {
    downloadPNG(icon.pngPath, icon.name, size)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Icons</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="Cryptologo"
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
              <span className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                Cryptologo
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Icon Preview */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center aspect-square">
              <img
                src={icon.svgPath}
                alt={icon.name}
                className="w-full h-full object-contain max-w-md"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QTFN8L3RleHQ+PC9zdmc+'
                }}
              />
            </div>
          </div>

          {/* Right: Icon Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{icon.name}</h1>
              {(icon.categories && icon.categories.length > 0) && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {icon.categories.map((catId) => {
                    const cat = categories.find(c => c.id === catId)
                    return cat ? (
                      <Link
                        key={catId}
                        href={`/?category=${catId}`}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ) : null
                  })}
                </div>
              )}
              {!icon.categories && category && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{category.icon}</span>
                  <Link
                    href={`/?category=${category.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {category.name}
                  </Link>
                </div>
              )}
              {icon.website && (
                <a
                  href={icon.website}
                  className="text-primary-600 hover:text-primary-700 text-sm break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon.website}
                </a>
              )}
            </div>

            {/* Tags */}
            {icon.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {icon.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Download</h3>
              
              {/* SVG Download */}
              <div className="mb-4">
                <button
                  onClick={handleDownloadSVG}
                  className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download SVG
                </button>
              </div>

              {/* PNG Downloads */}
              <div>
                <p className="text-sm text-gray-600 mb-3">PNG Sizes:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {icon.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleDownloadPNG(size)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Icons */}
        {relatedIcons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Icons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedIcons.map((relatedIcon) => (
                <Link
                  key={relatedIcon.id}
                  href={`/icon/${relatedIcon.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-square flex items-center justify-center mb-2">
                    <img
                      src={relatedIcon.svgPath}
                      alt={relatedIcon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 text-center truncate">
                    {relatedIcon.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

