import React, { useState, useEffect } from 'react';
import './OSCDataDisplay.css';
import { handleClearData } from './Buttons';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client'; // Import socket.io-client

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

    const socketInstance = io('http://localhost:3001'); // Replace with your backend URL

    socketInstance.on('osc-data-update', (newData) => {
      setOSCData((prevData) => [...prevData, newData]);
    });

    return () => {
      socketInstance.disconnect(); // Cleanup socket connection on unmount
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleClearData = async () => {
    try {
      const response = await fetch('http://localhost:3001/cleardata', {
        method: 'POST',
      });

      if (response.ok) {
        setOSCData([]); // Clear the table by updating the state
      }
    } catch (error) {
      console.error('Error clearing OSC data:', error);
    }
  };

  return (
    <div>
      <h1>OSC Data Display</h1>

      <button onClick={handleClearData} className="btn btn-danger">
        Clear OSC Data
      </button>
      <div className="tableS">
        <table className="table table-bordered table-width-80">
          <thead className="thead-dark">
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
    </div>
  );
}

export default OSCDataDisplay;
