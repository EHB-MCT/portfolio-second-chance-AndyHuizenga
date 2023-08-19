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
      if (isDrawingStarted) {
        const newDot = {
          x: mapOSCValueToX(oscData['Y-POS'], dimensions.width),
          y: mapOSCValueToY(oscData['X-POS'], dimensions.height),
        };
        setDrawing(prevDrawing => [...prevDrawing, newDot]);
      }
    });

    // Clean up socket when component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, [isDrawingStarted]); // Listen for changes to isDrawingStarted

  const handleStartDrawing = () => {
    setIsDrawingStarted(true);
    console.log('Drawing with OSC started');
  };
// Existing code...

const handleSaveDrawing = async () => {
  setIsDrawingSaved(true);
  console.log('Drawing saved');

  try {
    // Send the drawing data to the backend for saving
    const response = await fetch('http://localhost:3001/savedrawing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ savedDrawingData: drawing }), // Sending the drawing data
    });

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('Error saving drawing data:', error);
  }
};

// Existing code...

  
  const mapOSCValueToX = (oscValue, canvasWidth) => {
    // Calculate X coordinate using the formula
    return (oscValue + 1.2) * (canvasWidth / 2);
  };

  const mapOSCValueToY = (oscValue, canvasHeight) => {
    // Calculate Y coordinate using the formula
    return (-oscValue + 0.9) * (canvasHeight / 2);
  };

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
        <button onClick={handleStartDrawing} className="btn btn-success me-2">
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
              <circle key={index} cx={circle.x} cy={circle.y} r="10" fill="red" />
            ))}
          </svg>
        </div>
        <div className="button-container"></div>
      </div>
    </div>
  );
};

export default OSPPaintingCanvas;
