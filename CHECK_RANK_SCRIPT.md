# 检查排名更新脚本状态

## 🔍 问题诊断步骤

### 1. 检查 GitHub Secrets 配置

1. 打开 GitHub 仓库: https://github.com/thstoqd/cryptologo
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 确认是否存在 `COINMARKETCAP_API_KEY` secret
4. 如果不存在，点击 **New repository secret** 添加：
   - Name: `COINMARKETCAP_API_KEY`
   - Value: 你的 CoinMarketCap API Key

### 2. 检查 GitHub Actions 运行状态

1. 进入 GitHub 仓库的 **Actions** 标签页
2. 查看左侧是否有 **"更新代币排名"** workflow
3. 点击查看最近的运行记录
4. 检查是否有错误信息

### 3. 手动触发测试

1. 在 **Actions** 标签页，找到 **"更新代币排名"** workflow
2. 点击 **Run workflow** → **Run workflow** 手动触发
3. 查看运行日志，确认是否成功

### 4. 本地测试脚本

如果你想在本地测试脚本是否正常工作：

```powershell
# Windows PowerShell
$env:COINMARKETCAP_API_KEY="你的API_KEY"
node scripts/update-ranks.js
```

### 5. 检查常见问题

#### 问题 A: API Key 未配置
**症状**: GitHub Actions 日志显示 "错误: 未设置 COINMARKETCAP_API_KEY 环境变量"
**解决**: 按照步骤 1 配置 GitHub Secrets

#### 问题 B: API Key 无效
**症状**: 日志显示 "API 错误: Invalid API Key"
**解决**: 
- 检查 API Key 是否正确复制（没有多余空格）
- 确认 API Key 在 CoinMarketCap 中处于激活状态
- 检查 API Key 是否过期

#### 问题 C: 网络问题
**症状**: 日志显示 "网络请求失败" 或 "API 请求超时"
**解决**: 
- 检查 GitHub Actions 的网络连接
- 稍后重试

#### 问题 D: 没有排名更新
**症状**: 日志显示 "没有排名更新，跳过提交"
**解决**: 
- 这是正常的，说明所有代币的排名都没有变化
- 如果确认排名应该变化，检查代币的 `symbol` 字段是否正确

## 📊 验证脚本是否工作

检查 `data/icons-metadata.json` 文件：

1. 查看 `lastUpdated` 字段是否更新为最新时间
2. 查看各个代币的 `rank` 字段是否与 CoinMarketCap 一致

## 🔧 脚本改进

最新版本的脚本已经：
- ✅ 使用 Node.js 内置 `https` 模块（更兼容）
- ✅ 改进错误处理和日志输出
- ✅ 添加超时保护（30秒）
- ✅ 更详细的错误信息

## 📅 自动运行时间

脚本配置为每天 UTC 00:00（北京时间 08:00）自动运行。

如果需要修改时间，编辑 `.github/workflows/update-ranks.yml` 中的 cron 表达式。

