import React from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink, Activity } from 'lucide-react';

const ExchangeStatus = ({ exchanges, prices }) => {
  if (!exchanges || exchanges.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Exchange Data</h3>
        <p className="text-gray-500">
          Exchange information not available.
        </p>
      </div>
    );
  }

  const getExchangeStatus = (exchangeName) => {
    const exchangePrices = Object.values(prices).filter(p => p.exchange === exchangeName);
    return {
      isOnline: exchangePrices.length > 0,
      priceCount: exchangePrices.length,
      lastUpdate: exchangePrices.length > 0 ? Math.max(...exchangePrices.map(p => p.timestamp)) : null
    };
  };

  // Removed unused function

  const getExchangeUrl = (exchangeName) => {
    const exchange = exchanges.find(e => e.name === exchangeName);
    return exchange?.url || '#';
  };

  const getExchangeDescription = (exchangeName) => {
    const exchange = exchanges.find(e => e.name === exchangeName);
    return exchange?.description || 'No description available';
  };

  const getSupportedPairs = (exchangeName) => {
    const exchange = exchanges.find(e => e.name === exchangeName);
    return exchange?.supportedPairs || [];
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Exchange Status & Performance
        </h2>
        <p className="text-gray-600">
          Monitor the status and performance of all connected exchanges
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exchanges.map((exchange) => {
          const status = getExchangeStatus(exchange.name);
          const isOnline = status.isOnline;
          
          return (
            <div key={exchange.name} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {exchange.logo ? (
                      <img 
                        src={exchange.logo} 
                        alt={`${exchange.name} logo`}
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {exchange.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exchange.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {isOnline ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">Offline</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={getExchangeUrl(exchange.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  {getExchangeDescription(exchange.name)}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {status.priceCount}
                    </div>
                    <div className="text-xs text-gray-500">Price Pairs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {getSupportedPairs(exchange.name).length}
                    </div>
                    <div className="text-xs text-gray-500">Supported Pairs</div>
                  </div>
                </div>

                {/* Last Update */}
                {status.lastUpdate && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    Last update: {new Date(status.lastUpdate).toLocaleTimeString()}
                  </div>
                )}

                {/* Supported Pairs */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Supported Pairs:</h4>
                  <div className="flex flex-wrap gap-1">
                    {getSupportedPairs(exchange.name).slice(0, 6).map((pair) => (
                      <span
                        key={pair}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {pair}
                      </span>
                    ))}
                    {getSupportedPairs(exchange.name).length > 6 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{getSupportedPairs(exchange.name).length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Status: {isOnline ? 'Active' : 'Inactive'}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {exchanges.length}
            </div>
            <div className="text-sm text-gray-500">Total Exchanges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {exchanges.filter(e => getExchangeStatus(e.name).isOnline).length}
            </div>
            <div className="text-sm text-gray-500">Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {exchanges.filter(e => !getExchangeStatus(e.name).isOnline).length}
            </div>
            <div className="text-sm text-gray-500">Offline</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(prices).length}
            </div>
            <div className="text-sm text-gray-500">Total Prices</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeStatus; 