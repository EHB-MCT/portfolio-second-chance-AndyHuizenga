const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database connection
const osc = require('osc');
require('dotenv').config();

const app = express();

// Use CORS middleware
app.use(cors());

// Test route to check the database connection
app.get('/test-db', async (req, res) => {
  try {
    // Use the pool to query the database
    const client = await pool.connect();
    const result = await client.query('SELECT 1');
    client.release(); // Release the client back to the pool
    console.log('Database connection successful');
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Server for OSC data
const oscReceivedData = [];

const oscServer = app.listen(3001, () => {
  console.log('OSC Server is running on port 3001');
});

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 6000,
  metadata: true,
});

udpPort.on('message', (oscMsg) => {
  if (oscMsg.address === '/ZIGSIM/t_2x-NTvYcRN220d/touch0') {
    const transformedMessage = {
      "X-POS": oscMsg.args[0].value,
      "Y-POS": oscMsg.args[1].value
    };
    
    console.log('Received OSC message:', transformedMessage);
    
    oscReceivedData.push(transformedMessage);
  }
});

udpPort.open();

app.get('/oscdata', (req, res) => {
  res.json(oscReceivedData);
});

app.post('/cleardata', (req, res) => {
  oscReceivedData.length = 0; // Clear the oscReceivedData array
  res.json({ message: 'OSC data cleared' });
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello, this is the homepage of your application!');
});

const PORT = 5002; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
