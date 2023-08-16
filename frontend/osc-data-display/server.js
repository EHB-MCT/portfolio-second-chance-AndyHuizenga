const express = require('express');
const osc = require('osc');

const app = express();
const server = app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 6000,
  metadata: true,
});

udpPort.on('message', (oscMsg) => {
  console.log('Received OSC message:', oscMsg);
  // You can process and store the data here as needed.
});

udpPort.open();

