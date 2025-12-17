# 代币排名自动更新配置指南

本文档说明如何配置 CoinMarketCap API 自动更新代币排名。

## 📋 前置要求

1. CoinMarketCap API Key（免费版即可）
2. GitHub 仓库（已配置）
3. Cloudflare Pages（已配置自动部署）

## 🔑 步骤 1: 注册 CoinMarketCap API

1. 访问 https://coinmarketcap.com/api/
2. 点击 "Get Your API Key Now" 注册账号
3. 选择 **Basic 免费版**（每月 10,000 次调用，足够使用）
4. 创建 API Key 并复制保存

## ⚙️ 步骤 2: 配置 GitHub Secrets

1. 打开你的 GitHub 仓库
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 Secret：
   - **Name**: `COINMARKETCAP_API_KEY`
   - **Value**: 你从 CoinMarketCap 获取的 API Key
5. 点击 **Add secret** 保存

## ✅ 步骤 3: 验证配置

### 方法 1: 手动触发（推荐首次测试）

1. 进入 GitHub 仓库的 **Actions** 标签页
2. 在左侧找到 **"更新代币排名"** workflow
3. 点击 **Run workflow** → **Run workflow** 手动触发
4. 查看运行日志，确认是否成功

### 方法 2: 本地测试（可选）

如果你想在本地测试脚本：

```bash
# 设置环境变量（Windows PowerShell）
$env:COINMARKETCAP_API_KEY="你的API_KEY"

# 运行脚本
node scripts/update-ranks.js
```

## 📅 自动更新计划

- **默认时间**: 每天 UTC 00:00（北京时间 08:00）
- **更新频率**: 每日 1 次
- **触发部署**: 自动提交代码后，Cloudflare Pages 会自动检测并重新部署

## 🔍 工作原理

1. GitHub Actions 每天自动运行
2. 调用 CoinMarketCap API 获取最新排名
3. 通过代币 `symbol`（如 BTC、ETH）匹配并更新 `rank` 字段
4. 如果有更新，自动提交到 GitHub
5. Cloudflare Pages 检测到代码更新，自动重新部署

## ⚠️ 注意事项

1. **API 限制**: 免费版每月 10,000 次调用，每日约 333 次，完全够用
2. **未匹配的代币**: 如果某个代币在 CoinMarketCap 中找不到，会保留原有排名
3. **提交信息**: 自动提交会使用 `[skip ci]` 标签，避免无限循环
4. **错误处理**: 如果 API 调用失败，不会更新文件，保留原有数据

## 🐛 故障排除

### 问题 1: API Key 无效
- 检查 GitHub Secrets 中的 `COINMARKETCAP_API_KEY` 是否正确
- 确认 API Key 在 CoinMarketCap 中处于激活状态

### 问题 2: 找不到某些代币的排名
- 检查代币的 `symbol` 字段是否正确
- 某些代币可能在 CoinMarketCap 中不存在或已下架
- 这些代币会保留原有排名，不影响其他代币的更新

### 问题 3: GitHub Actions 没有运行
- 检查 workflow 文件 `.github/workflows/update-ranks.yml` 是否存在
- 确认仓库已启用 GitHub Actions
- 查看 Actions 标签页是否有错误信息

## 📝 修改更新时间

如果你想修改自动更新的时间，编辑 `.github/workflows/update-ranks.yml` 文件：

```yaml
schedule:
  - cron: '0 0 * * *'  # 修改这里的 cron 表达式
```

Cron 表达式格式：`分钟 小时 日 月 星期`
- 示例：`0 8 * * *` = 每天 UTC 08:00（北京时间 16:00）

## 📞 需要帮助？

如果遇到问题，请检查：
1. GitHub Actions 的运行日志
2. CoinMarketCap API 的使用情况
3. Cloudflare Pages 的部署日志

