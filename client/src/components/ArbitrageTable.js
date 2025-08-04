import React from 'react';
import { TrendingUp, ArrowRight, DollarSign, Percent } from 'lucide-react';

const ArbitrageTable = ({ opportunities }) => {
  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Arbitrage Opportunities</h3>
        <p className="text-gray-500">
          Currently no profitable arbitrage opportunities found. Check back later!
        </p>
      </div>
    );
  }

  const getProfitColor = (profitPercentage) => {
    const profit = parseFloat(profitPercentage);
    if (profit >= 2) return 'text-green-600 bg-green-50';
    if (profit >= 1) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getProfitIcon = (profitPercentage) => {
    const profit = parseFloat(profitPercentage);
    if (profit >= 2) return '🚀';
    if (profit >= 1) return '⚡';
    return '📈';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Arbitrage Opportunities
        </h2>
        <p className="text-gray-600">
          Buy low on one exchange, sell high on another for instant profit
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cryptocurrency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buy Exchange
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buy Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sell Exchange
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sell Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit USD
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {opportunity.symbol}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {opportunity.symbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getProfitIcon(opportunity.profitPercentage)} High Profit
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {opportunity.buyExchange}
                  </div>
                  <div className="text-sm text-gray-500">
                    Buy here
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${opportunity.buyPrice.toFixed(5)}
                  </div>
                  <div className="text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 inline" />
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {opportunity.sellExchange}
                      </div>
                      <div className="text-sm text-gray-500">
                        Sell here
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${opportunity.sellPrice.toFixed(5)}
                  </div>
                  <div className="text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 inline" />
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProfitColor(opportunity.profitPercentage)}`}>
                    <Percent className="w-3 h-3 mr-1" />
                    {opportunity.profitPercentage}%
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    +${opportunity.profitUSD}
                  </div>
                  <div className="text-sm text-gray-500">
                    per unit
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Execute Trade
                  </button>
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
            <p className="text-sm text-gray-500">Total Opportunities</p>
            <p className="text-lg font-semibold text-gray-900">{opportunities.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Profit</p>
            <p className="text-lg font-semibold text-green-600">
              {(opportunities.reduce((sum, opp) => sum + parseFloat(opp.profitPercentage), 0) / opportunities.length).toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Profit Potential</p>
            <p className="text-lg font-semibold text-green-600">
              ${opportunities.reduce((sum, opp) => sum + parseFloat(opp.profitUSD), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbitrageTable; 