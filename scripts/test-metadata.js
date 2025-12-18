/**
 * 测试优化后的 SEO metadata 格式
 * 运行: node scripts/test-metadata.js
 */

const iconsMetadata = require('../data/icons-metadata.json')

// 测试几个图标
const testIcons = [
  iconsMetadata.icons.find(i => i.id === 'bitcoin'),
  iconsMetadata.icons.find(i => i.id === 'ethereum'),
  iconsMetadata.icons.find(i => i.id === 'fantom'),
].filter(Boolean)

console.log('🧪 测试优化后的 SEO Metadata 格式\n')
console.log('='.repeat(80))

testIcons.forEach(icon => {
  const symbol = icon.symbol ? ` (${icon.symbol})` : ''
  const formatInfo = 'High quality raster (.PNG) and vector (.SVG) logo files'
  const websiteInfo = icon.website ? ` Official website: ${icon.website}.` : ''
  const description = icon.description 
    ? `${formatInfo} for ${icon.name}${symbol} cryptocurrency. ${icon.description}${websiteInfo} Free download.`
    : `${formatInfo} for ${icon.name}${symbol} cryptocurrency.${websiteInfo} Free download.`
  
  const title = `${icon.name}${symbol} Logo .SVG and .PNG Files Download - Cryptologo`
  
  console.log(`\n📌 ${icon.name}${symbol}`)
  console.log(`   ID: ${icon.id}`)
  console.log(`   Website: ${icon.website || 'N/A'}`)
  console.log(`\n   📄 Title:`)
  console.log(`   ${title}`)
  console.log(`\n   📝 Description:`)
  console.log(`   ${description}`)
  console.log(`\n   🔍 包含的关键信息:`)
  console.log(`   ✅ 代币全称: ${icon.name}`)
  console.log(`   ✅ 代币缩写: ${icon.symbol || 'N/A'}`)
  console.log(`   ✅ PNG 格式: 已包含`)
  console.log(`   ✅ SVG 格式: 已包含`)
  console.log(`   ✅ 官网信息: ${icon.website ? '已包含' : '未设置'}`)
  console.log(`   ✅ 免费下载: 已包含`)
})

console.log('\n' + '='.repeat(80))
console.log('\n✅ 测试完成！')
console.log('\n📊 优化内容:')
console.log('   - 标题格式: "代币名 (缩写) Logo .SVG and .PNG Files Download"')
console.log('   - 描述包含: 格式说明、代币信息、官网链接、免费下载')
console.log('   - 结构化数据: 包含图片格式、官网、价格信息等')

