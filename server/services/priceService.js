const axios = require('axios');

// Exchange API endpoints and configurations
const exchangeAPIs = {
  binance: {
    baseUrl: 'https://api.binance.com/api/v3',
    getTicker: '/ticker/price',
    getOrderBook: '/depth'
  },
  coinbase: {
    baseUrl: 'https://api.pro.coinbase.com', // Use the correct API endpoint
    getTicker: '/products/tickers',
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
  },
  bybit: {
    baseUrl: 'https://api.bybit.com',
    getTicker: '/v5/market/tickers?category=spot',
    getOrderBook: '/v5/market/orderbook'
  },
  mexc: {
    baseUrl: 'https://api.mexc.com',
    getTicker: '/api/v3/ticker/price',
    getOrderBook: '/api/v3/depth'
  }
};

// We'll get ALL USDT pairs from exchanges, not just specific ones
const cryptocurrencies = []; // Empty array means we'll get all available pairs

// Fetch prices from Binance
async function fetchBinancePrices() {
  try {
    const response = await axios.get(`${exchangeAPIs.binance.baseUrl}${exchangeAPIs.binance.getTicker}`);
    const prices = {};

    response.data.forEach(ticker => {
      const symbol = ticker.symbol;
      if (symbol.endsWith('USDT') && !symbol.includes('UP') && !symbol.includes('DOWN')) {
        const price = parseFloat(ticker.price);
        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'Binance',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching Binance prices:', error.message);
    return {};
  }
}

// Fetch prices from Bybit
async function fetchBybitPrices() {
  try {
    const response = await axios.get(`${exchangeAPIs.bybit.baseUrl}${exchangeAPIs.bybit.getTicker}`);
    const prices = {};

    response.data.result.list.forEach(ticker => {
      const symbol = ticker.symbol;
      if (symbol.endsWith('USDT')) {
        const price = parseFloat(ticker.lastPrice);
        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'Bybit',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching Bybit prices:', error.message);
    return {};
  }
}

// Fetch prices from MEXC
async function fetchMexcPrices() {
  try {
    const response = await axios.get(`${exchangeAPIs.mexc.baseUrl}${exchangeAPIs.mexc.getTicker}`);
    const prices = {};

    response.data.forEach(ticker => {
      const symbol = ticker.symbol;
      if (symbol.endsWith('USDT')) {
        const price = parseFloat(ticker.price);
        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'MEXC',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching MEXC prices:', error.message);
    return {};
  }
}

// Fetch prices from Coinbase
async function fetchCoinbasePrices() {
  try {
    const prices = {};
    // Coinbase Pro API provides ticker information for all products at once
    const response = await axios.get(`${exchangeAPIs.coinbase.baseUrl}${exchangeAPIs.coinbase.getTicker}`);

    Object.entries(response.data).forEach(([productId, ticker]) => {
      if (productId.endsWith('-USDT') || productId.endsWith('-USD')) {
        const symbol = productId.replace('-', '');
        const price = parseFloat(ticker.price);

        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'Coinbase',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching Coinbase prices:', error.message);
    return {};
  }
}

// Fetch prices from Kraken
async function fetchKrakenPrices() {
  try {
    const url = `${exchangeAPIs.kraken.baseUrl}${exchangeAPIs.kraken.getTicker}`;
    const response = await axios.get(url);
    const prices = {};

    Object.keys(response.data.result).forEach(pair => {
      const data = response.data.result[pair];
      let symbol = pair.toUpperCase();

      // Standardize Kraken symbols
      symbol = symbol.replace('XBT', 'BTC').replace('ZUSD', 'USD');
      if (symbol.endsWith('USDT') || symbol.endsWith('USD')) {
        symbol = symbol.replace('USD', 'USDT');

        const price = parseFloat(data.c[0]);
        if (!isNaN(price) && price > 0.001) {
          prices[symbol] = {
            exchange: 'Kraken',
            symbol: symbol,
            price: price,
            timestamp: Date.now()
          };
        }
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching Kraken prices:', error.message);
    return {};
  }
}

// Fetch prices from KuCoin
async function fetchKuCoinPrices() {
  try {
    const response = await axios.get(`${exchangeAPIs.kucoin.baseUrl}${exchangeAPIs.kucoin.getTicker}`);
    const prices = {};

    response.data.data.ticker.forEach(ticker => {
      const symbol = ticker.symbol.replace('-', '');
      if (symbol.endsWith('USDT')) {
        const price = parseFloat(ticker.last);
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
    return {};
  }
}

// Fetch prices from Huobi
async function fetchHuobiPrices() {
  try {
    const response = await axios.get(`${exchangeAPIs.huobi.baseUrl}${exchangeAPIs.huobi.getTicker}`);
    const prices = {};

    response.data.data.forEach(ticker => {
      const symbol = ticker.symbol.toUpperCase();
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
    return {};
  }
}

  // Fetch all prices from all exchanges
  async function fetchPrices() {
    try {
      const [binancePrices, coinbasePrices, krakenPrices, kucoinPrices, huobiPrices, bybitPrices, mexcPrices] = await Promise.allSettled([
        fetchBinancePrices(),
        fetchCoinbasePrices(),
        fetchKrakenPrices(),
        fetchKuCoinPrices(),
        fetchHuobiPrices(),
        fetchBybitPrices(),
        fetchMexcPrices()
      ]);

      // Log exchange status
      console.log('Exchange Status:');
      console.log('- Binance:', binancePrices.status, Object.keys(binancePrices.value || {}).length, 'pairs');
      console.log('- Coinbase:', coinbasePrices.status, Object.keys(coinbasePrices.value || {}).length, 'pairs');
      console.log('- Kraken:', krakenPrices.status, Object.keys(krakenPrices.value || {}).length, 'pairs');
      console.log('- KuCoin:', kucoinPrices.status, Object.keys(kucoinPrices.value || {}).length, 'pairs');
      console.log('- Huobi:', huobiPrices.status, Object.keys(huobiPrices.value || {}).length, 'pairs');
      console.log('- Bybit:', bybitPrices.status, Object.keys(bybitPrices.value || {}).length, 'pairs');
      console.log('- MEXC:', mexcPrices.status, Object.keys(mexcPrices.value || {}).length, 'pairs');

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
      if (bybitPrices.status === 'fulfilled') {
        addExchangePrices('Bybit', bybitPrices.value);
      }
      if (mexcPrices.status === 'fulfilled') {
        addExchangePrices('MEXC', mexcPrices.value);
      }

      // Filter out any pairs with zero or very small prices
      Object.keys(allPrices).forEach(symbol => {
        allPrices[symbol] = allPrices[symbol].filter(price =>
          price.price &&
          price.price > 0.001 &&
          !isNaN(price.price) &&
          price.price !== Infinity &&
          price.price !== -Infinity
        );

        // Remove symbols that have no valid prices left
        if (allPrices[symbol].length === 0) {
          delete allPrices[symbol];
        }
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
