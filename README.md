Besh trunih : npm run dev on Linux or wsl 
<img width="1927" height="1146" alt="image" src="https://github.com/user-attachments/assets/9f0ecbb3-35b8-4edb-8d74-ae1d87c99673" />

# Crypto Arbitrage Scanner

A real-time cryptocurrency arbitrage scanner that monitors prices across multiple exchanges and identifies profitable trading opportunities for BTC, ETH, USDT, and SOL.

## Features

- **Real-time Price Monitoring**: Live price feeds from 5 major exchanges
- **Arbitrage Detection**: Automatic identification of profitable trading opportunities
- **Multi-Exchange Support**: Binance, Coinbase, Kraken, KuCoin, and Huobi
- **Interactive Dashboard**: Modern React UI with real-time updates
- **WebSocket Integration**: Live data streaming for instant updates
- **Price Charts**: Visual comparison of prices across exchanges
- **Exchange Status Monitoring**: Real-time status of all connected exchanges

## Supported Cryptocurrencies

- **Bitcoin (BTC)**
- **Ethereum (ETH)**
- **Tether (USDT)**
- **Solana (SOL)**

## Supported Exchanges

- **Binance** - World's largest cryptocurrency exchange
- **Coinbase** - Leading exchange with institutional-grade security
- **Kraken** - One of the oldest and most trusted exchanges
- **KuCoin** - Global exchange with extensive altcoin support
- **Huobi** - Leading digital asset exchange with global presence

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **WebSocket** - Real-time communication
- **Axios** - HTTP client for API calls
- **Node-cron** - Scheduled tasks

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **WebSocket** - Real-time updates

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-arbitrage-scanner
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both server and client (recommended)
   npm run dev
   
   # Or start them separately:
   # Terminal 1 - Start server
   npm run server
   
   # Terminal 2 - Start client
   npm run client
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Dashboard Overview
The main dashboard displays:
- **Arbitrage Opportunities**: Current profitable trading opportunities
- **Live Prices**: Real-time cryptocurrency prices from all exchanges
- **Exchange Status**: Health and performance of each exchange
- **Price Charts**: Visual analysis of price differences

### Arbitrage Opportunities
- View profitable trading opportunities sorted by profit percentage
- See buy/sell recommendations with specific exchanges
- Monitor profit potential in both percentage and USD terms

### Live Prices
- Sort and filter prices by exchange or cryptocurrency
- View real-time price updates with timestamps
- Compare prices across different exchanges

### Exchange Status
- Monitor the health of each exchange
- View supported trading pairs
- Check last update times and connection status

### Price Charts
- Interactive line and bar charts
- Compare prices across exchanges
- Filter by specific cryptocurrencies

## API Endpoints

### GET /api/prices
Returns current cryptocurrency prices from all exchanges

### GET /api/arbitrage
Returns current arbitrage opportunities

### GET /api/exchanges
Returns information about supported exchanges

### WebSocket Events
- `prices`: Real-time price updates
- `arbitrage`: Real-time arbitrage opportunity updates

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

### Exchange APIs
The application uses public APIs from exchanges. No API keys are required for basic functionality.

## Security Considerations

⚠️ **Important**: This application is for educational and informational purposes only. 

- **No Trading Execution**: The app only identifies opportunities but doesn't execute trades
- **Public APIs**: Uses public exchange APIs with rate limiting
- **No API Keys**: No sensitive credentials are stored or required
- **Educational Use**: Intended for learning about arbitrage opportunities

## Limitations

- **Market Conditions**: Arbitrage opportunities may disappear quickly
- **Trading Fees**: Calculations don't include exchange fees
- **Execution Risk**: Real trading involves slippage and execution delays
- **Regulatory Compliance**: Users must comply with local trading regulations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This software is provided "as is" without warranty of any kind. Cryptocurrency trading involves substantial risk and may not be suitable for all investors. The value of cryptocurrencies can go down as well as up, and you may lose some or all of your investment. Always do your own research and consider consulting with a financial advisor before making any investment decisions.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository. 


api calls : 
https://api.binance.com/api/v3/ticker/price
https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD,XETHZUSD,SOLUSD
https://api.huobi.pro/market/tickers
https://api.kucoin.com/api/v1/market/allTickers

https://api.coinbase.com/v2/products
