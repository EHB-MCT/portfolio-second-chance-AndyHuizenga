import React, { useState, useEffect } from 'react';

function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);

useEffect(() => {
  // Simulate receiving OSC data
  const simulatedOSCData = [
    { touch: { x: 0.1179487, y: 0.3671241 } },
    // Add more simulated data here
  ];

  setOSCData(simulatedOSCData);
}, []);


  return (
    <div>
      <h1>OSC Data Display</h1>
      <ul>
        {oscData.map((data, index) => (
          <li key={index}>{JSON.stringify(data)}</li>
        ))}
      </ul>
    </div>
  );
}

export default OSCDataDisplay;
