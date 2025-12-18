/**
 * 测试 CoinMarketCap API 连接
 */

require('dotenv').config();
const https = require('https');

const API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!API_KEY) {
  console.error('❌ 未设置 API Key');
  process.exit(1);
}

console.log('🔍 测试 CoinMarketCap API 连接...');
console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);
console.log('');

// 测试简单的 API 请求（只获取前 5 个代币）
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5&convert=USD&sort=market_cap';
const urlObj = new URL(url);

const options = {
  hostname: urlObj.hostname,
  path: urlObj.pathname + urlObj.search,
  method: 'GET',
  headers: {
    'X-CMC_PRO_API_KEY': API_KEY,
    'Accept': 'application/json',
    'User-Agent': 'Node.js Script'
  },
  timeout: 60000
};

console.log('📡 发送请求到:', urlObj.hostname);
console.log('路径:', urlObj.pathname + urlObj.search);
console.log('');

const startTime = Date.now();

const req = https.request(options, (res) => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ 收到响应 (耗时 ${elapsed}秒):`);
  console.log(`   状态码: ${res.statusCode} ${res.statusMessage}`);
  console.log(`   内容类型: ${res.headers['content-type']}`);
  console.log('');

  let data = '';
  let chunks = 0;

  res.on('data', (chunk) => {
    data += chunk;
    chunks++;
  });

  res.on('end', () => {
    console.log(`📦 接收完成: ${chunks} 个数据块, ${(data.length / 1024).toFixed(2)} KB`);
    console.log('');

    try {
      const json = JSON.parse(data);
      
      if (res.statusCode === 200) {
        if (json.data && Array.isArray(json.data)) {
          console.log(`✅ API 连接成功！`);
          console.log(`   获取到 ${json.data.length} 个代币数据`);
          console.log(`   示例: ${json.data[0]?.name} (${json.data[0]?.symbol}) - Rank ${json.data[0]?.cmc_rank}`);
          console.log('');
          console.log('🎉 API Key 有效，脚本应该可以正常工作！');
        } else {
          console.log('⚠️  响应格式异常:', Object.keys(json));
        }
      } else {
        console.log('❌ API 返回错误:');
        console.log(JSON.stringify(json, null, 2));
      }
    } catch (error) {
      console.log('❌ 解析响应失败:', error.message);
      console.log('响应前500字符:', data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`❌ 请求失败 (耗时 ${elapsed}秒):`);
  console.log(`   错误: ${error.message}`);
  console.log(`   错误代码: ${error.code || 'N/A'}`);
  console.log('');
  console.log('💡 可能的原因:');
  console.log('   1. 网络连接问题');
  console.log('   2. 防火墙阻止了连接');
  console.log('   3. 需要配置代理');
  console.log('   4. DNS 解析问题');
});

req.on('timeout', () => {
  req.destroy();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`❌ 请求超时 (${elapsed}秒)`);
  console.log('');
  console.log('💡 建议:');
  console.log('   1. 检查网络连接');
  console.log('   2. 检查防火墙设置');
  console.log('   3. 如果使用代理，需要配置 Node.js 使用代理');
});

req.setTimeout(60000);
req.end();

console.log('⏳ 等待响应...');
console.log('');

