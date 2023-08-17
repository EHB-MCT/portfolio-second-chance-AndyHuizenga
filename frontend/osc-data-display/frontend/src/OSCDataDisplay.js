import React, { useState, useEffect } from 'react';
import './OSCDataDisplay.css'; // Import your local CSS file
import { handleClearData } from './Buttons';
// ...


function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/oscdata')
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
      <button onClick={handleClearData}>Clear OSC Data</button>
      <table>
        <thead>
          <tr>
            <th>X-POS</th>
            <th>Y-POS</th>
          </tr>
        </thead>
        <tbody>
          {oscData.map((data, index) => (
            <tr key={index}>
              <td>{data['X-POS']}</td>
              <td>{data['Y-POS']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OSCDataDisplay;
