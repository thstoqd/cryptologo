/**
 * 测试统一后的 SEO 格式
 * 运行: node scripts/test-seo-format.js
 */

// 模拟 SEO 工具函数
const SEO_CONFIG = {
  baseUrl: 'https://cryptologo.org',
  siteName: 'Cryptologo',
  formatInfo: 'High quality raster (.PNG) and vector (.SVG) logo files',
}

function getSymbolDisplay(icon) {
  return icon.symbol ? ` (${icon.symbol})` : ''
}

function generateTitle(icon, includeFormat = true) {
  const symbol = getSymbolDisplay(icon)
  const formatSuffix = includeFormat ? ' Logo .SVG and .PNG Files Download' : ' Logo'
  return `${icon.name}${symbol}${formatSuffix} - ${SEO_CONFIG.siteName}`
}

function generateDescription(icon) {
  const symbol = getSymbolDisplay(icon)
  const tokenInfo = `${icon.name}${symbol}`
  let baseDesc = icon.description
  
  if (!baseDesc || (!baseDesc.includes(icon.name) && !baseDesc.includes(icon.symbol || ''))) {
    baseDesc = baseDesc 
      ? `${tokenInfo} cryptocurrency. ${baseDesc}`
      : `${tokenInfo} cryptocurrency`
  }
  
  const websiteInfo = icon.website ? ` Official website: ${icon.website}.` : ''
  return `${SEO_CONFIG.formatInfo} for ${baseDesc}.${websiteInfo} Free download.`
}

const iconsMetadata = require('../data/icons-metadata.json')

const testIcons = [
  iconsMetadata.icons.find(i => i.id === 'bitcoin'),
  iconsMetadata.icons.find(i => i.id === 'ethereum'),
  iconsMetadata.icons.find(i => i.id === 'fantom'),
].filter(Boolean)

console.log('🧪 测试统一后的 SEO 格式\n')
console.log('='.repeat(80))

testIcons.forEach(icon => {
  const title = generateTitle(icon, true)
  const titleShort = generateTitle(icon, false)
  const description = generateDescription(icon)
  
  console.log(`\n📌 ${icon.name}${getSymbolDisplay(icon)}`)
  console.log(`   ID: ${icon.id}`)
  console.log(`   Website: ${icon.website || 'N/A'}`)
  console.log(`\n   📄 完整标题 (包含格式):`)
  console.log(`   ${title}`)
  console.log(`\n   📄 简短标题 (不含格式):`)
  console.log(`   ${titleShort}`)
  console.log(`\n   📝 描述:`)
  console.log(`   ${description}`)
  console.log(`\n   ✅ 格式检查:`)
  console.log(`   - 标题格式: ${title.includes('.SVG and .PNG') ? '✅ 正确' : '❌ 错误'}`)
  console.log(`   - 包含代币全称: ${description.includes(icon.name) ? '✅' : '❌'}`)
  console.log(`   - 包含代币缩写: ${icon.symbol && description.includes(icon.symbol) ? '✅' : icon.symbol ? '❌' : 'N/A'}`)
  console.log(`   - 包含 PNG 格式: ${description.includes('.PNG') ? '✅' : '❌'}`)
  console.log(`   - 包含 SVG 格式: ${description.includes('.SVG') ? '✅' : '❌'}`)
  console.log(`   - 包含官网: ${icon.website && description.includes(icon.website) ? '✅' : icon.website ? '❌' : 'N/A'}`)
  console.log(`   - 包含免费下载: ${description.includes('Free download') ? '✅' : '❌'}`)
})

console.log('\n' + '='.repeat(80))
console.log('\n✅ 格式统一检查完成！')
console.log('\n📊 统一规范:')
console.log('   - 标题格式: "{代币名} ({缩写}) Logo .SVG and .PNG Files Download - Cryptologo"')
console.log('   - 描述格式: "High quality raster (.PNG) and vector (.SVG) logo files for {代币信息}. {描述}. Official website: {网址}. Free download."')
console.log('   - OpenGraph 和 Twitter Card 使用完整标题')
console.log('   - 所有 URL 使用统一的 baseUrl')

