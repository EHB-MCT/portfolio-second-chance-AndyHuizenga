import React, { useState, useEffect } from 'react';
import './PaintingCanvas.css';
import { handleClearData } from './Buttons';

const OSPPaintingCanvas = () => {
  const [drawing, setDrawing] = useState([]);
  const [isDrawingStarted, setIsDrawingStarted] = useState(false);
  const [isDrawingSaved, setIsDrawingSaved] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    
    const canvasElement = document.querySelector('.canvas');
    setCanvasDimensions({
        width: canvasElement.offsetWidth,
        height: canvasElement.offsetHeight,
      });
    if (isDrawingStarted) {
      // Fetch OSC data from your backend server
      fetch('http://localhost:3001/oscdata')
        .then((response) => response.json())
        .then((data) => {
          const transformedData = data.map((entry) => ({
            x: entry['X-POS'],
            y: entry['Y-POS'],
          }));
          setDrawing(transformedData);
        })
        .catch((error) => {
          console.error('Error fetching OSC data:', error);
        });
    }
  }, [isDrawingStarted]);
  

  const handleStartDrawing = () => {
    setIsDrawingStarted(true);
    console.log('Drawing with OSC started');
  };

  const handleSaveDrawing = () => {
    setIsDrawingSaved(true);
    console.log('Drawing saved');
    alert('Drawing with OSC saved');
    const savedDrawingData = [...drawing];
    console.log('Saved Drawing Data:', savedDrawingData);
  };

  const handleClearDrawing = () => {
    // Clear the drawing data array
    setDrawing([]);
    console.log('Drawing data cleared');
  };

  return (
    <div className="painting-canvas-container">
         

      <div className="canvas">
        <svg className="drawing">
        {drawing.map((circle, index) => (
  <circle
    key={index}
    cx={circle.x * canvasDimensions.width}
    cy={circle.y * canvasDimensions.height}
    r="10"
    fill="red"
  />
))}

        </svg>
      </div>
      <div className="button-container">
        <button onClick={handleStartDrawing}>Start OSC Drawing</button>
        <button onClick={handleSaveDrawing} disabled={!isDrawingStarted}>Save Drawing </button>
<button onClick={handleClearDrawing}>Clear Drawing</button>
<button onClick={handleClearData}>Clear OSC Data</button>
      </div>
    </div>
  );
};

export default OSPPaintingCanvas;
