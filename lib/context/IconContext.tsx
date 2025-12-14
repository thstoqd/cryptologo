'use client'

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { Icon, Category } from '@/lib/types'
import iconsMetadata from '@/data/icons-metadata.json'

interface IconContextType {
  icons: Icon[]
  categories: Category[]
  filteredIcons: Icon[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedFormats: string[]
  setSelectedFormats: React.Dispatch<React.SetStateAction<string[]>>
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
  sortBy: string
  setSortBy: (sort: string) => void
  getCategoryCount: (categoryId: string) => number
  getAllTags: () => string[]
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const IconContext = createContext<IconContextType | undefined>(undefined)

export function IconProvider({ children }: { children: ReactNode }) {
  const [icons] = useState<Icon[]>(iconsMetadata.icons as Icon[])
  const [categories] = useState<Category[]>(iconsMetadata.categories as Category[])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['svg', 'png'])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('latest')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Get all unique tags
  const getAllTags = () => {
    const tags = new Set<string>()
    icons.forEach(icon => {
      icon.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }

  // Get category count
  const getCategoryCount = (categoryId: string) => {
    return icons.filter(icon => 
      icon.category === categoryId || 
      (icon.categories && icon.categories.includes(categoryId))
    ).length
  }

  // Filter and sort icons
  const filteredIcons = useMemo(() => {
    let result = [...icons]

    // Search filter - 支持缩写、模糊搜索、不区分大小写
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      
      result = result.filter(icon => {
        // 转换为小写进行不区分大小写的搜索
        const nameLower = icon.name.toLowerCase()
        const descriptionLower = icon.description.toLowerCase()
        const symbolLower = icon.symbol?.toLowerCase() || ''
        
        // 1. 缩写完全匹配（优先级最高，精确匹配）
        if (symbolLower && symbolLower === query) return true
        
        // 2. 名称完全匹配或包含
        if (nameLower.includes(query)) return true
        
        // 3. 缩写包含查询（模糊匹配缩写）
        if (symbolLower && symbolLower.includes(query)) return true
        
        // 4. 名称单词匹配（支持 "bit coin" 匹配 "Bitcoin"）
        const nameWords = nameLower.split(/[\s-]+/)
        if (nameWords.some(word => word.startsWith(query) || query.startsWith(word))) return true
        
        // 5. 描述包含
        if (descriptionLower.includes(query)) return true
        
        // 6. 标签包含
        if (icon.tags.some(tag => tag.toLowerCase().includes(query))) return true
        
        return false
      })
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(icon => 
        icon.category === selectedCategory || 
        (icon.categories && icon.categories.includes(selectedCategory))
      )
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter(icon =>
        selectedTags.some(tag => icon.tags.includes(tag))
      )
    }

    // Format filter (this is more for display, actual filtering happens in download)
    // We keep all icons but can use this for UI indication

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rank':
        // Sort by rank (CoinMarketCap ranking), lower rank first
        result.sort((a, b) => {
          const rankA = a.rank ?? 9999
          const rankB = b.rank ?? 9999
          return rankA - rankB
        })
        break
      case 'latest':
      default:
        // Default: sort by rank if available, otherwise by date
        result.sort((a, b) => {
          const rankA = a.rank ?? 9999
          const rankB = b.rank ?? 9999
          if (rankA !== 9999 || rankB !== 9999) {
            return rankA - rankB
          }
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        })
        break
    }

    return result
  }, [icons, searchQuery, selectedCategory, selectedTags, sortBy])

  return (
    <IconContext.Provider
      value={{
        icons,
        categories,
        filteredIcons,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedFormats,
        setSelectedFormats,
        selectedTags,
        setSelectedTags,
        sortBy,
        setSortBy,
        getCategoryCount,
        getAllTags,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </IconContext.Provider>
  )
}

export function useIcons() {
  const context = useContext(IconContext)
  if (context === undefined) {
    throw new Error('useIcons must be used within an IconProvider')
  }
  return context
}

