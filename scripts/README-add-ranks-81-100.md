# 添加排名 81-100 代币说明

## 脚本功能

`scripts/add-ranks-81-100.js` 用于从 CoinMarketCap API 获取排名 81-100 的代币信息，并自动添加到 `data/icons-metadata.json`。

## 使用方法

```bash
node scripts/add-ranks-81-100.js
```

## 功能特点

1. **自动获取真实数据**：从 CoinMarketCap API 获取排名 81-100 的真实代币信息
2. **自动去重**：检查现有数据，跳过已存在的代币（通过 symbol 和 name 检查）
3. **占位符 logo**：使用占位符路径，不需要实际生成 SVG/PNG 文件
4. **自动排序**：按 rank 自动排序添加到数据文件

## 需要配置

确保 `.env` 文件中包含有效的 CoinMarketCap API Key：

```
COINMARKETCAP_API_KEY=你的API_KEY
```

## 如果遇到网络超时

如果脚本运行时出现 "API 请求超时" 错误，可能原因：

1. **网络连接问题**：检查网络连接是否正常
2. **防火墙/代理**：检查防火墙或代理设置是否阻止了 API 请求
3. **API 服务器响应慢**：CoinMarketCap API 服务器可能暂时响应慢

**解决方案**：
- 稍后重试
- 检查网络连接
- 如果使用代理，配置代理设置
- 或者手动从 CoinMarketCap 网站查看排名 81-100 的代币，然后手动添加到数据文件

## 生成的数据格式

每个新添加的代币包含以下信息：

- `id`: 基于代币名称生成的 ID（小写，用连字符分隔）
- `name`: 代币全名（从 CoinMarketCap 获取）
- `symbol`: 代币符号（从 CoinMarketCap 获取）
- `rank`: CoinMarketCap 排名（81-100）
- `website`: 官方网站链接（如果有）
- `svgPath` 和 `pngPath`: 占位符路径（需要后续添加实际文件）
- `color`: 占位符颜色 `#000000`（需要后续补充）
- `description`: 占位符描述 `[待补充描述]`（需要后续补充）

## 后续工作

添加代币后，需要手动补充：

1. **图标文件**：添加实际的 SVG 和 PNG 文件到对应路径
2. **颜色值**：更新代币的主要颜色（十六进制）
3. **描述信息**：补充完整的代币描述


