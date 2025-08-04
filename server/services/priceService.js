const axios = require('axios');

// Exchange API endpoints and configurations
const exchangeAPIs = {
  binance: {
    baseUrl: 'https://api.binance.com/api/v3',
    getTicker: '/ticker/price',
    getOrderBook: '/depth'
  },
  coinbase: {
    baseUrl: 'https://api.coinbase.com/v2',
    getTicker: '/prices',
    getOrderBook: '/products'
  },
  kraken: {
    baseUrl: 'https://api.kraken.com/0',
    getTicker: '/public/Ticker',
    getOrderBook: '/public/Depth'
  },
  kucoin: {
    baseUrl: 'https://api.kucoin.com/api/v1',
    getTicker: '/market/allTickers',
    getOrderBook: '/market/orderbook/level2'
  },
  huobi: {
    baseUrl: 'https://api.huobi.pro',
    getTicker: '/market/tickers',
    getOrderBook: '/market/depth'
  }
};

// We'll get ALL USDT pairs from exchanges, not just specific ones
const cryptocurrencies = []; // Empty array means we'll get all available pairs

// Fetch prices from Binance
async function fetchBinancePrices() {
  try {
    console.log('Fetching Binance prices from:', `${exchangeAPIs.binance.baseUrl}${exchangeAPIs.binance.getTicker}`);
    const response = await axios.get(`${exchangeAPIs.binance.baseUrl}${exchangeAPIs.binance.getTicker}`);
    console.log('Binance response status:', response.status);
    
    // Debug: Show some sample symbols from Binance
    const sampleSymbols = response.data.filter(ticker => ticker.symbol.includes('BTC')).slice(0, 5);
    console.log('Sample BTC symbols from Binance:', sampleSymbols.map(t => t.symbol));
    
    // Debug: Show USDT symbols specifically
    const usdtSymbols = response.data.filter(ticker => ticker.symbol.endsWith('USDT')).slice(0, 10);
    console.log('Sample USDT symbols from Binance:', usdtSymbols.map(t => t.symbol));
    
    // Debug: Check if BTCUSDT exists in the response
    const btcUsdtTicker = response.data.find(ticker => ticker.symbol === 'BTCUSDT');
    if (btcUsdtTicker) {
      console.log('Found BTCUSDT in Binance response:', btcUsdtTicker);
    } else {
      console.log('BTCUSDT NOT found in Binance response');
      // Show first 20 symbols to debug
      console.log('First 20 symbols from Binance:', response.data.slice(0, 20).map(t => t.symbol));
    }
    
    const prices = {};
    
    response.data.forEach(ticker => {
      const symbol = ticker.symbol;
      // Include ALL USDT pairs (exclude perpetual futures with UP/DOWN)
      if (symbol.endsWith('USDT') && !symbol.includes('UP') && !symbol.includes('DOWN')) {
        const price = parseFloat(ticker.price);
        if (!isNaN(price) && price > 0.001) { // Filter out very small prices
          prices[symbol] = {
            exchange: 'Binance',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
          
          // Debug: Log BTCUSDT specifically
          if (symbol === 'BTCUSDT') {
            console.log('Added Binance BTCUSDT price:', price);
          }
        }
      }
    });
    
    // Debug: Show how many USDT pairs we captured
    const usdtPairsCount = Object.keys(prices).length;
    console.log(`Binance: Captured ${usdtPairsCount} USDT pairs`);
    
    // Debug: Show some sample captured pairs
    const sampleCaptured = Object.keys(prices).slice(0, 5);
    console.log('Sample captured USDT pairs from Binance:', sampleCaptured);
    
    // Debug: Check if BTCUSDT is in our captured prices
    if (prices['BTCUSDT']) {
      console.log('✅ BTCUSDT successfully captured from Binance:', prices['BTCUSDT'].price);
    } else {
      console.log('❌ BTCUSDT NOT captured from Binance');
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching Binance prices:', error.message);
    if (error.response) {
      console.error('Binance API response:', error.response.status, error.response.data);
    }
    return {};
  }
}

// Fetch prices from Coinbase
async function fetchCoinbasePrices() {
  try {
    console.log('Fetching Coinbase prices...');
    const prices = {};
    
    // Get list of available products from Coinbase
    const productsResponse = await axios.get(`${exchangeAPIs.coinbase.baseUrl}/products`);
    const usdtProducts = productsResponse.data.data.filter(product => 
      product.quote_currency === 'USD' && product.status === 'online'
    );
    
    // Get prices for all USD pairs (we'll convert to USDT format)
    for (const product of usdtProducts.slice(0, 50)) { // Limit to top 50 to avoid rate limits
      try {
        const url = `${exchangeAPIs.coinbase.baseUrl}${exchangeAPIs.coinbase.getTicker}/${product.id}/spot`;
        const response = await axios.get(url);
        const symbol = `${product.base_currency}USDT`; // Convert to USDT format
        
        const price = parseFloat(response.data.data.amount);
        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'Coinbase',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      } catch (error) {
        // Skip individual product errors
        continue;
      }
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching Coinbase prices:', error.message);
    if (error.response) {
      console.error('Coinbase API response:', error.response.status, error.response.data);
    }
    return {};
  }
}

// Fetch prices from Kraken
async function fetchKrakenPrices() {
  try {
    // Use the correct Kraken pairs
    const pairs = ['XXBTZUSD', 'XETHZUSD', 'SOLUSD'];
    const url = `${exchangeAPIs.kraken.baseUrl}${exchangeAPIs.kraken.getTicker}?pair=${pairs.join(',')}`;
    console.log('Fetching Kraken prices from:', url);
    const response = await axios.get(url);
    console.log('Kraken response status:', response.status);
    const prices = {};
    
    Object.keys(response.data.result).forEach(pair => {
      const data = response.data.result[pair];
      console.log('Kraken pair:', pair, 'data:', data);
      
      // Convert Kraken symbols to standard format
      let symbol = pair;
      
      // Handle Kraken's special symbol format
      if (pair === 'XXBTZUSD') symbol = 'BTCUSDT';
      else if (pair === 'XETHZUSD') symbol = 'ETHUSDT';
      else if (pair === 'SOLUSD') symbol = 'SOLUSDT';
      else {
        // Generic conversion for other pairs
        symbol = pair
          .replace('XBT', 'BTC')
          .replace('XXBT', 'BTC')
          .replace('XETH', 'ETH')
          .replace('ZUSD', 'USDT')
          .replace('USD', 'USDT');
      }
      
      const price = parseFloat(data.c[0]);
      if (!isNaN(price) && price > 0.001) {
        prices[symbol] = {
          exchange: 'Kraken',
          symbol: symbol,
          price: price, // Current price
          timestamp: Date.now()
        };
        console.log('Added Kraken price:', symbol, price);
      }
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching Kraken prices:', error.message);
    if (error.response) {
      console.error('Kraken API response:', error.response.status, error.response.data);
    }
    return {};
  }
}

// Fetch prices from KuCoin
async function fetchKuCoinPrices() {
  try {
    console.log('Fetching KuCoin prices from:', `${exchangeAPIs.kucoin.baseUrl}${exchangeAPIs.kucoin.getTicker}`);
    const response = await axios.get(`${exchangeAPIs.kucoin.baseUrl}${exchangeAPIs.kucoin.getTicker}`);
    console.log('KuCoin response status:', response.status);
    const prices = {};
    
    response.data.data.ticker.forEach(ticker => {
      const symbol = ticker.symbol;
      // Include ALL USDT pairs
      if (symbol.endsWith('USDT')) {
        const price = parseFloat(ticker.price);
        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'KuCoin',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      }
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching KuCoin prices:', error.message);
    if (error.response) {
      console.error('KuCoin API response:', error.response.status, error.response.data);
    }
    return {};
  }
}

// Fetch prices from Huobi
async function fetchHuobiPrices() {
  try {
    console.log('Fetching Huobi prices from:', `${exchangeAPIs.huobi.baseUrl}${exchangeAPIs.huobi.getTicker}`);
    const response = await axios.get(`${exchangeAPIs.huobi.baseUrl}${exchangeAPIs.huobi.getTicker}`);
    console.log('Huobi response status:', response.status);
    const prices = {};
    
    response.data.data.forEach(ticker => {
      const symbol = ticker.symbol.toUpperCase();
      // Include ALL USDT pairs
      if (symbol.endsWith('USDT')) {
        const price = parseFloat(ticker.close);
        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'Huobi',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      }
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching Huobi prices:', error.message);
    if (error.response) {
      console.error('Huobi API response:', error.response.status, error.response.data);
    }
    return {};
  }
}

  // Fetch all prices from all exchanges
  async function fetchPrices() {
    try {
      const [binancePrices, coinbasePrices, krakenPrices, kucoinPrices, huobiPrices] = await Promise.allSettled([
        fetchBinancePrices(),
        fetchCoinbasePrices(),
        fetchKrakenPrices(),
        fetchKuCoinPrices(),
        fetchHuobiPrices()
      ]);
      
      // Log exchange status
      console.log('Exchange Status:');
      console.log('- Binance:', binancePrices.status, Object.keys(binancePrices.value || {}).length, 'pairs');
      console.log('- Coinbase:', coinbasePrices.status, Object.keys(coinbasePrices.value || {}).length, 'pairs');
      console.log('- Kraken:', krakenPrices.status, Object.keys(krakenPrices.value || {}).length, 'pairs');
      console.log('- KuCoin:', kucoinPrices.status, Object.keys(kucoinPrices.value || {}).length, 'pairs');
      console.log('- Huobi:', huobiPrices.status, Object.keys(huobiPrices.value || {}).length, 'pairs');
      
      // Aggregate all prices, allowing multiple exchanges per symbol
      const allPrices = {};
      
      // Helper function to add prices from an exchange
      const addExchangePrices = (exchangeName, prices) => {
        if (prices && typeof prices === 'object') {
          Object.entries(prices).forEach(([symbol, priceData]) => {
            if (!allPrices[symbol]) {
              allPrices[symbol] = [];
            }
            allPrices[symbol].push(priceData);
          });
        }
      };
      
      // Add prices from each exchange
      if (binancePrices.status === 'fulfilled') {
        addExchangePrices('Binance', binancePrices.value);
      }
      if (coinbasePrices.status === 'fulfilled') {
        addExchangePrices('Coinbase', coinbasePrices.value);
      }
      if (krakenPrices.status === 'fulfilled') {
        addExchangePrices('Kraken', krakenPrices.value);
      }
      if (kucoinPrices.status === 'fulfilled') {
        addExchangePrices('KuCoin', kucoinPrices.value);
      }
      if (huobiPrices.status === 'fulfilled') {
        addExchangePrices('Huobi', huobiPrices.value);
      }
      
      // Filter out any pairs with zero or very small prices
      let totalPairsBefore = 0;
      let totalPairsAfter = 0;
      
      Object.keys(allPrices).forEach(symbol => {
        totalPairsBefore += allPrices[symbol].length;
        allPrices[symbol] = allPrices[symbol].filter(price => 
          price.price && 
          price.price > 0.001 && // Remove prices less than $0.001
          !isNaN(price.price) &&
          price.price !== Infinity &&
          price.price !== -Infinity
        );
        totalPairsAfter += allPrices[symbol].length;
        
        // Remove symbols that have no valid prices left
        if (allPrices[symbol].length === 0) {
          delete allPrices[symbol];
        }
      });
      
      console.log(`Filtered out ${totalPairsBefore - totalPairsAfter} zero/small-price pairs`);
      
      // Debug: Show any remaining very small prices
      let smallPricesFound = [];
      Object.entries(allPrices).forEach(([symbol, priceArray]) => {
        priceArray.forEach(price => {
          if (price.price < 1) {
            smallPricesFound.push(`${symbol} on ${price.exchange}: $${price.price}`);
          }
        });
      });
      
      if (smallPricesFound.length > 0) {
        console.log('Small prices found:', smallPricesFound.slice(0, 10));
      }
      
      // Debug: Log some sample prices
      const samplePrices = Object.entries(allPrices).slice(0, 5);
      console.log('Sample prices:', samplePrices);
      
      // Debug: Show all BTCUSDT prices from different exchanges
      const btcPrices = allPrices['BTCUSDT'] || [];
      console.log('BTCUSDT prices from all exchanges:', btcPrices);
      
      // Debug: Show all ETHUSDT prices from different exchanges
      const ethPrices = allPrices['ETHUSDT'] || [];
      console.log('ETHUSDT prices from all exchanges:', ethPrices);
      
      // Debug: Show all symbols from each exchange
      const exchangeSymbols = {};
      Object.entries(allPrices).forEach(([symbol, priceArray]) => {
        priceArray.forEach(priceData => {
          if (!exchangeSymbols[priceData.exchange]) {
            exchangeSymbols[priceData.exchange] = [];
          }
          exchangeSymbols[priceData.exchange].push(symbol);
        });
      });
      
      console.log('Symbols by exchange:');
      Object.keys(exchangeSymbols).forEach(exchange => {
        console.log(`${exchange}: ${exchangeSymbols[exchange].slice(0, 10).join(', ')}...`);
      });
      
      return allPrices;
  } catch (error) {
    console.error('Error fetching all prices:', error);
    return {};
  }
}

// Calculate arbitrage opportunities
function calculateArbitrage(prices) {
  const opportunities = [];
  
  // Process each symbol's price array
  Object.entries(prices).forEach(([symbol, priceArray]) => {
    if (!Array.isArray(priceArray) || priceArray.length < 2) return;
    
    // Find min and max prices (filter out invalid prices)
    const validPrices = priceArray.filter(price => price.price && !isNaN(price.price) && price.price > 0);
    
    if (validPrices.length < 2) return;
    
    let minPrice = validPrices[0];
    let maxPrice = validPrices[0];
    
    validPrices.forEach(price => {
      if (price.price < minPrice.price) minPrice = price;
      if (price.price > maxPrice.price) maxPrice = price;
    });
    
    // Only calculate arbitrage if buy and sell are on different exchanges
    if (minPrice.exchange === maxPrice.exchange) return;
    
    // Calculate profit percentage
    const profitPercentage = ((maxPrice.price - minPrice.price) / minPrice.price) * 100;
    
    // Only include opportunities with > 0.5% profit (accounting for fees)
    if (profitPercentage > 0.5) {
      opportunities.push({
        symbol: symbol,
        buyExchange: minPrice.exchange,
        buyPrice: minPrice.price,
        sellExchange: maxPrice.exchange,
        sellPrice: maxPrice.price,
        profitPercentage: profitPercentage.toFixed(2),
        profitUSD: (maxPrice.price - minPrice.price).toFixed(2),
        timestamp: Date.now(),
        allPrices: priceArray
      });
    }
  });
  
  // Sort by profit percentage (highest first)
  return opportunities.sort((a, b) => parseFloat(b.profitPercentage) - parseFloat(a.profitPercentage));
}

module.exports = {
  fetchPrices,
  calculateArbitrage
}; 