const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const cron = require('node-cron');
const { fetchPrices, calculateArbitrage } = require('./services/priceService');
const { exchanges } = require('./config/exchanges');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store current prices and arbitrage opportunities
let currentPrices = {};
let arbitrageOpportunities = [];

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  // Send initial data
  ws.send(JSON.stringify({
    type: 'prices',
    data: currentPrices
  }));
  
  ws.send(JSON.stringify({
    type: 'arbitrage',
    data: arbitrageOpportunities
  }));
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// API Routes
app.get('/api/prices', (req, res) => {
  res.json(currentPrices);
});

app.get('/api/arbitrage', (req, res) => {
  res.json(arbitrageOpportunities);
});

app.get('/api/exchanges', (req, res) => {
  res.json(exchanges);
});

// Update prices and arbitrage opportunities
async function updateData() {
  try {
    console.log('Fetching prices from exchanges...');
    const prices = await fetchPrices();
    currentPrices = prices;
    
    console.log('Calculating arbitrage opportunities...');
    const opportunities = calculateArbitrage(prices);
    arbitrageOpportunities = opportunities;
    
    // Broadcast updates to WebSocket clients
    broadcast({
      type: 'prices',
      data: currentPrices
    });
    
    broadcast({
      type: 'arbitrage',
      data: arbitrageOpportunities
    });
    
    console.log(`Updated ${Object.keys(prices).length} price pairs`);
    console.log(`Found ${opportunities.length} arbitrage opportunities`);
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

// Schedule price updates every 30 seconds
cron.schedule('*/30 * * * * *', updateData);

// Initial data fetch
updateData();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
}); 