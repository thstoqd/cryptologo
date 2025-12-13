'use client'

import { useIcons } from '@/lib/context/IconContext'

export default function Hero() {
  const { searchQuery, setSearchQuery, icons } = useIcons()

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Free Cryptocurrency Icon Library
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Download high-quality SVG and PNG icons for your projects
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>{icons.length}+ Icons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span>SVG & PNG</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🆓</span>
              <span>Free Download</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

