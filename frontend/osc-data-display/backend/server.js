const express = require('express');
const cors = require('cors');
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
  if (oscMsg.address === '/ZIGSIM/t_2x-NTvYcRN220d/touch0') {
    const transformedMessage = {
      "X-POS": oscMsg.args[0].value,
      "Y-POS": oscMsg.args[1].value
    };
    
    console.log('Received OSC message:', transformedMessage);
    
    receivedOSCData.push(transformedMessage);
  }
});


udpPort.open();

app.get('/oscdata', (req, res) => {
  res.json(receivedOSCData);
});

app.post('/cleardata', (req, res) => {
  receivedOSCData.length = 0; // Clear the receivedOSCData array
  res.json({ message: 'OSC data cleared' });
});