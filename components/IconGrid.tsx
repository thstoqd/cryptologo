'use client'

import { useIcons } from '@/lib/context/IconContext'
import Link from 'next/link'

export default function IconGrid() {
  const { filteredIcons, sortBy, setSortBy, selectedCategory, categories } = useIcons()

  const currentCategory = selectedCategory
    ? categories.find(c => c.id === selectedCategory)
    : null

  return (
    <div>
      {/* Top Bar */}
      <div className="mb-6">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentCategory ? currentCategory.name : 'All Icons'}
            </h2>
            <span className="text-sm text-gray-900">
              ({filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'})
            </span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="latest">Rank</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Icon Grid */}
      {filteredIcons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No icons found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4">
          {filteredIcons.map((icon) => (
            <Link
              key={icon.id}
              href={`/icon/${icon.id}`}
              className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              {/* Icon Preview */}
              <div className="aspect-square flex items-center justify-center mb-3">
                <img
                  src={icon.svgPath}
                  alt={icon.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QTFN8L3RleHQ+PC9zdmc+'
                  }}
                />
              </div>

              {/* Icon Name */}
              <h3 className="text-sm font-medium text-gray-900 text-center truncate">
                {icon.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

