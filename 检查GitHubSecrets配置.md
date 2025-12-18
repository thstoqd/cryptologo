# 检查 GitHub Secrets 配置指南

## 📋 步骤 1: 进入 GitHub Secrets 设置

1. 打开你的 GitHub 仓库：**https://github.com/thstoqd/cryptologo**
2. 点击仓库页面顶部的 **"Settings"**（设置）标签
3. 在左侧菜单中找到 **"Secrets and variables"** → **"Actions"**
4. 点击进入

## ✅ 步骤 2: 检查 COINMARKETCAP_API_KEY

在 **"Repository secrets"** 部分，检查是否存在：

- **Name**: `COINMARKETCAP_API_KEY`
- **Value**: `525341b59b8c4aa0bdd0a418a62b418c`（你的 API Key）

### 如果不存在：

1. 点击右上角的 **"New repository secret"** 按钮
2. 填写：
   - **Name**: `COINMARKETCAP_API_KEY`（必须完全一致，区分大小写）
   - **Secret**: `525341b59b8c4aa0bdd0a418a62b418c`（粘贴你的 API Key）
3. 点击 **"Add secret"** 保存

### 如果已存在：

1. 点击 `COINMARKETCAP_API_KEY` 这一行
2. 检查 Value 是否正确
3. 如果错误，点击 **"Update"** 更新

**⚠️ 注意**：
- Secret 名称必须完全一致：`COINMARKETCAP_API_KEY`（全大写，下划线分隔）
- Value 中不能有多余的空格或换行符
- 保存后无法再次查看 Value，只能更新或删除

## 🧪 步骤 3: 验证配置（手动触发测试）

### 方法 1: 通过 GitHub Actions 手动触发

1. 进入仓库的 **"Actions"** 标签页
2. 在左侧找到 **"更新代币排名"** workflow
3. 点击进入
4. 点击右侧的 **"Run workflow"** 下拉按钮
5. 选择分支（通常是 `main` 或 `master`）
6. 点击 **"Run workflow"** 按钮
7. 等待运行完成（通常 1-2 分钟）

### 方法 2: 查看运行日志

1. 在 Actions 页面，点击最新的运行记录
2. 查看运行日志，应该看到：
   ```
   ✅ 已加载 .env 文件 (1 个变量)
   开始更新代币排名...
   正在从 CoinMarketCap API 获取排名数据...
   ✅ 成功获取 5000 个代币的排名数据
   ...
   更新完成!
   ```

### 如果出现错误：

#### 错误 1: "错误: 未设置 COINMARKETCAP_API_KEY 环境变量"
- **原因**: GitHub Secrets 未配置或名称错误
- **解决**: 检查步骤 2，确保 Secret 名称完全一致

#### 错误 2: "API 错误: Invalid API Key"
- **原因**: API Key 无效或已过期
- **解决**: 
  1. 登录 https://coinmarketcap.com/api/
  2. 检查 API Key 状态
  3. 如果无效，重新生成并更新 GitHub Secret

#### 错误 3: "API 请求超时"
- **原因**: 网络问题（GitHub Actions 网络通常很稳定，很少出现）
- **解决**: 稍后重试，或检查 CoinMarketCap API 状态

## 📊 步骤 4: 验证更新结果

如果运行成功，检查：

1. **查看提交记录**：
   - 进入仓库的 **"Commits"** 标签
   - 应该看到新的提交：`chore: 自动更新代币排名 [skip ci]`

2. **检查数据文件**：
   - 打开 `data/icons-metadata.json`
   - 检查 `lastUpdated` 字段是否更新为最新时间
   - 检查各个代币的 `rank` 字段是否更新

## 🔄 步骤 5: 确认自动运行计划

检查 workflow 是否配置了自动运行：

1. 进入 `.github/workflows/update-ranks.yml` 文件
2. 确认有以下配置：
   ```yaml
   on:
     schedule:
       - cron: '0 0 * * *'  # 每天 UTC 00:00 (北京时间 08:00)
     workflow_dispatch:     # 允许手动触发
   ```

## ✅ 配置检查清单

- [ ] GitHub Secrets 中存在 `COINMARKETCAP_API_KEY`
- [ ] Secret 名称完全正确（全大写，下划线分隔）
- [ ] API Key 值正确（无多余空格）
- [ ] 手动触发 workflow 可以成功运行
- [ ] 运行日志显示成功获取排名数据
- [ ] 数据文件已更新（`lastUpdated` 和 `rank` 字段）

## 🆘 需要帮助？

如果遇到问题：
1. 截图 GitHub Secrets 页面（隐藏敏感信息）
2. 截图 GitHub Actions 运行日志
3. 检查 CoinMarketCap API 账户状态

## 📝 快速检查命令（本地）

如果你想在本地验证 API Key 是否有效（不依赖 GitHub）：

```powershell
# 使用 PowerShell 测试 API Key
$apiKey = "525341b59b8c4aa0bdd0a418a62b418c"
$headers = @{
    "X-CMC_PRO_API_KEY" = $apiKey
    "Accept" = "application/json"
}
try {
    $response = Invoke-WebRequest -Uri "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=1" -Headers $headers -TimeoutSec 10
    Write-Host "✅ API Key 有效！状态码: $($response.StatusCode)"
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "❌ API Key 无效或已过期"
    } else {
        Write-Host "⚠️  网络错误: $($_.Exception.Message)"
    }
}
```

