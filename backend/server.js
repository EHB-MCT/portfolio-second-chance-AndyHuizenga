const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database connection
const osc = require('osc');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const wss = new WebSocket.Server({ noServer: true }); // Create WebSocket server

// Use CORS middleware
app.use(cors());

// Test route to check the database connection
app.get('/test-db', async (req, res) => {
    try {
      await pool.query('SELECT 1'); 
      res.status(200).json({ message: 'Database connection successful' });
    } catch (error) {
      console.error(error);
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

    console.log('Received OSC message A:', transformedMessage);

    oscReceivedData.push(transformedMessage);

    // Send the new data to connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(transformedMessage));
        console.log('Received OSC updating ws:', );
      }
    });
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

// WebSocket upgrade logic
app.server = oscServer; // Store the server instance in the app
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (client) => {
    wss.emit('connection', client, request);
  });
});

app.use(express.json());


app.post('/savedrawing', async (req, res) => {
    try {
      const { savedDrawingData } = req.body; // Assuming you send the data as a JSON object
      
      const client = await pool.connect();
      await client.query('INSERT INTO drawings (data) VALUES ($1)', [savedDrawingData]);
      client.release();
      
      res.status(200).json({ message: 'Drawing data saved successfully' });
    } catch (error) {
      console.error('Error saving drawing data:', error); // Add this line to log the error
      res.status(500).json({ error: 'Error saving drawing data' });
    }
});

app.post('/savedrawingtest', async (req, res) => {
    try {
      const { data } = req.body; // Assuming you send the data as a JSON object
  
      const client = await pool.connect();
      await client.query('INSERT INTO drawingstest (data) VALUES ($1)', [data]);
      client.release();
  
      res.status(200).json({ message: 'Drawing data saved successfully' });
    } catch (error) {
      console.error('Error saving drawing data:', error);
      res.status(500).json({ error: 'Error saving drawing data' });
    }
  });

  app.get('/testroute', (req, res) => {
    res.json({ message: 'Test route is working!' });
  });
  
  

  

