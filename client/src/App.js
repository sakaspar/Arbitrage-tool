import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, RefreshCw, Zap, BarChart3 } from 'lucide-react';
import PriceTable from './components/PriceTable';
import ArbitrageTable from './components/ArbitrageTable';
import ExchangeStatus from './components/ExchangeStatus';
import PriceChart from './components/PriceChart';
import './App.css';

function App() {
  const [prices, setPrices] = useState({});
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeTab, setActiveTab] = useState('arbitrage');

  useEffect(() => {
    // Fetch initial data
    fetchInitialData();
    
    // Setup WebSocket connection
    const ws = new WebSocket('ws://localhost:5000');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'prices') {
        setPrices(data.data);
        setLastUpdate(new Date());
      } else if (data.type === 'arbitrage') {
        setArbitrageOpportunities(data.data);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    return () => {
      ws.close();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [pricesRes, arbitrageRes, exchangesRes] = await Promise.all([
        fetch('/api/prices'),
        fetch('/api/arbitrage'),
        fetch('/api/exchanges')
      ]);
      
      const pricesData = await pricesRes.json();
      const arbitrageData = await arbitrageRes.json();
      const exchangesData = await exchangesRes.json();
      
      setPrices(pricesData);
      setArbitrageOpportunities(arbitrageData);
      setExchanges(exchangesData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleRefresh = () => {
    fetchInitialData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Crypto Arbitrage Scanner</h1>
                <p className="text-sm text-gray-500">Real-time arbitrage opportunities across exchanges</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Arbitrage Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{arbitrageOpportunities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Profit Potential</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${arbitrageOpportunities.reduce((sum, opp) => sum + parseFloat(opp.profitUSD), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Price Pairs</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(prices).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Best Opportunity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {arbitrageOpportunities.length > 0 ? `${arbitrageOpportunities[0].profitPercentage}%` : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('arbitrage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'arbitrage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Arbitrage Opportunities
              </button>
              <button
                onClick={() => setActiveTab('prices')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'prices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Live Prices
              </button>
              <button
                onClick={() => setActiveTab('exchanges')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'exchanges'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Exchange Status
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'charts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Price Charts
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'arbitrage' && (
              <ArbitrageTable opportunities={arbitrageOpportunities} />
            )}
            {activeTab === 'prices' && (
              <PriceTable prices={prices} />
            )}
            {activeTab === 'exchanges' && (
              <ExchangeStatus exchanges={exchanges} prices={prices} />
            )}
            {activeTab === 'charts' && (
              <PriceChart prices={prices} />
            )}
          </div>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="text-center text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 