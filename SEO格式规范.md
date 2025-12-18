# SEO 格式规范文档

## 📋 概述

本文档定义了项目中所有 SEO metadata 的统一格式规范，确保所有页面使用一致的标题、描述和结构化数据格式。

## 🎯 统一格式规范

### 1. 标题格式

#### 完整标题（包含格式信息）
```
{代币名} ({缩写}) Logo .SVG and .PNG Files Download - Cryptologo
```

**示例：**
- `Bitcoin (BTC) Logo .SVG and .PNG Files Download - Cryptologo`
- `Ethereum (ETH) Logo .SVG and .PNG Files Download - Cryptologo`
- `Fantom (FTM) Logo .SVG and .PNG Files Download - Cryptologo`

#### 简短标题（不含格式信息）
```
{代币名} ({缩写}) Logo - Cryptologo
```

**使用场景：**
- 完整标题：用于页面 `<title>`、OpenGraph、Twitter Card
- 简短标题：用于某些特殊场景（如需要更简洁的显示）

### 2. 描述格式

#### 标准格式
```
High quality raster (.PNG) and vector (.SVG) logo files for {代币信息}. {描述}. Official website: {网址}. Free download.
```

**格式说明：**
- `{代币信息}`：如果 `description` 字段已包含代币名称，直接使用；否则添加 `{代币名} ({缩写}) cryptocurrency`
- `{描述}`：使用 `description` 字段的内容
- `{网址}`：如果存在 `website` 字段，则包含；否则省略

**示例：**
```
High quality raster (.PNG) and vector (.SVG) logo files for Bitcoin (BTC) - The first decentralized cryptocurrency. Official website: https://bitcoin.org. Free download.
```

### 3. URL 格式

#### 图标页面 URL
```
{baseUrl}/icon/{iconId}
```

**示例：**
- `https://cryptologo.org/icon/bitcoin`
- `https://cryptologo.org/icon/ethereum`

#### 搜索页面 URL
```
{baseUrl}/search/{query}
```

**示例：**
- `https://cryptologo.org/search/btc-logo-svg`
- `https://cryptologo.org/search/eth`

#### 图片 URL
```
{baseUrl}{svgPath}
```

**示例：**
- `https://cryptologo.org/icons/svg/cryptocurrency/bitcoin.svg`

### 4. 结构化数据 (JSON-LD)

#### 格式规范
```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "name": "{代币名} ({缩写}) Logo",
  "description": "{描述}",
  "image": {
    "@type": "ImageObject",
    "url": "{图片URL}",
    "encodingFormat": "image/svg+xml",
    "contentUrl": "{图片URL}"
  },
  "encodingFormat": ["image/svg+xml", "image/png"],
  "about": {
    "@type": "Thing",
    "name": "{代币名}",
    "alternateName": "{缩写}",
    "identifier": "{缩写或ID}",
    "url": "{官网URL}" // 如果存在
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "url": "{官网URL}"
  } // 如果存在官网
}
```

### 5. OpenGraph 格式

```typescript
{
  title: "{完整标题}",
  description: "{标准描述}",
  type: "website",
  url: "{图标页面URL}",
  images: [{
    url: "{图片URL}",
    alt: "{代币名} logo"
  }]
}
```

### 6. Twitter Card 格式

```typescript
{
  card: "summary",
  title: "{完整标题}",
  description: "{标准描述}",
  images: ["{图片URL}"]
}
```

## 🔧 实现方式

### 工具函数

所有格式生成逻辑已统一在 `lib/utils/seo-metadata.ts` 中：

- `generateTitle(icon, includeFormat)`: 生成标题
- `generateDescription(icon)`: 生成描述
- `getIconUrl(iconId)`: 生成图标页面 URL
- `getImageUrl(svgPath)`: 生成图片 URL
- `generateStructuredData(icon)`: 生成结构化数据

### 使用示例

```typescript
import {
  generateTitle,
  generateDescription,
  getIconUrl,
  getImageUrl,
  generateStructuredData,
} from '@/lib/utils/seo-metadata'

// 生成标题
const title = generateTitle(icon, true) // 完整标题
const titleShort = generateTitle(icon, false) // 简短标题

// 生成描述
const description = generateDescription(icon)

// 生成 URL
const iconUrl = getIconUrl(icon.id)
const imageUrl = getImageUrl(icon.svgPath)

// 生成结构化数据
const structuredData = generateStructuredData(icon)
```

## 📍 应用位置

### 1. 图标详情页 (`app/icon/[id]/page.tsx`)
- ✅ 使用统一工具函数生成所有 metadata
- ✅ 标题、描述、OpenGraph、Twitter Card 格式统一
- ✅ 结构化数据格式统一

### 2. 搜索页面 (`app/search/[query]/page.tsx`)
- ✅ 使用统一工具函数生成所有 metadata
- ✅ 与图标详情页格式完全一致
- ✅ 确保搜索结果展示一致

## ✅ 格式检查清单

每个页面的 SEO metadata 应包含：

- [ ] **标题格式正确**
  - 包含代币全称和缩写
  - 包含 `.SVG and .PNG Files Download`
  - 以 `- Cryptologo` 结尾

- [ ] **描述格式正确**
  - 以 `High quality raster (.PNG) and vector (.SVG) logo files` 开头
  - 包含代币信息
  - 包含代币描述
  - 包含官网（如果有）
  - 以 `Free download.` 结尾

- [ ] **URL 格式正确**
  - 使用统一的 `baseUrl`
  - 图标页面：`/icon/{id}`
  - 搜索页面：`/search/{query}`

- [ ] **OpenGraph 格式正确**
  - 使用完整标题
  - 包含图片和描述

- [ ] **Twitter Card 格式正确**
  - 使用完整标题
  - 包含图片和描述

- [ ] **结构化数据格式正确**
  - 包含所有必需字段
  - 格式符合 Schema.org 规范

## 🆕 添加新代币时

添加新代币时，只需确保 `data/icons-metadata.json` 中的字段正确：

```json
{
  "id": "token-id",
  "name": "Token Name",
  "symbol": "SYMBOL",
  "description": "Token description here", // 可选，建议包含代币名称
  "website": "https://token-website.com" // 可选
}
```

系统会自动：
- ✅ 生成统一格式的标题
- ✅ 生成统一格式的描述
- ✅ 生成统一格式的 URL
- ✅ 生成统一格式的结构化数据

## 📊 测试

运行测试脚本验证格式：

```bash
node scripts/test-seo-format.js
```

测试会检查：
- 标题格式是否正确
- 描述是否包含所有必需信息
- URL 格式是否正确
- 所有格式是否统一

## 🔄 更新历史

- **2024-01-XX**: 创建统一格式规范
- **2024-01-XX**: 提取工具函数到 `lib/utils/seo-metadata.ts`
- **2024-01-XX**: 统一图标详情页和搜索页面的格式

---

**注意**：所有格式生成逻辑已统一，修改格式时只需更新 `lib/utils/seo-metadata.ts` 文件即可。

