# GitHub Actions Workflow 修复说明

## 🔍 发现的问题

从你的截图看到：
- ❌ 所有 workflow 运行都失败（红色 X）
- ⚠️ 运行时间很短（18-19秒），说明启动后很快失败
- 📅 所有运行都是 "Scheduled" 事件触发

## 🔧 已修复的问题

### 1. ✅ 添加了权限配置（关键修复）

**问题**: 缺少 `permissions: contents: write` 会导致无法提交更改

**修复**:
```yaml
permissions:
  contents: write
```

### 2. ✅ 移除了有问题的 token 配置

**问题**: `token: ${{ secrets.GITHUB_TOKEN }}` 可能导致权限问题

**修复**: 使用默认的 `GITHUB_TOKEN`（配合 `permissions` 配置）

### 3. ✅ 添加了详细的错误处理和日志

**新增**:
- API Key 验证步骤
- 更详细的错误信息
- 每个步骤的状态输出

### 4. ✅ 改进了提交逻辑

**改进**:
- 更清晰的错误提示
- 区分不同类型的失败（提交失败 vs 推送失败）

## 📋 当前 Workflow 配置（已修复）

```yaml
name: 更新代币排名

on:
  schedule:
    - cron: '0 0 * * *'  # 每天 UTC 00:00
  workflow_dispatch:      # 允许手动触发

jobs:
  update-ranks:
    runs-on: ubuntu-latest
    
    # ✅ 关键：添加写入权限
    permissions:
      contents: write
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 安装依赖
        run: npm ci

      - name: 更新代币排名
        env:
          COINMARKETCAP_API_KEY: ${{ secrets.COINMARKETCAP_API_KEY }}
        run: |
          echo "开始更新代币排名..."
          if [ -z "$COINMARKETCAP_API_KEY" ]; then
            echo "❌ 错误: COINMARKETCAP_API_KEY 未设置"
            exit 1
          fi
          echo "✅ API Key 已设置"
          node scripts/update-ranks.js

      - name: 检查是否有更改
        id: verify-changed
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            echo "changed=true" >> $GITHUB_OUTPUT
            echo "检测到文件更改"
            git status
          else
            echo "changed=false" >> $GITHUB_OUTPUT
            echo "没有文件更改"
          fi

      - name: 提交更改
        if: steps.verify-changed.outputs.changed == 'true'
        run: |
          echo "准备提交更改..."
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/icons-metadata.json
          git commit -m "chore: 自动更新代币排名 [skip ci]" || {
            echo "⚠️ 提交失败，可能没有实际更改"
            exit 0
          }
          git push origin HEAD:${{ github.ref }} || {
            echo "❌ 推送失败，检查权限配置"
            exit 1
          }
          echo "✅ 更改已成功提交并推送"

      - name: 输出结果
        if: steps.verify-changed.outputs.changed == 'false'
        run: echo "没有排名更新，跳过提交"
```

## 🚀 下一步操作

### 步骤 1: 确认 GitHub Secrets 配置

1. 进入仓库 Settings → Secrets and variables → Actions
2. 确认 `COINMARKETCAP_API_KEY` 存在且正确
3. 如果 API Key 是 2 周前更新的，可能需要验证是否仍然有效

### 步骤 2: 手动触发测试

1. 进入 Actions 标签页
2. 找到 "更新代币排名" workflow
3. 点击 "Run workflow" → "Run workflow"
4. **查看运行日志**，重点关注：
   - 是否有 "API Key 已设置" 的提示
   - 脚本执行到哪一步失败
   - 具体的错误信息

### 步骤 3: 检查运行日志

**关键检查点**:

1. **如果看到 "❌ 错误: COINMARKETCAP_API_KEY 未设置"**
   - 检查 GitHub Secrets 配置
   - 确认 Secret 名称完全一致（全大写）

2. **如果看到 "API 错误: Invalid API Key"**
   - API Key 可能已过期或无效
   - 需要重新获取并更新 Secret

3. **如果看到 "网络请求失败" 或超时**
   - 可能是 CoinMarketCap API 临时问题
   - 稍后重试

4. **如果脚本执行成功但没有更改**
   - 这是正常的，说明排名没有变化
   - 会显示 "没有排名更新，跳过提交"

5. **如果看到 "❌ 推送失败"**
   - 检查分支保护规则
   - 确认 workflow 有写入权限

## 🔍 常见失败原因

### 原因 1: API Key 未配置或无效
**症状**: 日志显示 "未设置 COINMARKETCAP_API_KEY" 或 "Invalid API Key"
**解决**: 检查并更新 GitHub Secrets

### 原因 2: 权限不足
**症状**: 推送失败，提示权限错误
**解决**: 确认 workflow 有 `contents: write` 权限

### 原因 3: 分支保护规则
**症状**: 推送被拒绝
**解决**: 在分支保护规则中允许 GitHub Actions 提交

### 原因 4: 脚本执行错误
**症状**: Node.js 脚本报错
**解决**: 查看详细错误日志，可能是 API 问题或网络问题

## 📊 验证修复

运行诊断脚本：
```bash
node scripts/check-update-status.js
```

**成功标志**:
- ✅ Workflow 运行成功（绿色 ✓）
- ✅ `lastUpdated` 字段更新为最新时间
- ✅ 代币排名与 CoinMarketCap 一致

## 💡 建议

1. **先手动触发一次测试**，查看完整日志
2. **如果 API Key 是 2 周前设置的**，建议验证是否仍然有效
3. **检查 CoinMarketCap API 使用情况**，确认没有超出限制

