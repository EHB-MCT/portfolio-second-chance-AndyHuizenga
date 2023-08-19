const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const osc = require('osc');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to match your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());

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
    io.emit('osc-data-update', transformedMessage); // Emit the new data to all connected clients
  }
});

udpPort.open();

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send the initial OSC data to the connected client
  socket.emit('initial-osc-data', oscReceivedData);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get('/oscdata', (req, res) => {
  res.json(oscReceivedData);
});

app.post('/cleardata', (req, res) => {
  oscReceivedData.length = 0; // Clear the oscReceivedData array
  res.json({ message: 'OSC data cleared' });
});

app.get('/', (req, res) => {
  res.send('Hello, this is the homepage of your application!');
});

app.use(bodyParser.json());

// Route to save drawing data to the database
app.post('/savedrawing', async (req, res) => {
  try {
    const drawingData = req.body.savedDrawingData;
    
    // Save drawingData to your database
    // Use appropriate database library and model to save the data

    res.json({ message: 'Drawing data saved' });
  } catch (error) {
    console.error('Error saving drawing data:', error);
    res.status(500).json({ error: 'Error saving drawing data' });
  }
});