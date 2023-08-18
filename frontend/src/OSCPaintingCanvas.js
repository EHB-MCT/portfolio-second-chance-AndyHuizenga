import React, { useState, useEffect } from 'react';
import './PaintingCanvas.css';
import { handleClearData } from './Buttons';



const OSPPaintingCanvas = () => {
  const [drawing, setDrawing] = useState([]);
  const [isDrawingStarted, setIsDrawingStarted] = useState(false);
  const [isDrawingSaved, setIsDrawingSaved] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [savedDrawingData, setSavedDrawingData] = useState([]); 

  useEffect(() => {
    const canvasElement = document.querySelector('.canvas');
    const dimensions = {
      width: canvasElement.offsetWidth,
      height: canvasElement.offsetHeight,
    };
    setCanvasDimensions(dimensions);
  
    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:3001');
    console.log(' WebSocket connected - OSC');
    socket.addEventListener('message', (event) => {
      const oscData = JSON.parse(event.data);
      const newDot = {
        x: mapOSCValueToX(oscData['Y-POS'], dimensions.width),
        y: mapOSCValueToY(oscData['X-POS'], dimensions.height),
      };

      console.log('newDot', newDot);
      setDrawing(prevDrawing => [...prevDrawing, newDot]);
    });
  
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection');
        socket.close();
      }
    };
  }, [drawing]); // You should include 'drawing' as a dependency

  const handleStartDrawing = () => {
    setIsDrawingStarted(true);
    console.log('Drawing with OSC started');
  };
 

  const handleSaveDrawing = async () => {
    setIsDrawingSaved(true);
    console.log('Drawing saved');

    const chunkSize = 100; // Number of points to send in each chunk
    for (let i = 0; i < savedDrawingData.length; i += chunkSize) {
      const chunk = savedDrawingData.slice(i, i + chunkSize);

      try {
        const response = await fetch('http://localhost:5002/savedrawing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ savedDrawingData: chunk }), // Sending a chunk of data
        });

        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error saving drawing data:', error);
      }
    }
  };
  
  
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
