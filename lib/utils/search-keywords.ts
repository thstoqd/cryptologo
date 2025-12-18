import { Icon } from '@/lib/types'

/**
 * 为图标生成所有可能的搜索关键词
 * 这些关键词会被用于生成静态路由，支持 SEO
 */
export function generateSearchKeywords(icon: Icon): string[] {
  const keywords: Set<string> = new Set()
  
  // 标准化处理：转为小写，去除特殊字符
  const normalize = (str: string) => str.toLowerCase().trim()
  
  const symbol = icon.symbol ? normalize(icon.symbol) : ''
  const name = normalize(icon.name)
  const id = normalize(icon.id)
  
  // 如果 symbol 存在，生成基于 symbol 的关键词
  if (symbol) {
    // btc-logo-svg, btc-logo-png
    keywords.add(`${symbol}-logo-svg`)
    keywords.add(`${symbol}-logo-png`)
    
    // btc-logo
    keywords.add(`${symbol}-logo`)
    
    // btc-svg, btc-png
    keywords.add(`${symbol}-svg`)
    keywords.add(`${symbol}-png`)
    
    // btc (仅符号，最常用)
    keywords.add(symbol)
  }
  
  // 如果 name 与 symbol 不同，生成基于 name 的关键词
  if (name && name !== symbol) {
    // bitcoin-logo-svg, bitcoin-logo-png
    keywords.add(`${name}-logo-svg`)
    keywords.add(`${name}-logo-png`)
    
    // bitcoin-logo
    keywords.add(`${name}-logo`)
    
    // bitcoin-svg, bitcoin-png
    keywords.add(`${name}-svg`)
    keywords.add(`${name}-png`)
    
    // bitcoin (完整名称)
    keywords.add(name)
  }
  
  // 添加 id 作为备选（如果 id 与 name/symbol 不同）
  if (id && id !== symbol && id !== name) {
    keywords.add(`${id}-logo-svg`)
    keywords.add(`${id}-logo-png`)
    keywords.add(`${id}-logo`)
    keywords.add(id)
  }
  
  // 处理 tags 中的相关关键词（可选，避免生成过多）
  // 这里暂时不添加，因为可能会生成太多关键词
  
  return Array.from(keywords).filter(Boolean)
}

/**
 * 从搜索查询中匹配图标
 * 支持多种格式：btc-logo-svg, btc-logo, btc-svg, btc, bitcoin-logo 等
 */
export function matchIconFromQuery(
  query: string,
  icons: Icon[]
): Icon | null {
  if (!query || !icons.length) return null
  
  // 标准化查询：转为小写，去除连字符和空格
  const normalizedQuery = query
    .toLowerCase()
    .trim()
    .replace(/[-_\s]+/g, '-') // 统一使用连字符
  
  // 提取可能的匹配项
  const parts = normalizedQuery.split('-')
  const hasLogo = parts.includes('logo')
  const hasSvg = parts.includes('svg')
  const hasPng = parts.includes('png')
  
  // 提取核心标识符（去除 logo, svg, png 等修饰词）
  const coreParts = parts.filter(
    part => !['logo', 'svg', 'png', 'icon', 'icons'].includes(part)
  )
  const coreQuery = coreParts.join('-')
  
  // 匹配策略：按优先级排序
  const matches: Array<{ icon: Icon; score: number }> = []
  
  icons.forEach(icon => {
    let score = 0
    const symbol = icon.symbol?.toLowerCase() || ''
    const name = icon.name.toLowerCase()
    const id = icon.id.toLowerCase()
    
    // 完全匹配 symbol（最高优先级）
    if (symbol && (normalizedQuery === symbol || coreQuery === symbol)) {
      score = 100
    }
    // 完全匹配 name
    else if (name && (normalizedQuery === name || coreQuery === name)) {
      score = 90
    }
    // 完全匹配 id
    else if (id && (normalizedQuery === id || coreQuery === id)) {
      score = 80
    }
    // 部分匹配 symbol
    else if (symbol && (normalizedQuery.includes(symbol) || coreQuery.includes(symbol))) {
      score = 70
    }
    // 部分匹配 name
    else if (name && (normalizedQuery.includes(name) || coreQuery.includes(name))) {
      score = 60
    }
    // 部分匹配 id
    else if (id && (normalizedQuery.includes(id) || coreQuery.includes(id))) {
      score = 50
    }
    
    // 如果查询包含 logo，且图标有相关标签，加分
    if (hasLogo && score > 0) {
      score += 5
    }
    
    // 如果查询包含 svg/png，且图标有对应格式，加分
    if ((hasSvg || hasPng) && score > 0) {
      score += 5
    }
    
    // 如果有 rank，按 rank 调整（rank 越小越好）
    if (icon.rank && score > 0) {
      score += Math.max(0, 10 - icon.rank / 10)
    }
    
    if (score > 0) {
      matches.push({ icon, score })
    }
  })
  
  // 按分数排序，返回最高分的图标
  if (matches.length === 0) return null
  
  matches.sort((a, b) => b.score - a.score)
  return matches[0].icon
}

/**
 * 获取所有图标的搜索关键词映射
 * 用于生成静态路由
 */
export function getAllSearchKeywords(icons: Icon[]): Array<{
  query: string
  iconId: string
}> {
  const keywordMap: Map<string, string> = new Map()
  
  icons.forEach(icon => {
    const keywords = generateSearchKeywords(icon)
    keywords.forEach(keyword => {
      // 如果关键词已存在，保留 rank 更高的图标
      if (!keywordMap.has(keyword) || (icon.rank && icon.rank < 100)) {
        keywordMap.set(keyword, icon.id)
      }
    })
  })
  
  return Array.from(keywordMap.entries()).map(([query, iconId]) => ({
    query,
    iconId,
  }))
}

