const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database connection
const osc = require('osc');
const http = require('http'); // Import the http module
const socketIo = require('socket.io'); // Import socket.io
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create a http server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to match your frontend URL
    methods: ["GET", "POST"]
  }
});

// Use CORS middleware
app.use(cors());

// Test route to check the database connection


// Server for OSC data
const oscReceivedData = [];

const oscServer = server.listen(3001, () => {
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

    // Send the new data to connected socket.io clients
    io.emit('osc-data-update', transformedMessage);
  }
});

udpPort.open();

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Socket event handling here
  
  // Send initial data to the connected client, if needed
  socket.emit('initial-data', oscReceivedData);
});

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

