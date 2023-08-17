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
            y: mapOSCValueToY(entry['X-POS'], canvasDimensions.height),
            x: mapOSCValueToX(entry['Y-POS'], canvasDimensions.width),
            
          }));
          setDrawing(transformedData);
        })
        .catch((error) => {
          console.error('Error fetching OSC data:', error);
        });
    }
  }, [isDrawingStarted, canvasDimensions]);
  

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


  const mapOSCValueToX = (oscValue, canvasWidth) => {
    // Calculate X coordinate using the formula
    return (oscValue + 1.2) * (canvasWidth/2 );
  };

  const mapOSCValueToY = (oscValue, canvasHeight) => {
    // Calculate Y coordinate using the formula
    return ( - oscValue + 0.9) * (canvasHeight/2);
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
  <button onClick={handleClearData} className="btn btn-danger me-1">
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
