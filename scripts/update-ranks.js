/**
 * 更新代币排名脚本
 * 从 CoinMarketCap API 获取最新排名并更新 icons-metadata.json
 */

// 加载 .env 文件（如果存在）
const path = require('path');
const dotenv = require('dotenv');

// 明确指定 .env 文件路径
const envPath = path.join(__dirname, '..', '.env');
const result = dotenv.config({ 
  path: envPath,
  encoding: 'utf8',
  override: false
});

if (result.error) {
  // .env 文件不存在是正常的，不报错
  if (result.error.code !== 'ENOENT') {
    console.warn('⚠️  警告: 加载 .env 文件时出错:', result.error.message);
  }
} else if (result.parsed) {
  console.log(`✅ 已加载 .env 文件 (${Object.keys(result.parsed).length} 个变量)`);
}

const fs = require('fs');
const https = require('https');

// 配置文件路径
const METADATA_FILE = path.join(__dirname, '..', 'data', 'icons-metadata.json');
const API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!API_KEY) {
  console.error('❌ 错误: 未设置 COINMARKETCAP_API_KEY 环境变量');
  console.error('');
  console.error('请选择以下方式之一配置:');
  console.error('  1. 创建 .env 文件（推荐本地开发）:');
  console.error('     COINMARKETCAP_API_KEY=你的API_KEY');
  console.error('');
  console.error('  2. 设置环境变量（PowerShell）:');
  console.error('     $env:COINMARKETCAP_API_KEY="你的API_KEY"');
  console.error('');
  console.error('  3. GitHub Actions: 在 Secrets 中配置 COINMARKETCAP_API_KEY');
  process.exit(1);
}

/**
 * 调用 CoinMarketCap API 获取排名数据
 */
function fetchRankings() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      start: '1',
      limit: '5000', // 获取前5000名，确保覆盖所有代币
      convert: 'USD',
      sort: 'market_cap',
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
    console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);
    
    const req = https.request(options, (res) => {
      console.log(`收到响应: ${res.statusCode} ${res.statusMessage}`);
      console.log(`响应头:`, res.headers);
      
      let data = '';
      let dataSize = 0;

      res.on('data', (chunk) => {
        data += chunk;
        dataSize += chunk.length;
        if (dataSize % 100000 === 0) {
          console.log(`已接收数据: ${(dataSize / 1024).toFixed(2)} KB`);
        }
      });

      res.on('end', () => {
        console.log(`数据接收完成，总大小: ${(dataSize / 1024).toFixed(2)} KB`);
        try {
          const jsonData = JSON.parse(data);

          if (res.statusCode !== 200) {
            console.error('API 响应状态码错误:', res.statusCode);
            console.error('响应内容:', data.substring(0, 500));
            reject(new Error(`API 请求失败: ${res.statusCode} ${res.statusMessage}\n${data.substring(0, 500)}`));
            return;
          }

          if (jsonData.status && jsonData.status.error_code !== 0) {
            console.error('API 返回错误:', jsonData.status);
            reject(new Error(`API 错误 (${jsonData.status.error_code}): ${jsonData.status.error_message || '未知错误'}`));
            return;
          }

          if (!jsonData.data || !Array.isArray(jsonData.data)) {
            console.error('API 响应格式错误:', Object.keys(jsonData));
            reject(new Error('API 返回数据格式错误: 缺少 data 数组'));
            return;
          }

          resolve(jsonData.data);
        } catch (error) {
          console.error('解析 JSON 失败:', error.message);
          console.error('响应数据前500字符:', data.substring(0, 500));
          reject(new Error(`解析 API 响应失败: ${error.message}\n响应数据: ${data.substring(0, 500)}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('请求错误详情:', error);
      reject(new Error(`网络请求失败: ${error.message} (code: ${error.code || 'N/A'})`));
    });

    req.setTimeout(60000, () => {
      console.error('请求超时，正在取消...');
      req.destroy();
      reject(new Error('API 请求超时（60秒）。可能原因：\n  1. 网络连接慢或不稳定\n  2. CoinMarketCap API 服务器响应慢\n  3. 防火墙或代理设置问题\n\n建议：\n  - 检查网络连接\n  - 稍后重试\n  - 如果使用代理，检查代理设置'));
    });

    console.log('发送请求...');
    req.end();
  });
}

/**
 * 创建 symbol 到 rank 的映射
 */
function createSymbolToRankMap(apiData) {
  const map = new Map();
  
  apiData.forEach((coin) => {
    const symbol = coin.symbol.toUpperCase();
    const rank = coin.cmc_rank;
    
    // 如果同一个 symbol 有多个结果，保留排名最高的（rank 数字最小）
    if (!map.has(symbol) || map.get(symbol) > rank) {
      map.set(symbol, rank);
    }
  });
  
  return map;
}

/**
 * 更新 metadata 文件中的排名
 */
async function updateRanks() {
  console.log('开始更新代币排名...');
  
  // 读取 metadata 文件
  let metadata;
  try {
    const fileContent = fs.readFileSync(METADATA_FILE, 'utf8');
    metadata = JSON.parse(fileContent);
  } catch (error) {
    console.error('读取 metadata 文件失败:', error.message);
    process.exit(1);
  }

  // 获取 API 数据
  console.log('正在从 CoinMarketCap API 获取排名数据...');
  let apiData;
  try {
    apiData = await fetchRankings();
    console.log(`✅ 成功获取 ${apiData.length} 个代币的排名数据`);
  } catch (error) {
    console.error('❌ 获取排名数据失败:', error.message);
    console.error('请检查:');
    console.error('  1. COINMARKETCAP_API_KEY 是否正确配置');
    console.error('  2. API Key 是否有效且未过期');
    console.error('  3. 网络连接是否正常');
    process.exit(1);
  }

  // 创建 symbol 到 rank 的映射
  const symbolToRank = createSymbolToRankMap(apiData);

  // 更新每个图标的排名
  let updatedCount = 0;
  let notFoundCount = 0;
  const notFoundSymbols = [];

  metadata.icons.forEach((icon) => {
    const symbol = icon.symbol?.toUpperCase();
    
    if (!symbol) {
      console.warn(`警告: 图标 ${icon.id} 没有 symbol 字段，跳过更新`);
      return;
    }

    if (symbolToRank.has(symbol)) {
      const newRank = symbolToRank.get(symbol);
      const oldRank = icon.rank;
      
      if (oldRank !== newRank) {
        icon.rank = newRank;
        updatedCount++;
        console.log(`更新 ${icon.name} (${symbol}): ${oldRank} → ${newRank}`);
      }
    } else {
      notFoundCount++;
      notFoundSymbols.push(`${icon.name} (${symbol})`);
      console.warn(`警告: 未找到 ${icon.name} (${symbol}) 的排名数据`);
    }
  });

  // 更新 lastUpdated 时间
  metadata.lastUpdated = new Date().toISOString();

  // 保存更新后的文件
  try {
    fs.writeFileSync(
      METADATA_FILE,
      JSON.stringify(metadata, null, 2) + '\n',
      'utf8'
    );
    console.log(`\n更新完成!`);
    console.log(`- 成功更新: ${updatedCount} 个代币`);
    console.log(`- 未找到排名: ${notFoundCount} 个代币`);
    
    if (notFoundSymbols.length > 0) {
      console.log(`\n未找到排名的代币:`);
      notFoundSymbols.forEach(symbol => console.log(`  - ${symbol}`));
    }
  } catch (error) {
    console.error('保存文件失败:', error.message);
    process.exit(1);
  }
}

// 运行更新
updateRanks().catch((error) => {
  console.error('更新排名时发生错误:', error);
  process.exit(1);
});

