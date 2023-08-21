import React, { useState, useEffect } from 'react';
import './OSCDataDisplay.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client'; // Import socket.io-client

function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);

  const oscdata = [
    { 'X-POS': -0.55555, 'Y-POS': 0.55555 },

  ];


  const dummyData = [
    { 'X-POS': -0.55555, 'Y-POS': 0.55555 },
    {"X-POS": -0.36239320039749146, "Y-POS": -0.06919622421264648},
 {"X-POS": 0.4307692050933838, "Y-POS": -0.05574136972427368},
 {"X-POS": 0.44444429874420166, "Y-POS": 0.06823515892028809},
{"X-POS": -0.02393162250518799, "Y-POS": 0.2441086769104004},
{"X-POS": -0.112820565700531, "Y-POS": 0.40941059589385986},
{"X-POS": 0.2974358797073364, "Y-POS": 0.49398374557495117},
{"X-POS": 0.44444429874420166, "Y-POS": 0.5074386596679688},
  ];

  console.log(dummyData, "what's in the dummydata?");

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
console.log(oscData, "the whole is not yet herrre");

    });

    return () => {
      socketInstance.disconnect(); // Cleanup socket connection on unmount
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const showDummyData = () => {

    setOSCData(dummyData);

  }
  const handleClearData = async () => {
    setOSCData([]);
  };

  async function saveData() {
    const drawing = {
      X_POSALL: [],
      Y_POSALL: []
    };
  
    oscData.forEach(obj => {
      const x_pos = obj['X-POS'];
      const y_pos = obj['Y-POS'];
  
      drawing.X_POSALL.push(x_pos);
      drawing.Y_POSALL.push(y_pos);
    });
  
    console.log(drawing, "ohhhhh everything is here");
  
    try {
      const response = await fetch('http://localhost:3001/savedata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ drawing }) // Send the drawing data as JSON in the request body
      });
  
      if (response.ok) {
        console.log('Data sent successfully to the backend and saved in the database!');
        // You can perform any other actions here after successfully sending and saving the data
      } else {
        console.error('Failed to send or save data to the backend.');
      }
    } catch (error) {
      console.error('Error while sending or saving data:', error);
    }
  }
  

  return (
    <div>
      <h1>OSC Data Display</h1>

      <button onClick={handleClearData} className="btn btn-danger">
        Clear OSC Data
      </button>
    
      <div className="tableS">
      <button onClick={saveData} className="btn">
        Save OSC Data
      </button>
      <button onClick={showDummyData} className="btn">
        Show Dummy Data
      </button>
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
