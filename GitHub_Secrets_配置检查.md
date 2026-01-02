# GitHub Secrets 配置检查

## 📋 当前配置状态

从你的截图看到：
- ✅ **Secret 名称正确**: `COINMARKETCAP_API_KEY`
- ✅ **Secret 已配置**: 存在于 Repository secrets 中
- ⚠️ **最后更新**: 2 周前

## 🔍 可能的问题

### 问题 1: API Key 可能已过期或无效

**症状**: 
- Workflow 运行失败
- 日志显示 "Invalid API Key" 或 "401 Unauthorized"

**检查方法**:
1. 登录 https://coinmarketcap.com/api/
2. 检查 API Key 状态：
   - 是否仍然激活？
   - 是否已过期？
   - 使用次数是否超限？

### 问题 2: API Key 格式问题

**可能原因**:
- 复制时包含多余空格
- 复制不完整
- 包含换行符

**检查方法**:
- 点击 Secret 的编辑按钮（铅笔图标）
- 查看完整内容，确认没有多余字符

### 问题 3: Secret 名称不匹配

**检查**: 
- ✅ 当前名称: `COINMARKETCAP_API_KEY`（正确）
- ✅ Workflow 中引用: `${{ secrets.COINMARKETCAP_API_KEY }}`（匹配）

## ✅ 配置验证步骤

### 步骤 1: 验证 API Key 是否有效

**在本地测试**（推荐）:

```powershell
# 设置环境变量（使用你的实际 API Key）
$env:COINMARKETCAP_API_KEY="你的API_KEY"

# 运行测试脚本
node scripts/test-api-key.js
```

**预期结果**:
- ✅ 如果看到 "API Key 有效！" → API Key 正常
- ❌ 如果看到 "API 错误 401" → API Key 无效，需要更新

### 步骤 2: 检查 GitHub Secrets 配置

1. **确认 Secret 名称**:
   - 必须是: `COINMARKETCAP_API_KEY`（全大写，下划线分隔）
   - 不能有空格或特殊字符

2. **确认 Secret 值**:
   - 点击编辑按钮（铅笔图标）
   - 查看完整内容
   - 确认没有多余空格或换行

3. **更新 Secret**（如果需要）:
   - 点击编辑按钮
   - 粘贴新的 API Key
   - 点击 "Update secret"

### 步骤 3: 手动触发 Workflow 测试

1. 进入 GitHub Actions 页面
2. 找到 "更新代币排名" workflow
3. 点击 "Run workflow" → "Run workflow"
4. 查看运行日志，检查：
   - 是否有 "✅ API Key 已设置" 的提示
   - 是否有 API 相关的错误

## 🔧 如果 API Key 无效

### 获取新的 API Key:

1. **访问**: https://coinmarketcap.com/api/
2. **登录**你的账户
3. **检查现有 API Key**:
   - 查看是否仍然有效
   - 检查使用情况
4. **如果无效，创建新的 API Key**:
   - 点击 "Create API Key"
   - 选择 "Basic" 免费版（每月 10,000 次调用）
   - 复制新的 API Key

### 更新 GitHub Secret:

1. 进入仓库 Settings → Secrets and variables → Actions
2. 找到 `COINMARKETCAP_API_KEY`
3. 点击编辑按钮（铅笔图标）
4. 粘贴新的 API Key
5. 点击 "Update secret"

## 📊 配置检查清单

- [ ] Secret 名称: `COINMARKETCAP_API_KEY`（完全匹配）
- [ ] Secret 值: 正确的 API Key（无多余空格）
- [ ] API Key 状态: 在 CoinMarketCap 中仍然有效
- [ ] 本地测试: `node scripts/test-api-key.js` 通过
- [ ] Workflow 测试: 手动触发成功运行

## 🚨 常见错误

### 错误 1: "Invalid API Key"
**原因**: API Key 无效或已过期
**解决**: 重新获取并更新 Secret

### 错误 2: "API Key 未设置"
**原因**: Secret 名称不匹配或未配置
**解决**: 检查 Secret 名称是否完全一致

### 错误 3: "429 Too Many Requests"
**原因**: API 调用次数超限
**解决**: 等待一段时间后重试，或升级 API 计划

## 💡 建议

1. **定期检查 API Key 状态**（每月一次）
2. **监控 API 使用情况**，避免超限
3. **如果 2 周前更新过**，建议验证是否仍然有效
4. **使用测试脚本验证**，而不是等待 workflow 失败

