import React, { useState, useEffect } from 'react';
import './PaintingCanvas.css';

const PaintingCanvas = ({ width, height }) => {
  const [isPainting, setIsPainting] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#0000FF');
  const [drawing, setDrawing] = useState([]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      const newDrawing = [...drawing];
      newDrawing.push([]);
      setDrawing(newDrawing);
      setIsPainting(true);
      handleMouseMove(event);
    };

    const handleMouseMove = (event) => {
      if (!isPainting) return;
      const { clientX, clientY } = event;
      const rect = event.target.getBoundingClientRect();
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

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPainting, drawing]);

  const handleClearCanvas = () => {
    setDrawing([]);
  };

  return (
    <div className="painting-canvas-container">
      <div className="canvas" style={{ width, height }}>
        <button className="clear-button" onClick={handleClearCanvas}>
          Clear Canvas
        </button>
        <svg className="drawing" style={{ width, height }}>
          {drawing.map((line, index) => (
            <polyline
              key={index}
              points={line.map(({ x, y }) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default PaintingCanvas;
