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
  res.json({ message: 'OSC_INCOMING' });

});

app.post('/cleardata', (req, res) => {
  oscReceivedData.length = 0; // Clear the oscReceivedData array

});

app.get('/', (req, res) => {
  res.send('Hello, this is the homepage of your application!');
});

app.use(express.json()); // To parse JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.post('/savedata', async (req, res) => {
  const receivedDrawing = req.body.drawing; 
  console.log(receivedDrawing, "the whole is in the backend yet here");

  console.log(receivedDrawing[0], "XXXX");
  console.log(receivedDrawing.X_POSALL, "alone");
  const X_POSALL = receivedDrawing.X_POSALL;
  const Y_POSALL = receivedDrawing.Y_POSALL;
  console.log(X_POSALL, "X_POSALL");
  console.log(Y_POSALL, "Y_POSALL");

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

