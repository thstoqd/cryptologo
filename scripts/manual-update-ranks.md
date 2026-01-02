# 手动更新排名指南

如果 GitHub Actions 没有更新排名，可以手动运行更新脚本：

## 步骤 1: 设置 API Key

```powershell
# Windows PowerShell
$env:COINMARKETCAP_API_KEY="你的API_KEY"
```

## 步骤 2: 运行更新脚本

```bash
node scripts/update-ranks.js
```

## 步骤 3: 检查更新结果

脚本会显示：
- 成功更新了多少个代币
- 每个代币的排名变化（如：更新 Zcash (ZEC): 17 → 14）

## 步骤 4: 提交更改

如果看到排名更新了：

```bash
git add data/icons-metadata.json
git commit -m "chore: 更新代币排名"
git push
```

## 步骤 5: 等待 Cloudflare Pages 部署

- 推送后，Cloudflare Pages 会自动检测并重新部署
- 通常需要 2-5 分钟
- 部署完成后，网站上的排名就会更新

