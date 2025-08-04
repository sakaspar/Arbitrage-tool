import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const PriceTable = ({ prices }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'asc' });
  const [filterExchange, setFilterExchange] = useState('all');
  const [filterSymbol, setFilterSymbol] = useState('all');

  if (!prices || Object.keys(prices).length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Price Data</h3>
        <p className="text-gray-500">
          No cryptocurrency prices available. Please check your connection.
        </p>
      </div>
    );
  }

  // Convert new data structure (arrays) to flat array of individual prices
  const flatPrices = [];
  Object.entries(prices).forEach(([symbol, priceArray]) => {
    if (Array.isArray(priceArray)) {
      priceArray.forEach(price => {
        flatPrices.push(price);
      });
    }
  });

  // Get unique exchanges and symbols for filters
  const exchanges = [...new Set(flatPrices.map(p => p.exchange))];
  const symbols = [...new Set(flatPrices.map(p => p.symbol))];

  // Sort function
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort data
  const filteredData = flatPrices.filter(price => {
    const exchangeMatch = filterExchange === 'all' || price.exchange === filterExchange;
    const symbolMatch = filterSymbol === 'all' || price.symbol === filterSymbol;
    return exchangeMatch && symbolMatch;
  });

  const sortedData = sortData(filteredData);

  const getSymbolIcon = (symbol) => {
    const baseSymbol = symbol.replace(/USDT|USD/, '');
    switch (baseSymbol) {
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      case 'SOL': return '◎';
      case 'USDT': return '💎';
      default: return '🪙';
    }
  };

  const getSymbolColor = (symbol) => {
    const baseSymbol = symbol.replace(/USDT|USD/, '');
    switch (baseSymbol) {
      case 'BTC': return 'from-orange-500 to-orange-600';
      case 'ETH': return 'from-blue-500 to-blue-600';
      case 'SOL': return 'from-purple-500 to-purple-600';
      case 'USDT': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Live Cryptocurrency Prices
        </h2>
        <p className="text-gray-600">
          Real-time prices from multiple exchanges
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exchange
          </label>
          <select
            value={filterExchange}
            onChange={(e) => setFilterExchange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Exchanges</option>
            {exchanges.map(exchange => (
              <option key={exchange} value={exchange}>{exchange}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cryptocurrency
          </label>
          <select
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Cryptocurrencies</option>
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center">
                  Cryptocurrency
                  {sortConfig.key === 'symbol' && (
                    sortConfig.direction === 'asc' ? 
                      <TrendingUp className="w-4 h-4 ml-1" /> : 
                      <TrendingDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('exchange')}
              >
                <div className="flex items-center">
                  Exchange
                  {sortConfig.key === 'exchange' && (
                    sortConfig.direction === 'asc' ? 
                      <TrendingUp className="w-4 h-4 ml-1" /> : 
                      <TrendingDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price (USD)
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'asc' ? 
                      <TrendingUp className="w-4 h-4 ml-1" /> : 
                      <TrendingDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((price, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${getSymbolColor(price.symbol)} flex items-center justify-center text-white font-bold text-sm`}>
                        {getSymbolIcon(price.symbol)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {price.symbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        {price.symbol.replace(/USDT|USD/, '')}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {price.exchange}
                  </div>
                  <div className="text-sm text-gray-500">
                    Exchange
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${price.price ? price.price.toLocaleString('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }) : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 inline" />
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(price.timestamp).toLocaleTimeString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Price Pairs</p>
            <p className="text-lg font-semibold text-gray-900">{sortedData.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Exchanges</p>
            <p className="text-lg font-semibold text-gray-900">{exchanges.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cryptocurrencies</p>
            <p className="text-lg font-semibold text-gray-900">{symbols.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTable; 