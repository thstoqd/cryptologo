# 网站 Logo 放置指南

## 📍 Logo 文件位置

网站 logo 文件应该放在 `public/` 目录下：

```
public/
├── logo.svg              # 主 Logo（SVG 格式，用于 Header）
├── logo-512.svg         # 大尺寸 Logo（512x512，用于 Open Graph、Twitter Card）
├── favicon.ico           # 浏览器图标（用于浏览器标签页）
└── ...
```

**注意**：
- `favicon.ico` 已添加，浏览器会自动使用
- 如果需要 PNG 格式用于社交媒体，可以创建 `logo-512.png`（512x512px）

## 📁 当前占位符 Logo

我已经创建了占位符 logo 文件：

1. **`public/logo.svg`** - 主 Logo（SVG 格式）
   - 用于网站 Header
   - 矢量格式，任意缩放不失真
   - 推荐尺寸：64x64 或更大

2. **`public/logo-512.svg`** - 大尺寸 Logo（512x512px SVG）
   - 用于 Open Graph（社交媒体分享）
   - 用于 Twitter Card
   - 用于 Apple Touch Icon
   - 如果需要 PNG 格式，可以创建 `logo-512.png`（512x512px）

3. **`public/favicon.ico`** - 浏览器图标
   - 用于浏览器标签页图标
   - 传统格式，兼容所有浏览器
   - 推荐尺寸：16x16, 32x32, 48x48（多尺寸ICO文件）

## 🔄 替换 Logo 步骤

### 步骤 1：准备 Logo 文件

准备以下文件：
- **logo.svg** - SVG 格式的主 Logo（推荐尺寸：64x64 或更大）
- **logo-512.png** - PNG 格式，512x512px（用于社交媒体）

### 步骤 2：替换文件

直接替换以下文件：
```
public/logo.svg          → 替换为你的 SVG Logo（推荐 64x64 或更大）
public/logo-512.svg      → 替换为你的 512x512 SVG Logo
```

**可选**：如果需要 PNG 格式用于社交媒体：
```
public/logo-512.png      → 创建 512x512 PNG Logo（可选）
```

## 🎨 Logo 设计建议

### SVG Logo 要求：
- **尺寸**：建议 64x64 或更大（可以缩放）
- **格式**：SVG 格式
- **颜色**：建议使用品牌主色
- **背景**：透明或纯色背景

### PNG Logo 要求：
- **尺寸**：512x512px（用于社交媒体）
- **格式**：PNG 格式，支持透明背景
- **质量**：高质量，清晰可见

## 📱 Logo 使用位置

Logo 会在以下位置显示：

1. **网站 Header**（左上角）
   - 文件：`public/logo.svg`
   - 显示尺寸：32x32px（h-8 w-8）

2. **浏览器标签页图标**（Favicon）
   - 文件：`public/favicon.ico`（优先）或 `public/logo.svg`
   - 显示尺寸：16x16px 或 32x32px
   - 已配置，浏览器会自动使用

3. **社交媒体分享**（Open Graph）
   - 文件：`public/logo-512.png`
   - 显示尺寸：512x512px

4. **移动设备主屏幕图标**（Apple Touch Icon）
   - 文件：`public/logo-512.png`
   - 显示尺寸：512x512px

## 🔍 SEO 配置

Logo 已集成到 SEO 配置中：

- ✅ Open Graph 图片
- ✅ Twitter Card 图片
- ✅ Favicon 配置
- ✅ Apple Touch Icon

所有配置在 `app/layout.tsx` 中，无需额外修改。

## 📝 注意事项

1. **文件命名**：保持文件名不变（`logo.svg`, `logo-512.png`）
2. **文件格式**：SVG 推荐用于主 Logo，PNG 用于社交媒体
3. **文件大小**：SVG 应尽量优化，PNG 建议压缩
4. **透明背景**：推荐使用透明背景，适配不同主题

## 🛠️ Logo 优化工具

推荐使用以下工具优化 Logo：

- **SVG 优化**：SVGO (https://jakearchibald.github.io/svgomg/)
- **PNG 压缩**：TinyPNG (https://tinypng.com/)
- **Favicon 生成**：Favicon Generator (https://realfavicongenerator.net/)

---

**当前状态**：已使用占位符 Logo，你可以随时替换为实际 Logo 文件。

