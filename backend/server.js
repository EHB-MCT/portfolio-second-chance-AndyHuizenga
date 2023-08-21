const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const osc = require('osc');
require('dotenv').config();
const pool = require('./db'); 



const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to match your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());

/**
 * GET endpoint, filters the incoming object from the OSC port
 *
 * @param object incoming obect from the OSC port to be filtered and transformed into a new object (filterd info: devicetype, adress, running system)
* @returns object oscMsg, containing X-POS(float) and Y-POS(float)
 * 
 */

const oscReceivedData = [];



const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 6000,
  metadata: true,
});

udpPort.on('message', (oscMsg) => {
  console.log('Received OSC message:', oscMsg);
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

/**
 * Socket.IO setup and handles the connection and disconnection events of clients in the frontend
 */

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send the initial OSC data to the connected client
  socket.emit('initial-osc-data', oscReceivedData);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


/**
 * GET endpoint, route to get the OSC data
 *
 * @param object route made available on /oscdata to get the OSC data
 * @returns  contains array with all the OSC DATA : X-POS(float) and Y-POS(float)
 * 
 */
// Endpoint to get OSC data
app.get('/oscdata', (req, res) => {
  res.json(oscReceivedData);
});

/**
 * POST endpoint, route to clear the OSC data
 *
 * @param object route made available on /cleardata to clear the OSC data array oscReceivedData
 * @returns empty array oscrReceivedData
 * 
 */
// Endpoint to clear OSC data
app.post('/cleardata', (req, res) => {
  oscReceivedData.length = 0; // Clear the oscReceivedData array
  res.json({ message: 'OSC data cleared' });
});

/**
 * GET endpoint,
 *
 * @param object route made available on / to get the check if backend is available
 * @returns text message "Hello, this is the homepage of your application!"
 * 
 */
// Homepage route
app.get('/', (req, res) => {
  res.send('Hello, this is the homepage of your application!');
});

/**
 * POST endpoint, route to save the drawing data
 *
 * @param object route made available on /savedata to save the drawing data
 * @returns text message "Data inserted into the database", if data is inserted into the database
 * 
 */
app.use(express.json()); // To parse JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Endpoint to save drawing data to the database
app.post('/savedata', async (req, res) => {
  const receivedDrawing = req.body.drawing; 

  // Extract X_POSALL and Y_POSALL from the received data
  const X_POSALL = receivedDrawing.X_POSALL;
  const Y_POSALL = receivedDrawing.Y_POSALL;

  try {
    await pool.query(
      'INSERT INTO OSC (X_POSALL, Y_POSALL) VALUES ($1, $2)',
      [X_POSALL, Y_POSALL]
    );
    console.log('Data inserted into the database');
    res.json({ message: 'Data inserted into the database' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


