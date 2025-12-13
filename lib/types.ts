export interface Category {
  id: string
  name: string
  icon: string
  description: string
  order: number
}

export interface Icon {
  id: string
  name: string
  symbol?: string  // 代币缩写，如 BTC, ETH
  category: string  // 主分类（保留用于兼容）
  categories?: string[]  // 多个分类（新字段）
  tags: string[]
  svgPath: string
  pngPath: string
  sizes: number[]
  addedDate: string
  color: string
  description: string
  website?: string  // 官方网址
  rank?: number  // CoinMarketCap 排名，用于排序
}

export interface IconsMetadata {
  version: string
  lastUpdated: string
  categories: Category[]
  icons: Icon[]
}

