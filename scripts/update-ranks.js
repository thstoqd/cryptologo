/**
 * 更新代币排名脚本
 * 从 CoinMarketCap API 获取最新排名并更新 icons-metadata.json
 */

const fs = require('fs');
const path = require('path');

// 配置文件路径
const METADATA_FILE = path.join(__dirname, '..', 'data', 'icons-metadata.json');
const API_KEY = process.env.COINMARKETCAP_API_KEY;

if (!API_KEY) {
  console.error('错误: 未设置 COINMARKETCAP_API_KEY 环境变量');
  process.exit(1);
}

/**
 * 调用 CoinMarketCap API 获取排名数据
 */
async function fetchRankings() {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
  const params = new URLSearchParams({
    start: '1',
    limit: '5000', // 获取前5000名，确保覆盖所有代币
    convert: 'USD',
    sort: 'market_cap',
  });

  try {
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    
    if (data.status.error_code !== 0) {
      throw new Error(`API 错误: ${data.status.error_message}`);
    }

    return data.data;
  } catch (error) {
    console.error('获取排名数据失败:', error.message);
    throw error;
  }
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
    console.log(`成功获取 ${apiData.length} 个代币的排名数据`);
  } catch (error) {
    console.error('获取排名数据失败，保留原有排名');
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

