# SEO 动态搜索功能说明

## 📋 功能概述

系统已实现 SEO 友好的动态搜索功能，支持用户通过多种关键词搜索代币图标：

- `btc logo svg` → 重定向到 Bitcoin 图标页面
- `btc logo` → 重定向到 Bitcoin 图标页面
- `btc png` → 重定向到 Bitcoin 图标页面
- `eth` → 重定向到 Ethereum 图标页面
- `ethereum svg` → 重定向到 Ethereum 图标页面

## 🔍 支持的搜索格式

系统会自动为每个图标生成以下类型的搜索关键词：

1. **符号格式**：
   - `{symbol}-logo-svg` (如 `btc-logo-svg`)
   - `{symbol}-logo-png` (如 `btc-logo-png`)
   - `{symbol}-logo` (如 `btc-logo`)
   - `{symbol}-svg` (如 `btc-svg`)
   - `{symbol}-png` (如 `btc-png`)
   - `{symbol}` (如 `btc`)

2. **名称格式**（如果名称与符号不同）：
   - `{name}-logo-svg` (如 `bitcoin-logo-svg`)
   - `{name}-logo-png` (如 `bitcoin-logo-png`)
   - `{name}-logo` (如 `bitcoin-logo`)
   - `{name}-svg` (如 `bitcoin-svg`)
   - `{name}-png` (如 `bitcoin-png`)
   - `{name}` (如 `bitcoin`)

3. **ID 格式**（如果 ID 与名称/符号不同）：
   - `{id}-logo-svg`
   - `{id}-logo-png`
   - `{id}-logo`
   - `{id}`

## 🆕 添加新代币时的处理

### 自动处理

**好消息：添加新代币时，搜索关键词会自动生成！**

当你添加新代币到 `data/icons-metadata.json` 时：

1. **无需手动配置搜索关键词**
   - 系统会根据代币的 `symbol`、`name` 和 `id` 自动生成所有搜索关键词
   - 在构建时（`npm run build`），`generateStaticParams()` 会自动为所有图标生成搜索路由

2. **自动更新 Sitemap**
   - 所有搜索关键词会自动添加到 `sitemap.xml`
   - 搜索引擎可以自动发现和索引这些页面

3. **自动 SEO 优化**
   - 每个搜索关键词页面都有独立的 SEO metadata
   - 包含 title、description、Open Graph 标签等

### 添加新代币的步骤

1. **编辑 `data/icons-metadata.json`**：
   ```json
   {
     "id": "new-token",
     "name": "New Token",
     "symbol": "NEW",
     "category": "cryptocurrency",
     "tags": ["cryptocurrency", "new-token", "new"],
     "svgPath": "/icons/svg/cryptocurrency/new-token.svg",
     "pngPath": "/icons/png/cryptocurrency/new-token",
     "sizes": [32, 64, 128],
     "addedDate": "2024-01-15",
     "color": "#FF0000",
     "description": "New Token (NEW) - Description here",
     "website": "https://newtoken.org",
     "rank": 100
   }
   ```

2. **重新构建项目**：
   ```bash
   npm run build
   ```

3. **完成！**
   - 系统会自动生成以下搜索路由：
     - `/search/new-logo-svg`
     - `/search/new-logo-png`
     - `/search/new-logo`
     - `/search/new-svg`
     - `/search/new-png`
     - `/search/new`
     - `/search/new-token-logo-svg`
     - `/search/new-token-logo-png`
     - 等等...

## 🔧 技术实现

### 文件结构

```
lib/utils/
  search-keywords.ts          # 搜索关键词生成和匹配逻辑

app/search/
  [query]/
    page.tsx                  # 搜索路由页面（自动生成静态路由）

app/icon/
  [id]/
    page.tsx                  # 图标详情页（已添加 SEO metadata）

app/
  sitemap.ts                  # Sitemap（包含所有搜索关键词）
```

### 核心函数

1. **`generateSearchKeywords(icon)`**
   - 为单个图标生成所有可能的搜索关键词
   - 返回关键词数组

2. **`matchIconFromQuery(query, icons)`**
   - 从搜索查询中匹配对应的图标
   - 支持模糊匹配和优先级排序

3. **`getAllSearchKeywords(icons)`**
   - 获取所有图标的搜索关键词映射
   - 用于生成静态路由和 sitemap

### 匹配逻辑

搜索匹配使用智能评分系统：

1. **完全匹配**（最高优先级）：
   - 查询完全匹配 symbol → 100 分
   - 查询完全匹配 name → 90 分
   - 查询完全匹配 id → 80 分

2. **部分匹配**：
   - 查询包含 symbol → 70 分
   - 查询包含 name → 60 分
   - 查询包含 id → 50 分

3. **额外加分**：
   - 查询包含 "logo" → +5 分
   - 查询包含 "svg" 或 "png" → +5 分
   - 根据 rank 调整（rank 越小越好）

4. **返回结果**：
   - 选择分数最高的图标
   - 如果匹配到，重定向到图标详情页
   - 如果未匹配到，显示 404 页面

## 📊 SEO 优化

### 搜索页面 SEO

每个搜索关键词页面都包含：

- **Title**: `{Icon Name} ({Symbol}) Logo SVG/PNG Download - Cryptologo`
- **Description**: 包含图标描述和下载信息
- **Open Graph**: 社交媒体分享优化
- **Canonical URL**: 指向实际图标页面（避免重复内容）
- **Robots**: `index: true, follow: true`

### Sitemap 配置

- **主页**: priority 1.0
- **图标页面**: priority 0.8
- **搜索关键词页面**: priority 0.7

### 结构化数据

图标详情页包含 JSON-LD 结构化数据：

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "name": "Bitcoin Logo",
  "description": "Bitcoin cryptocurrency logo",
  "image": "/icons/svg/cryptocurrency/bitcoin.svg",
  "encodingFormat": "image/svg+xml"
}
```

## 🧪 测试搜索功能

### 本地测试

1. **构建项目**：
   ```bash
   npm run build
   ```

2. **启动预览**：
   ```bash
   npm run start
   ```

3. **测试搜索路由**：
   - 访问 `http://localhost:3000/search/btc-logo-svg`
   - 应该重定向到 `/icon/bitcoin`
   - 访问 `http://localhost:3000/search/eth`
   - 应该重定向到 `/icon/ethereum`

### 验证 Sitemap

访问 `http://localhost:3000/sitemap.xml`，应该看到：

- 主页 URL
- 所有图标页面 URL
- 所有搜索关键词 URL

## 📝 注意事项

1. **关键词去重**：
   - 如果多个图标生成相同的搜索关键词，系统会选择 rank 更高的图标
   - 例如：如果两个图标都有 symbol "BTC"，rank 1 的图标会优先

2. **性能考虑**：
   - 每个图标大约生成 5-8 个搜索关键词
   - 如果有 100 个图标，大约生成 500-800 个搜索路由
   - 静态生成，性能不受影响

3. **大小写不敏感**：
   - 搜索匹配不区分大小写
   - `BTC`、`btc`、`Btc` 都会匹配到相同的图标

4. **连字符处理**：
   - 系统会自动处理连字符、下划线和空格
   - `btc logo svg`、`btc-logo-svg`、`btc_logo_svg` 都会匹配

## 🚀 部署后

部署到生产环境后：

1. **提交 Sitemap**：
   - 在 Google Search Console 提交 `https://yourdomain.com/sitemap.xml`
   - 在 Bing Webmaster Tools 提交 sitemap

2. **监控索引**：
   - 定期检查搜索关键词页面是否被索引
   - 使用 `site:yourdomain.com/search/btc-logo-svg` 搜索

3. **分析搜索流量**：
   - 监控哪些搜索关键词带来流量
   - 根据数据优化关键词生成策略

## ❓ 常见问题

**Q: 如果我想为某个图标添加自定义搜索关键词怎么办？**

A: 目前系统自动生成所有关键词。如果需要自定义，可以修改 `lib/utils/search-keywords.ts` 中的 `generateSearchKeywords` 函数。

**Q: 搜索关键词太多会影响构建时间吗？**

A: 不会。静态生成在构建时一次性完成，不会影响运行时性能。

**Q: 如何查看某个图标生成了哪些搜索关键词？**

A: 可以在 `lib/utils/search-keywords.ts` 中添加调试代码，或查看构建后的 `.next` 目录。

---

**总结**：添加新代币时，只需更新 `icons-metadata.json`，系统会自动处理所有搜索相关的配置！🎉

