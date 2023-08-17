import React, { useState, useEffect, useRef } from 'react';
import './PaintingCanvas.css'

const PaintingCanvas = () => {
  const [paintingWorks, setPaintingWorks] = useState([]);
  const canvasRef = useRef(null);

  const draw = (context, works) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the canvas

    context.strokeStyle = 'blue'; // Set the stroke color
    context.lineWidth = 2; // Set the line width

    works.forEach((work) => {
      context.beginPath();
      context.moveTo(work.startX, work.startY);
      context.lineTo(work.endX, work.endY);
      context.stroke();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    draw(context, paintingWorks);
  }, [paintingWorks]);

  return (
    <div className="painting-canvas-container">
      <div className="canvas">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default PaintingCanvas;
