/**
 * 从 CoinMarketCap 获取排名 81-100 的代币信息并添加到 icons-metadata.json
 * 使用占位符 logo，跳过重复的代币
 */

const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');

// 加载 .env 文件
const envPath = path.join(__dirname, '..', '.env');
const result = dotenv.config({ 
  path: envPath,
  encoding: 'utf8',
  override: false
});

if (result.error && result.error.code !== 'ENOENT') {
  console.warn('⚠️  警告: 加载 .env 文件时出错:', result.error.message);
}

const API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!API_KEY) {
  console.error('❌ 错误: 未设置 COINMARKETCAP_API_KEY 环境变量');
  process.exit(1);
}

const METADATA_FILE = path.join(__dirname, '..', 'data', 'icons-metadata.json');

/**
 * 调用 CoinMarketCap API 获取排名 81-100 的代币
 */
function fetchRankings81to100() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      start: '81',
      limit: '20', // 获取排名 81-100 (共20个)
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

    console.log('正在从 CoinMarketCap API 获取排名 81-100 的代币信息...');
    console.log(`请求 URL: ${url}`);
    console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}\n`);
    
    const req = https.request(options, (res) => {
      console.log(`收到响应: ${res.statusCode} ${res.statusMessage}`);
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);

          if (res.statusCode !== 200) {
            reject(new Error(`API 请求失败: ${res.statusCode} ${res.statusMessage}`));
            return;
          }

          if (jsonData.status && jsonData.status.error_code !== 0) {
            reject(new Error(`API 错误 (${jsonData.status.error_code}): ${jsonData.status.error_message || '未知错误'}`));
            return;
          }

          if (!jsonData.data || !Array.isArray(jsonData.data)) {
            reject(new Error('API 返回数据格式错误: 缺少 data 数组'));
            return;
          }

          resolve(jsonData.data);
        } catch (error) {
          reject(new Error(`解析 API 响应失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`网络请求失败: ${error.message}`));
    });

    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('API 请求超时（120秒）。可能原因：\n  1. 网络连接慢或不稳定\n  2. CoinMarketCap API 服务器响应慢\n  3. 防火墙或代理设置问题\n\n建议：\n  - 检查网络连接\n  - 稍后重试\n  - 如果使用代理，检查代理设置'));
    });

    req.end();
  });
}

/**
 * 生成图标 ID（小写，去除特殊字符）
 */
function generateIconId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 从 CoinMarketCap 数据生成图标对象
 */
function createIconFromCoinData(coin) {
  const id = generateIconId(coin.name);
  const symbol = coin.symbol.toUpperCase();
  const name = coin.name;
  
  // 获取官网链接（如果有）
  const website = coin.urls?.website?.[0] || '';
  
  return {
    id: id,
    name: name,
    symbol: symbol,
    category: "cryptocurrency",
    tags: [symbol.toLowerCase(), name.toLowerCase(), "cryptocurrency"],
    svgPath: `/icons/svg/cryptocurrency/${id}.svg`, // 占位符路径
    pngPath: `/icons/png/cryptocurrency/${id}`, // 占位符路径
    sizes: [32, 64, 128],
    addedDate: new Date().toISOString().split('T')[0],
    color: "#000000", // 占位符颜色，后续可补充
    description: `${name} (${symbol}) - [待补充描述]`, // 占位符描述
    website: website,
    rank: coin.cmc_rank
  };
}

/**
 * 主函数
 */
async function main() {
  try {
    // 读取现有的 metadata 文件
    console.log('正在读取现有数据...');
    const fileContent = fs.readFileSync(METADATA_FILE, 'utf8');
    const metadata = JSON.parse(fileContent);

    // 创建现有代币的 symbol 和 name 集合（用于去重）
    const existingSymbols = new Set(
      metadata.icons.map(icon => icon.symbol?.toUpperCase()).filter(Boolean)
    );
    const existingNames = new Set(
      metadata.icons.map(icon => icon.name?.toLowerCase()).filter(Boolean)
    );

    console.log(`现有代币数量: ${metadata.icons.length}`);
    console.log(`现有 symbol 数量: ${existingSymbols.size}\n`);

    // 获取排名 81-100 的代币
    const coins = await fetchRankings81to100();
    console.log(`✅ 成功获取 ${coins.length} 个代币信息\n`);

    // 过滤出新的代币（不存在的）
    const newIcons = [];
    const skippedCoins = [];

    coins.forEach(coin => {
      const symbol = coin.symbol.toUpperCase();
      const name = coin.name.toLowerCase();
      
      // 检查是否已存在（通过 symbol 或 name）
      if (existingSymbols.has(symbol) || existingNames.has(name)) {
        skippedCoins.push(`${coin.name} (${symbol}) - Rank ${coin.cmc_rank}`);
        return;
      }

      const icon = createIconFromCoinData(coin);
      newIcons.push(icon);
      console.log(`✅ 准备添加: ${icon.name} (${icon.symbol}) - Rank ${icon.rank}`);
    });

    if (skippedCoins.length > 0) {
      console.log(`\n⚠️  跳过 ${skippedCoins.length} 个已存在的代币:`);
      skippedCoins.forEach(coin => console.log(`  - ${coin}`));
    }

    if (newIcons.length === 0) {
      console.log('\n⚠️  没有新代币需要添加，所有代币都已存在');
      return;
    }

    console.log(`\n将添加 ${newIcons.length} 个新代币到数据文件...`);

    // 添加到 icons 数组（按 rank 排序）
    metadata.icons.push(...newIcons);
    metadata.icons.sort((a, b) => (a.rank || 9999) - (b.rank || 9999));

    // 更新 lastUpdated
    metadata.lastUpdated = new Date().toISOString();

    // 保存文件
    fs.writeFileSync(
      METADATA_FILE,
      JSON.stringify(metadata, null, 2) + '\n',
      'utf8'
    );

    console.log(`\n✅ 成功添加 ${newIcons.length} 个代币到 ${METADATA_FILE}`);
    console.log('\n添加的代币列表:');
    newIcons.forEach(icon => {
      console.log(`  - ${icon.name} (${icon.symbol}) - Rank ${icon.rank} - ID: ${icon.id}`);
      if (icon.website) {
        console.log(`    官网: ${icon.website}`);
      }
    });
    console.log('\n📝 注意: 这些是占位符数据，需要后续补充:');
    console.log('  - SVG/PNG 图标文件（路径已设置，但文件需要添加）');
    console.log('  - 正确的颜色值（当前为 #000000）');
    console.log('  - 完整的描述信息（当前为 [待补充描述]）');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();

