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
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      
      // 为每个图标计算匹配分数，用于排序
      const iconsWithScore = icons.map(icon => {
        // 转换为小写进行不区分大小写的搜索
        const nameLower = icon.name.toLowerCase()
        const descriptionLower = icon.description.toLowerCase()
        const symbolLower = icon.symbol?.toLowerCase() || ''
        
        let matchScore = 0
        let isMatch = false
        
        // 1. 缩写完全匹配（优先级最高，精确匹配）- 100分
        if (symbolLower && symbolLower === query) {
          matchScore = 100
          isMatch = true
        }
        // 2. 名称完全匹配 - 90分
        else if (nameLower === query) {
          matchScore = 90
          isMatch = true
        }
        // 3. 缩写包含查询（模糊匹配缩写）- 70分
        else if (symbolLower && symbolLower.includes(query)) {
          matchScore = 70
          isMatch = true
        }
        // 4. 名称完全匹配或包含 - 60分
        else if (nameLower.includes(query)) {
          matchScore = 60
          isMatch = true
        }
        // 5. 名称单词匹配（支持 "bit coin" 匹配 "Bitcoin"）- 50分
        // 只有当查询是名称单词的开头时才匹配，且查询长度至少2个字符，避免误匹配
        else {
          // 对于单字符查询，只匹配 symbol 或 name 的完全匹配，不进行模糊匹配
          if (query.length === 1) {
            // 单字符查询只匹配 symbol 或 name 的第一个字符
            if (symbolLower && symbolLower[0] === query) {
              matchScore = 50
              isMatch = true
            } else if (nameLower[0] === query) {
              matchScore = 50
              isMatch = true
            }
          } else {
            // 多字符查询才进行单词匹配
            const nameWords = nameLower.split(/[\s-]+/)
            if (nameWords.some(word => word.startsWith(query) && word.length >= query.length)) {
              matchScore = 50
              isMatch = true
            }
            // 6. 描述包含 - 40分（但只匹配查询长度至少3个字符的情况，避免单字符误匹配）
            else if (query.length >= 3 && descriptionLower.includes(query)) {
              matchScore = 40
              isMatch = true
            }
            // 7. 标签完全匹配 - 35分（标签完全匹配比包含匹配优先级更高）
            else if (icon.tags.some(tag => tag.toLowerCase() === query)) {
              matchScore = 35
              isMatch = true
            }
            // 8. 标签包含 - 30分（但只匹配标签中包含查询的情况，且查询长度至少2个字符）
            else if (query.length >= 2 && icon.tags.some(tag => {
              const tagLower = tag.toLowerCase()
              // 只匹配标签中包含查询，且标签不是查询本身（避免完全匹配的情况，因为已经在第7步处理了）
              return tagLower.includes(query) && tagLower !== query
            })) {
              matchScore = 30
              isMatch = true
            }
          }
        }
        
        return { icon, matchScore, isMatch }
      })
      
      // 只保留匹配的图标（isMatch 必须为 true，且 matchScore > 0），并按匹配分数排序（分数高的在前），如果分数相同，按 rank 排序
      result = iconsWithScore
        .filter(item => {
          // 严格检查：isMatch 必须为 true，且 matchScore 必须大于 0
          return item.isMatch === true && item.matchScore > 0
        })
        .sort((a, b) => {
          if (a.matchScore !== b.matchScore) {
            return b.matchScore - a.matchScore // 分数高的在前
          }
          
          // 分数相同时，按 rank 排序（rank 越小越好）
          const rankA = a.icon.rank ?? 9999
          const rankB = b.icon.rank ?? 9999
          return rankA - rankB
        })
        .map(item => item.icon)
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
    // 如果有搜索查询，已经按匹配分数排序了，只需要在相同分数时应用用户选择的排序
    // 如果没有搜索查询，应用用户选择的排序
    if (!searchQuery.trim()) {
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
    }
    // 如果有搜索查询，匹配分数排序已经在搜索逻辑中完成
    // 如果用户选择了其他排序方式，在相同匹配分数时应用
    else if (sortBy === 'name') {
      // 在相同匹配分数时，按名称排序
      // 这里需要重新计算匹配分数来保持排序
      const query = searchQuery.toLowerCase().trim()
      const iconsWithScore = result.map(icon => {
        const nameLower = icon.name.toLowerCase()
        const symbolLower = icon.symbol?.toLowerCase() || ''
        let matchScore = 0
        if (symbolLower && symbolLower === query) matchScore = 100
        else if (nameLower === query) matchScore = 90
        else if (symbolLower && symbolLower.includes(query)) matchScore = 70
        else if (nameLower.includes(query)) matchScore = 60
        return { icon, matchScore }
      })
      result.sort((a, b) => {
        const scoreA = iconsWithScore.find(item => item.icon.id === a.id)?.matchScore || 0
        const scoreB = iconsWithScore.find(item => item.icon.id === b.id)?.matchScore || 0
        if (scoreA !== scoreB) {
          return scoreB - scoreA
        }
        return a.name.localeCompare(b.name)
      })
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

