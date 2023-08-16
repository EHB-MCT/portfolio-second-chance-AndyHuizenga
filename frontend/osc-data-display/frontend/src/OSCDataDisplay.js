import React, { useState, useEffect } from 'react';

function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/oscdata') // Use the complete URL to your backend
      .then((response) => response.json())
      .then((data) => {
        setOSCData(data);
      })
      .catch((error) => {
        console.error('Error fetching OSC data:', error);
      });
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
