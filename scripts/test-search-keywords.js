/**
 * 测试搜索关键词生成功能
 * 运行: node scripts/test-search-keywords.js
 */

const iconsMetadata = require('../data/icons-metadata.json')

// 模拟搜索关键词生成函数
function generateSearchKeywords(icon) {
  const keywords = new Set()
  
  const normalize = (str) => str.toLowerCase().trim()
  
  const symbol = icon.symbol ? normalize(icon.symbol) : ''
  const name = normalize(icon.name)
  const id = normalize(icon.id)
  
  if (symbol) {
    keywords.add(`${symbol}-logo-svg`)
    keywords.add(`${symbol}-logo-png`)
    keywords.add(`${symbol}-logo`)
    keywords.add(`${symbol}-svg`)
    keywords.add(`${symbol}-png`)
    keywords.add(symbol)
  }
  
  if (name && name !== symbol) {
    keywords.add(`${name}-logo-svg`)
    keywords.add(`${name}-logo-png`)
    keywords.add(`${name}-logo`)
    keywords.add(`${name}-svg`)
    keywords.add(`${name}-png`)
    keywords.add(name)
  }
  
  if (id && id !== symbol && id !== name) {
    keywords.add(`${id}-logo-svg`)
    keywords.add(`${id}-logo-png`)
    keywords.add(`${id}-logo`)
    keywords.add(id)
  }
  
  return Array.from(keywords).filter(Boolean)
}

// 测试几个图标
const testIcons = [
  iconsMetadata.icons.find(i => i.id === 'bitcoin'),
  iconsMetadata.icons.find(i => i.id === 'ethereum'),
  iconsMetadata.icons.find(i => i.id === 'usdc'),
].filter(Boolean)

console.log('🧪 测试搜索关键词生成\n')
console.log('='.repeat(60))

testIcons.forEach(icon => {
  const keywords = generateSearchKeywords(icon)
  console.log(`\n📌 ${icon.name} (${icon.symbol || 'N/A'})`)
  console.log(`   ID: ${icon.id}`)
  console.log(`   生成 ${keywords.length} 个搜索关键词:`)
  keywords.forEach(keyword => {
    console.log(`   - /search/${keyword}`)
  })
})

// 统计总数
const allKeywords = new Set()
iconsMetadata.icons.forEach(icon => {
  const keywords = generateSearchKeywords(icon)
  keywords.forEach(k => allKeywords.add(k))
})

console.log('\n' + '='.repeat(60))
console.log(`\n📊 统计信息:`)
console.log(`   - 总图标数: ${iconsMetadata.icons.length}`)
console.log(`   - 总搜索关键词数: ${allKeywords.size}`)
console.log(`   - 平均每个图标: ${(allKeywords.size / iconsMetadata.icons.length).toFixed(1)} 个关键词`)
console.log('\n✅ 测试完成！')

