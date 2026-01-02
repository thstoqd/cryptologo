/**
 * 测试 CoinMarketCap API Key 是否有效
 * 用于验证 GitHub Secrets 中的 API Key 是否仍然可用
 */

const https = require('https');

// 从环境变量获取 API Key
const API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!API_KEY) {
  console.error('❌ 错误: 未设置 COINMARKETCAP_API_KEY 环境变量');
  console.error('');
  console.error('请设置环境变量:');
  console.error('  PowerShell: $env:COINMARKETCAP_API_KEY="你的API_KEY"');
  console.error('  Bash: export COINMARKETCAP_API_KEY="你的API_KEY"');
  process.exit(1);
}

console.log('🔍 测试 CoinMarketCap API Key...\n');
console.log(`API Key 预览: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}\n`);

// 测试 API 调用（获取前 5 个代币，最小请求）
function testAPI() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      start: '1',
      limit: '5', // 只获取 5 个，最小请求
      convert: 'USD',
    });

    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?${params}`;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
      },
    };

    console.log('正在连接 CoinMarketCap API...');
    
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);

          // 检查 HTTP 状态码
          if (res.statusCode !== 200) {
            console.error(`❌ HTTP 错误: ${res.statusCode} ${res.statusMessage}`);
            console.error('响应内容:', data.substring(0, 500));
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
            return;
          }

          // 检查 API 返回的错误码
          if (jsonData.status && jsonData.status.error_code !== 0) {
            const errorCode = jsonData.status.error_code;
            const errorMessage = jsonData.status.error_message;
            
            console.error(`❌ API 错误 (错误码: ${errorCode})`);
            console.error(`错误信息: ${errorMessage}`);
            
            // 常见错误码说明
            if (errorCode === 401) {
              console.error('\n💡 可能的原因:');
              console.error('   - API Key 无效或已过期');
              console.error('   - API Key 格式错误（有多余空格等）');
              console.error('   - API Key 已被禁用');
            } else if (errorCode === 429) {
              console.error('\n💡 可能的原因:');
              console.error('   - API 调用次数超限');
              console.error('   - 需要等待一段时间后重试');
            } else if (errorCode === 500) {
              console.error('\n💡 可能的原因:');
              console.error('   - CoinMarketCap API 服务器问题');
              console.error('   - 稍后重试');
            }
            
            reject(new Error(`API 错误 ${errorCode}: ${errorMessage}`));
            return;
          }

          // 检查数据格式
          if (!jsonData.data || !Array.isArray(jsonData.data)) {
            console.error('❌ API 返回数据格式错误');
            console.error('响应内容:', data.substring(0, 500));
            reject(new Error('API 返回数据格式错误'));
            return;
          }

          // 成功
          console.log('✅ API Key 有效！');
          console.log(`✅ 成功获取 ${jsonData.data.length} 个代币数据`);
          console.log('\n前 5 个代币:');
          jsonData.data.slice(0, 5).forEach((coin, index) => {
            console.log(`  ${index + 1}. ${coin.name} (${coin.symbol}) - Rank ${coin.cmc_rank}`);
          });
          
          // 显示 API 使用情况
          if (jsonData.status) {
            console.log('\n📊 API 使用情况:');
            console.log(`   总请求数: ${jsonData.status.total_count || 'N/A'}`);
            console.log(`   剩余额度: ${jsonData.status.credit_count || 'N/A'}`);
          }
          
          resolve(jsonData);
        } catch (error) {
          console.error('❌ 解析响应失败:', error.message);
          console.error('响应内容:', data.substring(0, 500));
          reject(new Error(`解析失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 网络请求失败:', error.message);
      console.error('\n💡 可能的原因:');
      console.error('   - 网络连接问题');
      console.error('   - 防火墙阻止');
      console.error('   - DNS 解析失败');
      reject(new Error(`网络错误: ${error.message}`));
    });

    req.setTimeout(30000, () => {
      req.destroy();
      console.error('❌ 请求超时（30秒）');
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

// 运行测试
testAPI()
  .then(() => {
    console.log('\n✅ API Key 测试通过！可以正常使用。');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ API Key 测试失败！');
    console.error('\n📋 建议操作:');
    console.error('   1. 检查 API Key 是否正确复制（无多余空格）');
    console.error('   2. 登录 https://coinmarketcap.com/api/ 检查 API Key 状态');
    console.error('   3. 如果已过期，重新生成 API Key');
    console.error('   4. 更新 GitHub Secrets 中的 COINMARKETCAP_API_KEY');
    process.exit(1);
  });

