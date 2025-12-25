# SEO 信息汇总

## 📋 目录
1. [全局 SEO 配置](#全局-seo-配置)
2. [页面级 SEO](#页面级-seo)
3. [SEO 工具函数](#seo-工具函数)
4. [搜索关键词系统](#搜索关键词系统)
5. [Sitemap 配置](#sitemap-配置)
6. [Robots.txt 配置](#robotstxt-配置)
7. [结构化数据](#结构化数据)
8. [SEO 文档](#seo-文档)

---

## 全局 SEO 配置

### 文件位置
`app/layout.tsx`

### 配置内容

```typescript
export const metadata: Metadata = {
  // 基础信息
  title: 'Cryptologo - Free Cryptocurrency Icon Library',
  description: 'Download free high-quality SVG and PNG cryptocurrency icons. Search and download Bitcoin, Ethereum, and thousands of crypto icons for your projects.',
  // 注意：Open Graph 和 Twitter Card 使用不同的标题和描述
  keywords: ['cryptocurrency icons', 'crypto icons', 'bitcoin icon', 'ethereum icon', 'free icons', 'SVG icons', 'PNG icons', 'crypto logo'],
  
  // 作者信息
  authors: [{ name: 'Cryptologo' }],
  creator: 'Cryptologo',
  publisher: 'Cryptologo',
  
  // 基础 URL
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptologo.org'),
  
  // Canonical URL
  alternates: {
    canonical: '/',
  },
  
  // Open Graph
  openGraph: {
    title: 'Free Official Cryptocurrency Icon Library',
    description: 'Download high-quality web3 SVG and PNG icons',
    url: '/',
    siteName: 'Cryptologo',
    images: [{
      url: '/logo-512.svg',
      width: 512,
      height: 512,
      alt: 'Cryptologo Logo',
    }],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Free Official Cryptocurrency Icon Library',
    description: 'Download high-quality web3 SVG and PNG icons',
    images: ['/logo-512.svg'],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
  },
  
  // 验证码（待配置）
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}
```

---

## 页面级 SEO

### 1. 图标详情页
**文件位置**: `app/icon/[id]/page.tsx`

**SEO 配置**:
- **Title**: `{代币名} ({缩写}) Logo .SVG and .PNG Files Free Download - Cryptologo`
- **Description**: `Free download {缩写} logo in multi-size formats. Official website: {官网}`
- **Keywords**: 包含代币名称、符号、标签等
- **Open Graph**: 完整配置，包含图片
- **Twitter Card**: 完整配置
- **Canonical URL**: `/icon/{id}`
- **Robots**: `index: true, follow: true`
- **结构化数据**: JSON-LD (ImageObject)

**示例**:
```typescript
{
  title: "Bitcoin (BTC) Logo .SVG and .PNG Files Free Download - Cryptologo",
  description: "Free download BTC logo in multi-size formats. Official website: https://bitcoin.org",
  keywords: "Bitcoin, BTC, Bitcoin logo, Bitcoin svg, Bitcoin png, BTC logo, cryptocurrency logo, crypto icon",
  openGraph: {
    title: "Bitcoin (BTC) Logo .SVG and .PNG Files Free Download - Cryptologo",
    description: "Free download BTC logo in multi-size formats. Official website: https://bitcoin.org",
    url: "https://cryptologo.org/icon/bitcoin",
    images: [{ url: "https://cryptologo.org/icons/svg/cryptocurrency/bitcoin.svg", alt: "Bitcoin logo" }]
  },
  twitter: {
    card: "summary",
    title: "Bitcoin (BTC) Logo .SVG and .PNG Files Free Download - Cryptologo",
    description: "Free download BTC logo in multi-size formats. Official website: https://bitcoin.org",
    images: ["https://cryptologo.org/icons/svg/cryptocurrency/bitcoin.svg"]
  }
}
```

### 2. 搜索页面
**文件位置**: `app/search/[query]/page.tsx`

**SEO 配置**:
- **Title**: 与图标详情页相同（如果匹配到图标）
- **Description**: 与图标详情页相同
- **Open Graph**: 完整配置
- **Twitter Card**: 完整配置
- **Canonical URL**: 重定向到 `/icon/{id}`（避免重复内容）
- **Robots**: `index: true, follow: true`

**支持的搜索格式**:
- `btc-logo-svg` → 重定向到 `/icon/bitcoin`
- `btc-logo` → 重定向到 `/icon/bitcoin`
- `btc-svg` → 重定向到 `/icon/bitcoin`
- `btc` → 重定向到 `/icon/bitcoin`
- `bitcoin-logo-svg` → 重定向到 `/icon/bitcoin`
- 等等...

---

## SEO 工具函数

### 文件位置
`lib/utils/seo-metadata.ts`

### 配置常量
```typescript
export const SEO_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptologo.org',
  siteName: 'Cryptologo',
  formatInfo: 'High quality raster (.PNG) and vector (.SVG) logo files',
}
```

### 核心函数

#### 1. `generateTitle(icon, includeFormat)`
生成标题
- **参数**:
  - `icon`: 图标对象
  - `includeFormat`: 是否包含格式信息（默认 true）
- **返回**: 
  - 完整格式: `Bitcoin (BTC) Logo .SVG and .PNG Files Free Download - Cryptologo`
  - 简短格式: `Bitcoin (BTC) Logo - Cryptologo`

#### 2. `generateDescription(icon)`
生成描述
- **格式**: `Free download {缩写} logo in multi-size formats. Official website: {官网}`
- **示例**: `Free download BTC logo in multi-size formats. Official website: https://bitcoin.org`

#### 3. `getIconUrl(iconId)`
生成图标页面 URL
- **格式**: `https://cryptologo.org/icon/{iconId}`
- **示例**: `https://cryptologo.org/icon/bitcoin`

#### 4. `getImageUrl(svgPath)`
生成图片 URL
- **格式**: `https://cryptologo.org{svgPath}`
- **示例**: `https://cryptologo.org/icons/svg/cryptocurrency/bitcoin.svg`

#### 5. `generateStructuredData(icon)`
生成结构化数据 (JSON-LD)
- **类型**: ImageObject
- **包含字段**:
  - `@context`: "https://schema.org"
  - `@type`: "ImageObject"
  - `name`: 代币名称和符号
  - `description`: 代币描述
  - `image`: 图片信息
  - `encodingFormat`: ["image/svg+xml", "image/png"]
  - `about`: 代币信息
  - `offers`: 免费下载信息
  - `mainEntityOfPage`: 官网链接（如果有）

---

## 搜索关键词系统

### 文件位置
`lib/utils/search-keywords.ts`

### 核心函数

#### 1. `generateSearchKeywords(icon)`
为单个图标生成所有搜索关键词

**生成的关键词类型**:
- 符号格式: `btc-logo-svg`, `btc-logo-png`, `btc-logo`, `btc-svg`, `btc-png`, `btc`
- 名称格式: `bitcoin-logo-svg`, `bitcoin-logo-png`, `bitcoin-logo`, `bitcoin-svg`, `bitcoin-png`, `bitcoin`
- ID 格式: `bitcoin-logo-svg`, `bitcoin-logo-png`, `bitcoin-logo`, `bitcoin`

**每个图标大约生成**: 5-8 个关键词

#### 2. `matchIconFromQuery(query, icons)`
从搜索查询中匹配图标

**匹配策略**:
- 完全匹配 symbol → 100 分
- 完全匹配 name → 90 分
- 完全匹配 id → 80 分
- 部分匹配 symbol → 70 分
- 部分匹配 name → 60 分
- 部分匹配 id → 50 分
- 包含 "logo" → +5 分
- 包含 "svg" 或 "png" → +5 分
- 根据 rank 调整分数

#### 3. `getAllSearchKeywords(icons)`
获取所有图标的搜索关键词映射

**用途**:
- 生成静态路由
- 生成 sitemap
- 避免重复关键词（优先选择 rank 更高的图标）

---

## Sitemap 配置

### 文件位置
`app/sitemap.ts`

### 配置内容

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cryptologo.org'
  
  return [
    // 主页
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // 所有图标页面
    {
      url: `${baseUrl}/icon/{iconId}`,
      lastModified: new Date(icon.addedDate),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // 所有搜索关键词页面
    {
      url: `${baseUrl}/search/{query}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
```

### 优先级
- **主页**: 1.0
- **图标页面**: 0.8
- **搜索关键词页面**: 0.7

### 更新频率
- **主页**: daily
- **图标页面**: weekly
- **搜索关键词页面**: monthly

---

## Robots.txt 配置

### 文件位置
`app/robots.ts`

### 配置内容

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://cryptologo.org/sitemap.xml',
  }
}
```

### 规则
- **允许**: 所有页面（除了 `/api/` 和 `/admin/`）
- **禁止**: `/api/`, `/admin/`
- **Sitemap**: `https://cryptologo.org/sitemap.xml`

---

## 结构化数据

### 类型
JSON-LD (ImageObject)

### 格式

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "name": "Bitcoin (BTC) Logo",
  "description": "Bitcoin cryptocurrency logo",
  "image": {
    "@type": "ImageObject",
    "url": "https://cryptologo.org/icons/svg/cryptocurrency/bitcoin.svg",
    "encodingFormat": "image/svg+xml",
    "contentUrl": "https://cryptologo.org/icons/svg/cryptocurrency/bitcoin.svg"
  },
  "encodingFormat": ["image/svg+xml", "image/png"],
  "about": {
    "@type": "Thing",
    "name": "Bitcoin",
    "alternateName": "BTC",
    "identifier": "BTC",
    "url": "https://bitcoin.org"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "url": "https://bitcoin.org"
  }
}
```

### 应用位置
- 图标详情页 (`app/icon/[id]/page.tsx`)
- 通过 `<script type="application/ld+json">` 标签注入

---

## SEO 文档

### 1. SEO格式规范.md
- 标题格式规范
- 描述格式规范
- URL 格式规范
- 结构化数据格式规范
- OpenGraph 格式规范
- Twitter Card 格式规范
- 格式检查清单

### 2. SEO搜索功能说明.md
- 搜索功能概述
- 支持的搜索格式
- 添加新代币时的处理
- 技术实现
- 匹配逻辑
- SEO 优化
- 测试方法
- 常见问题

---

## 环境变量

### NEXT_PUBLIC_SITE_URL
- **用途**: 网站基础 URL
- **默认值**: `https://cryptologo.org`
- **使用位置**:
  - `app/layout.tsx` (metadataBase)
  - `lib/utils/seo-metadata.ts` (SEO_CONFIG.baseUrl)
  - `app/sitemap.ts` (sitemap URLs)
  - `app/robots.ts` (sitemap URL)

---

## SEO 统计

### 当前配置
- **图标数量**: 167 个
- **搜索关键词数量**: 约 800-1300 个（每个图标 5-8 个）
- **Sitemap URL 数量**: 1 + 167 + 800-1300 = 约 1000-1500 个

### 页面类型
1. **主页**: 1 个
2. **图标详情页**: 167 个
3. **搜索关键词页**: 约 800-1300 个

---

## 最佳实践

### ✅ 已实现
- [x] 统一的标题格式
- [x] 统一的描述格式
- [x] Open Graph 标签
- [x] Twitter Card 标签
- [x] Canonical URL
- [x] 结构化数据 (JSON-LD)
- [x] Sitemap
- [x] Robots.txt
- [x] 动态搜索关键词生成
- [x] 智能搜索匹配

### 🔄 待优化
- [ ] Google Search Console 验证码配置
- [ ] 定期监控索引状态
- [ ] 分析搜索流量
- [ ] 优化关键词策略

---

## 相关文件清单

### 核心文件
- `app/layout.tsx` - 全局 SEO 配置
- `app/icon/[id]/page.tsx` - 图标详情页 SEO
- `app/search/[query]/page.tsx` - 搜索页面 SEO
- `lib/utils/seo-metadata.ts` - SEO 工具函数
- `lib/utils/search-keywords.ts` - 搜索关键词生成
- `app/sitemap.ts` - Sitemap 配置
- `app/robots.ts` - Robots.txt 配置

### 文档文件
- `SEO格式规范.md` - SEO 格式规范文档
- `SEO搜索功能说明.md` - 搜索功能说明文档
- `SEO信息汇总.md` - 本文档

---

**最后更新**: 2024-01-20

