import React, { useState, useEffect } from 'react';
import './PaintingCanvas.css';

const PaintingCanvas = () => {
  const [isPainting, setIsPainting] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#0000FF');
  const [drawing, setDrawing] = useState([]);

       /**
  * TYPE: REACT functional component
  * NAME: useEffect
  * FUNCTION: use the useEffect hook to add event listeners to the canvas element
 */


  useEffect(() => {
    const handleMouseDown = (event) => {
      const newDrawing = [...drawing];
      newDrawing.push([]);
      setDrawing(newDrawing);
      setIsPainting(true);
      handleMouseMove(event);
    };
//draw a line for the mouse movement
    const handleMouseMove = (event) => {
      if (!isPainting) return;
      const { clientX, clientY } = event;
      const canvas = document.querySelector('.canvas');
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const updatedDrawing = [...drawing];
      const lastLine = updatedDrawing[updatedDrawing.length - 1];
      lastLine.push({ x, y });

      setDrawing(updatedDrawing);
    };

    const handleMouseUp = () => {
      setIsPainting(false);
    };

    // Add event listeners to the canvas element
    const canvas = document.querySelector('.canvas');
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners when component unmounts
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPainting, drawing, strokeColor ]);

  const handleClearCanvas = () => {
    setDrawing([]); // Clear the drawing array
  };
  

  return (

    <div>
            <h1>Paintig canvas</h1>
            <button onClick={handleClearCanvas} className="btn btn-danger mt-2">Clear Canvas</button>

    <div className="painting-canvas-container">
      <div className="canvas">
        <svg className="drawing">
          {drawing.map((line, index) => (
            <polyline
              key={index}
              points={line.map(({ x, y }) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={strokeColor} // Use the selected stroke color
              strokeWidth="3"
            />
          ))}
        </svg>
      </div>
    </div>
    </div>
  );
};

export default PaintingCanvas;
