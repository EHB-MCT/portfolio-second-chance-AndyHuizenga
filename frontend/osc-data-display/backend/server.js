const express = require('express');
const cors = require('cors'); // 
const osc = require('osc');

const app = express();

// Use CORS middleware
app.use(cors());

const server = app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

const receivedOSCData = [];

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 6000,
  metadata: true,
});

udpPort.on('message', (oscMsg) => {
  console.log('Received OSC message:', oscMsg);
  receivedOSCData.push(oscMsg);
});

udpPort.open();

app.get('/oscdata', (req, res) => {
  res.json(receivedOSCData);
});
