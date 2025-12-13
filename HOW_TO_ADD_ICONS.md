# 如何替换和添加图标

## 📁 文件目录结构

```
public/icons/
├── svg/
│   ├── cryptocurrency/
│   │   ├── bitcoin.svg          # SVG 文件
│   │   └── ethereum.svg
│   ├── chain/
│   ├── defi/
│   └── ... (其他分类)
└── png/
    ├── cryptocurrency/
    │   ├── bitcoin/
    │   │   ├── 32.png           # PNG 文件（只保留尺寸数字）
    │   │   ├── 64.png
    │   │   └── 128.png
    │   └── ethereum/
    │       └── ...
    └── ... (其他分类)
```

---

## 🔄 方法一：替换现有图标（以 Bitcoin 为例）

### 步骤 1：准备文件

确保你有以下文件：
- `bitcoin.svg` - SVG 格式图标
- `bitcoin-32.png`, `bitcoin-64.png`, `bitcoin-128.png` - PNG 格式图标（32px, 64px, 128px）

### 步骤 2：替换 SVG 文件

将你的 `bitcoin.svg` 文件复制到：
```
public/icons/svg/cryptocurrency/bitcoin.svg
```
**直接覆盖**现有的占位符文件即可。

### 步骤 3：替换 PNG 文件

1. 确保目录存在：`public/icons/png/cryptocurrency/bitcoin/`
2. 将你的 PNG 文件重命名（**只保留尺寸数字**）：
   - `bitcoin-32.png` → `32.png`
   - `bitcoin-64.png` → `64.png`
   - `bitcoin-128.png` → `128.png`
3. 将所有重命名后的文件放入：`public/icons/png/cryptocurrency/bitcoin/`

### 步骤 4：验证元数据（可选）

打开 `data/icons-metadata.json`，找到 Bitcoin 的配置，确认路径正确：

```json
{
  "id": "bitcoin",
  "name": "Bitcoin",
  "category": "cryptocurrency",
  "svgPath": "/icons/svg/cryptocurrency/bitcoin.svg",
  "pngPath": "/icons/png/cryptocurrency/bitcoin",
  "sizes": [32, 64, 128]
}
```

**注意**：如果只是替换文件，元数据不需要修改。

### 完成！

刷新浏览器，Bitcoin 图标应该已经更新了。

---

## ➕ 方法二：添加新代币图标（以 Solana 为例）

### 步骤 1：确定分类

首先确定新代币属于哪个分类：
- `cryptocurrency` - 加密货币
- `chain` - 区块链网络
- `defi` - DeFi 协议
- `exchange` - 交易所
- `wallet` - 钱包
- `layer-2` - Layer 2
- `stablecoin` - 稳定币
- `meme-coin` - Meme 币
- `infrastructure` - 基础设施
- `other` - 其他

**示例**：Solana 属于 `cryptocurrency` 分类

### 步骤 2：准备文件

确保你有：
- `solana.svg` - SVG 格式
- `solana-32.png`, `solana-64.png`, `solana-128.png` - PNG 格式（32px, 64px, 128px）

### 步骤 3：创建目录结构（如果不存在）

```bash
# SVG 目录（通常已存在）
public/icons/svg/cryptocurrency/

# PNG 目录（需要创建）
public/icons/png/cryptocurrency/solana/
```

### 步骤 4：放置 SVG 文件

将 `solana.svg` 放入：
```
public/icons/svg/cryptocurrency/solana.svg
```

### 步骤 5：放置 PNG 文件

1. 创建目录：`public/icons/png/cryptocurrency/solana/`
2. 将 PNG 文件重命名（**只保留尺寸数字**）：
   - `solana-32.png` → `32.png`
   - `solana-64.png` → `64.png`
   - `solana-128.png` → `128.png`
3. 将所有文件放入：`public/icons/png/cryptocurrency/solana/`

### 步骤 6：更新元数据 JSON

打开 `data/icons-metadata.json`，在 `icons` 数组中添加新条目：

```json
{
  "id": "solana",
  "name": "Solana",
  "symbol": "SOL",
  "category": "cryptocurrency",
  "tags": ["cryptocurrency", "blockchain", "sol", "solana"],
  "svgPath": "/icons/svg/cryptocurrency/solana.svg",
  "pngPath": "/icons/png/cryptocurrency/solana",
  "sizes": [32, 64, 128],
  "addedDate": "2024-01-20",
  "popularity": 80,
  "color": "#14F195",
  "description": "Solana (SOL) - High-performance blockchain"
}
```

**字段说明**：
- `id`: 唯一标识符（小写，使用连字符，如 `solana`, `binance-coin`）
- `name`: 显示名称（如 `Solana`, `Binance Coin`）
- `symbol`: **代币缩写（可选但推荐）**，如 `BTC`, `ETH`, `SOL`。用于支持缩写搜索（用户输入 `btc` 可以找到 `Bitcoin`）
- `category`: 分类 ID（必须是 `categories` 数组中存在的 ID）
- `tags`: 标签数组（用于搜索和筛选）
- `svgPath`: SVG 文件路径（以 `/icons/` 开头）
- `pngPath`: PNG 目录路径（不含文件名，以 `/icons/` 开头）
- `sizes`: 可用的 PNG 尺寸数组
- `addedDate`: 添加日期（格式：`YYYY-MM-DD`）
- `color`: 主题色（十六进制颜色代码）
- `description`: 描述信息
- `website`: **官方网址（可选）**，如 `https://bitcoin.org`。如果提供，会在图标详情页显示

**搜索功能说明**：
- 支持名称搜索：输入 `bitcoin` 或 `Bitcoin` 都可以找到
- 支持缩写搜索：输入 `btc` 或 `BTC` 可以找到 `Bitcoin`
- 支持模糊搜索：输入部分名称或缩写即可匹配
- 不区分大小写：`BTC`、`btc`、`Btc` 效果相同

### 步骤 7：保存并测试

1. 保存 `icons-metadata.json`
2. 重启开发服务器（如果正在运行）：
   ```bash
   # 停止当前服务器（Ctrl+C）
   yarn dev
   ```
3. 刷新浏览器，新图标应该出现在列表中

---

## 📝 完整示例：添加 Cardano

### 文件结构

```
public/icons/
├── svg/
│   └── cryptocurrency/
│       └── cardano.svg                    # ✅ 放置 SVG
└── png/
    └── cryptocurrency/
        └── cardano/
            ├── 16.png                     # ✅ 重命名并放置
            ├── 24.png
            ├── 32.png
            ├── 48.png
            ├── 64.png
            ├── 128.png
            └── 256.png
```

### 元数据条目

在 `data/icons-metadata.json` 的 `icons` 数组中添加：

```json
{
  "id": "cardano",
  "name": "Cardano",
  "symbol": "ADA",
  "category": "cryptocurrency",
  "tags": ["cryptocurrency", "blockchain", "ada", "cardano"],
  "svgPath": "/icons/svg/cryptocurrency/cardano.svg",
  "pngPath": "/icons/png/cryptocurrency/cardano",
  "sizes": [32, 64, 128],
  "addedDate": "2024-01-20",
  "popularity": 75,
  "color": "#0033AD",
  "description": "Cardano (ADA) - Third-generation blockchain platform"
}
```

---

## ⚠️ 重要提示

### 文件命名规则

1. **SVG 文件**：使用完整名称
   - ✅ `bitcoin.svg`
   - ✅ `solana.svg`
   - ❌ `BTC.svg`（避免使用缩写）

2. **PNG 文件**：只保留尺寸数字
   - ✅ `16.png`, `24.png`, `32.png`
   - ❌ `bitcoin-16.png`（不要包含图标名称）
   - ❌ `16px.png`（不要包含单位）

3. **目录名称**：使用小写，连字符分隔
   - ✅ `bitcoin`, `binance-coin`, `layer-zero`
   - ❌ `Bitcoin`, `BinanceCoin`, `Layer Zero`

### ID 命名规则

- 使用小写字母
- 多个单词用连字符分隔
- 保持简洁和一致
- 示例：`bitcoin`, `ethereum`, `binance-coin`, `layer-zero`

### 路径规则

- 所有路径以 `/icons/` 开头
- SVG 路径包含文件名：`/icons/svg/cryptocurrency/bitcoin.svg`
- PNG 路径不包含文件名：`/icons/png/cryptocurrency/bitcoin`

---

## 🔍 验证清单

添加/替换图标后，检查：

- [ ] SVG 文件已放置在正确位置
- [ ] PNG 文件已重命名（只保留尺寸数字）
- [ ] PNG 文件已放置在正确的子目录中
- [ ] 元数据 JSON 格式正确（可以用 JSON 验证器检查）
- [ ] `id` 字段唯一（不与现有图标重复）
- [ ] `category` 字段对应正确的分类 ID
- [ ] `sizes` 数组包含所有可用的 PNG 尺寸
- [ ] 文件路径与元数据中的路径匹配

---

## 🚀 快速命令（可选）

如果你使用命令行，可以快速创建目录：

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Path "public/icons/png/cryptocurrency/solana" -Force

# Mac/Linux
mkdir -p public/icons/png/cryptocurrency/solana
```

---

## 💡 提示

1. **批量添加**：可以一次性添加多个图标，然后统一更新元数据 JSON
2. **备份**：修改元数据前建议先备份 `icons-metadata.json`
3. **测试**：每次添加后测试下载功能是否正常
4. **排序**：`popularity` 值高的图标会排在前面（Popular 排序时）

