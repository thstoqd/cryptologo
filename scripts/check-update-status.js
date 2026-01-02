/**
 * 检查排行榜更新状态诊断脚本
 * 用于诊断为什么排行榜没有自动更新
 */

const fs = require('fs');
const path = require('path');

const METADATA_FILE = path.join(__dirname, '..', 'data', 'icons-metadata.json');

console.log('🔍 排行榜更新状态诊断\n');

// 1. 检查文件是否存在
if (!fs.existsSync(METADATA_FILE)) {
  console.error('❌ 错误: icons-metadata.json 文件不存在');
  process.exit(1);
}

// 2. 读取并解析文件
let metadata;
try {
  const fileContent = fs.readFileSync(METADATA_FILE, 'utf8');
  metadata = JSON.parse(fileContent);
} catch (error) {
  console.error('❌ 错误: 无法解析 JSON 文件:', error.message);
  process.exit(1);
}

// 3. 检查 lastUpdated 字段
console.log('📅 最后更新时间:');
if (metadata.lastUpdated) {
  const lastUpdated = new Date(metadata.lastUpdated);
  const now = new Date();
  const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((now - lastUpdated) / (1000 * 60 * 60));
  
  console.log(`   时间: ${metadata.lastUpdated}`);
  console.log(`   距离现在: ${diffDays} 天 ${diffHours % 24} 小时`);
  
  if (diffDays > 1) {
    console.log('   ⚠️  警告: 数据超过 1 天未更新，可能存在问题');
  } else {
    console.log('   ✅ 数据较新');
  }
} else {
  console.log('   ⚠️  警告: 缺少 lastUpdated 字段');
}

// 4. 检查是否有 rank 字段的代币
console.log('\n📊 代币排名统计:');
const iconsWithRank = metadata.icons.filter(icon => icon.rank !== undefined && icon.rank !== null);
const iconsWithoutRank = metadata.icons.filter(icon => icon.rank === undefined || icon.rank === null);

console.log(`   有排名的代币: ${iconsWithRank.length}`);
console.log(`   无排名的代币: ${iconsWithoutRank.length}`);
console.log(`   总代币数: ${metadata.icons.length}`);

// 5. 检查前 10 个代币的排名
console.log('\n🏆 前 10 名代币排名:');
const sortedIcons = [...metadata.icons]
  .filter(icon => icon.rank !== undefined && icon.rank !== null)
  .sort((a, b) => a.rank - b.rank)
  .slice(0, 10);

sortedIcons.forEach(icon => {
  console.log(`   ${icon.rank}. ${icon.name} (${icon.symbol})`);
});

// 6. 检查 GitHub Actions workflow 文件
console.log('\n🔧 GitHub Actions 配置检查:');
const workflowFile = path.join(__dirname, '..', '.github', 'workflows', 'update-ranks.yml');
if (fs.existsSync(workflowFile)) {
  console.log('   ✅ workflow 文件存在');
  const workflowContent = fs.readFileSync(workflowFile, 'utf8');
  
  // 检查是否有 schedule
  if (workflowContent.includes('schedule:')) {
    console.log('   ✅ 已配置定时任务');
    const cronMatch = workflowContent.match(/cron:\s*['"]([^'"]+)['"]/);
    if (cronMatch) {
      console.log(`   📅 Cron 表达式: ${cronMatch[1]}`);
    }
  } else {
    console.log('   ⚠️  警告: 未找到定时任务配置');
  }
  
  // 检查是否有 permissions
  if (workflowContent.includes('permissions:')) {
    console.log('   ✅ 已配置权限');
  } else {
    console.log('   ⚠️  警告: 未找到权限配置，可能导致无法提交更改');
  }
  
  // 检查是否有 COINMARKETCAP_API_KEY
  if (workflowContent.includes('COINMARKETCAP_API_KEY')) {
    console.log('   ✅ 已配置 API Key 引用');
  } else {
    console.log('   ⚠️  警告: 未找到 API Key 配置');
  }
} else {
  console.log('   ❌ workflow 文件不存在');
}

// 7. 检查环境变量（如果设置了）
console.log('\n🔑 环境变量检查:');
if (process.env.COINMARKETCAP_API_KEY) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  console.log(`   ✅ COINMARKETCAP_API_KEY 已设置`);
  console.log(`   Key 预览: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
} else {
  console.log('   ⚠️  COINMARKETCAP_API_KEY 未设置（本地环境）');
  console.log('   💡 提示: 在 GitHub Secrets 中需要配置此变量');
}

// 8. 总结和建议
console.log('\n📋 诊断总结:');
console.log('   1. 检查 GitHub Actions 是否正常运行:');
console.log('      - 访问 https://github.com/YOUR_USERNAME/YOUR_REPO/actions');
console.log('      - 查看 "更新代币排名" workflow 的运行历史');
console.log('      - 检查是否有错误或失败');
console.log('');
console.log('   2. 检查 GitHub Secrets 配置:');
console.log('      - 进入 Settings → Secrets and variables → Actions');
console.log('      - 确认 COINMARKETCAP_API_KEY 已正确配置');
console.log('');
console.log('   3. 检查仓库权限:');
console.log('      - 确认 workflow 有 contents: write 权限');
console.log('      - 如果主分支受保护，需要配置允许 workflow 提交');
console.log('');
console.log('   4. 手动触发测试:');
console.log('      - 在 GitHub Actions 页面点击 "Run workflow"');
console.log('      - 查看运行日志，确认是否有错误');

