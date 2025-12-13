'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIcons } from '@/lib/context/IconContext'

export default function Sidebar() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedFormats,
    setSelectedFormats,
    selectedTags,
    setSelectedTags,
    getCategoryCount,
    getAllTags,
  } = useIcons()

  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    router.push(`/?${params.toString()}`)
  }

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev =>
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    handleCategoryChange(null)
    setSelectedTags([])
  }

  const popularTags = getAllTags().slice(0, 8)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white border border-gray-300 rounded-md shadow-md"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 lg:w-72
          bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-20 lg:pt-0
          overflow-y-auto
          h-screen lg:h-auto
        `}
      >
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {categories
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id === selectedCategory ? null : category.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-left
                      transition-colors duration-150
                      ${
                        selectedCategory === category.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({getCategoryCount(category.id)})
                    </span>
                  </button>
                ))}
            </nav>
          </div>

          {/* Format Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Format
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes('svg')}
                  onChange={() => toggleFormat('svg')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">SVG</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes('png')}
                  onChange={() => toggleFormat('png')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">PNG</span>
              </label>
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-2 py-1 text-xs rounded-md transition-colors
                    ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedTags.length > 0) && (
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setIsOpen(false)}
          />
        )}
      </aside>
    </>
  )
}

