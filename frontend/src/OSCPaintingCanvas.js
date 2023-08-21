import React, { useState, useEffect } from 'react';
import './PaintingCanvas.css';
import { handleClearData } from './Buttons';
import io from 'socket.io-client'; // Import socket.io-client

const OSPPaintingCanvas = () => {
  const [drawing, setDrawing] = useState([]);
  const [isDrawingStarted, setIsDrawingStarted] = useState(false);
  const [isDrawingSaved, setIsDrawingSaved] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [socket, setSocket] = useState(null); // Add socket state


    /**
  * TYPE: GET
  * NAME: useEffect
  * FUNCTION: incoming OSC data is mapped to the canvas dimensions, created a new dot and added to the drawing array
 */
  useEffect(() => {
    const canvasElement = document.querySelector('.canvas');
    const dimensions = {
      width: canvasElement.offsetWidth,
      height: canvasElement.offsetHeight,
    };
    setCanvasDimensions(dimensions);

    // Create socket.io connection
    const socketInstance = io('http://localhost:3001'); // Replace with your backend URL
    setSocket(socketInstance);

    // Add socket event listener for 'osc-data-update'
    socketInstance.on('osc-data-update', (oscData) => {
      const newDot = {
        x: mapOSCValueToX(oscData['Y-POS'], dimensions.width),
        y: mapOSCValueToY(oscData['X-POS'], dimensions.height),
      };
      setDrawing(prevDrawing => [...prevDrawing, newDot]);
    });

    // Clean up socket when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

    /**
  * TYPE: button
  * NAME:  handleStartDrawing
  * FUNCTION: when button is clicked, the putting dots will start
  *
 */
  const handleStartDrawing = () => {
    setIsDrawingStarted(true);
    console.log('Drawing with OSC started');
  };

 /**
  * TYPE: button - POST
  * NAME: handleSaveDrawing
  * FUNCTION: when button is clicked, the drawing will be saved by sending the drawing data to the backend
  * @param oscData
  * @returns response from the backend
 */
  async function handleSaveDrawing(oscData) {
    
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
  
      /**
  * TYPE: function transform calculation
  * NAME: mapOSCValueToX, mapOSCValueToY
  * FUNCTION: incoming OSC data is converted to usable data for the canvas: incoming OSC data y is between -1.2 and 1.2, x is between -0.9 and 0.9. Removing negative values and mapping the values to the canvas dimensions. X & Y are switched because the phone is used in landscape mode
  * @param oscValue, canvasWidth, canvasHeight
 */
  
  const mapOSCValueToX = (oscValue, canvasWidth) => {
    return (oscValue + 1.2) * (canvasWidth / 2);
  };

  const mapOSCValueToY = (oscValue, canvasHeight) => {
    // Calculate Y coordinate using the formula
    return (-oscValue + 0.9) * (canvasHeight / 2);
  };

      /**
  * TYPE: button
  * NAME: fullClear
  * FUNCTION: when button is clicked, the drawing data is cleared and the OSC data on the server is cleared
 */

  const fullClear = () => {
    // Clear the drawing data
    setDrawing([]);
    // Clear OSC data on the server
    handleClearData();
  };


  return (
    
    <div>
    <h1>OSC Painting Canvas</h1>
   <div className="btn-group" role="group" aria-label="Button group ">
  <button onClick={handleStartDrawing} className="btn btn-success me-2 ">
    Start OSC Art
  </button>
  <button
    onClick={handleSaveDrawing}
    disabled={!isDrawingStarted}
    className="btn btn-primary me-2"
  >
    Save Drawing
  </button>
  <button onClick={fullClear} className="btn btn-danger me-1">
    Clear OSC Data
  </button>
</div>


    <div className="painting-canvas-container">
         
         <div className="canvas">
         <svg className="drawing">
            {drawing.map((circle, index) => (
              <circle
                key={index}
                cx={circle.x}
                cy={circle.y}
                r="10"
                fill="red"
              />
            ))}
          </svg>
         </div>
         <div className="button-container">
       
         </div>
       </div>
  </div>


  );
};

export default OSPPaintingCanvas;
