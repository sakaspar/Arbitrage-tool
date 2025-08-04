import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

const PriceChart = ({ prices }) => {
  const [chartType, setChartType] = useState('line');
  const [selectedSymbol, setSelectedSymbol] = useState('all');

  // Process data for charts
  const chartData = useMemo(() => {
    if (!prices || Object.keys(prices).length === 0) {
      return {
        comparisonData: [],
        exchangePerformance: [],
        symbols: [],
        exchanges: []
      };
    }

    const symbols = [...new Set(Object.values(prices).map(p => p.symbol.replace(/USDT|USD/, '')))];
    const exchanges = [...new Set(Object.values(prices).map(p => p.exchange))];
    
    // Group by symbol
    const symbolData = {};
    symbols.forEach(symbol => {
      symbolData[symbol] = Object.values(prices).filter(p => 
        p.symbol.includes(symbol)
      );
    });

    // Create comparison data
    const comparisonData = symbols.map(symbol => {
      const symbolPrices = symbolData[symbol];
      const dataPoint = { symbol };
      
      exchanges.forEach(exchange => {
        const exchangePrice = symbolPrices.find(p => p.exchange === exchange);
        if (exchangePrice) {
          dataPoint[exchange] = exchangePrice.price;
        }
      });
      
      return dataPoint;
    });

    // Create exchange performance data
    const exchangePerformance = exchanges.map(exchange => {
      const exchangePrices = Object.values(prices).filter(p => p.exchange === exchange);
      const avgPrice = exchangePrices.reduce((sum, p) => sum + p.price, 0) / exchangePrices.length;
      
      return {
        exchange,
        priceCount: exchangePrices.length,
        avgPrice: avgPrice.toFixed(2)
      };
    });

    return {
      comparisonData,
      exchangePerformance,
      symbols,
      exchanges
    };
  }, [prices]);

  if (!prices || Object.keys(prices).length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Chart Data</h3>
        <p className="text-gray-500">
          No price data available for charts.
        </p>
      </div>
    );
  }

  const filteredData = selectedSymbol === 'all' 
    ? chartData.comparisonData 
    : chartData.comparisonData.filter(item => item.symbol === selectedSymbol);

  const getExchangeColor = (exchange) => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
    const index = chartData.exchanges.indexOf(exchange);
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value?.toFixed(2) || 'N/A'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Price Charts & Analysis
        </h2>
        <p className="text-gray-600">
          Visualize price differences across exchanges
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chart Type
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'bar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Bar Chart
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cryptocurrency
          </label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Cryptocurrencies</option>
            {chartData.symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Comparison Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Price Comparison by Exchange
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {chartData.exchanges.map((exchange, index) => (
                  <Line
                    key={exchange}
                    type="monotone"
                    dataKey={exchange}
                    stroke={getExchangeColor(exchange)}
                    strokeWidth={2}
                    dot={{ fill: getExchangeColor(exchange), strokeWidth: 2, r: 4 }}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {chartData.exchanges.map((exchange, index) => (
                  <Bar
                    key={exchange}
                    dataKey={exchange}
                    fill={getExchangeColor(exchange)}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exchange Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Exchange Performance Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.exchangePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exchange" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="priceCount" fill="#3b82f6" name="Price Pairs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Cryptocurrencies</h4>
          <p className="text-2xl font-bold text-gray-900">{chartData.symbols.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Exchanges</h4>
          <p className="text-2xl font-bold text-gray-900">{chartData.exchanges.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Price Pairs</h4>
          <p className="text-2xl font-bold text-gray-900">{Object.keys(prices).length}</p>
        </div>
      </div>
    </div>
  );
};

export default PriceChart; 