import React, { useEffect, useRef } from 'react';

const CirclesOverlap = ({ cardWidth, cardHeight }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate center coordinates
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Circle 1 (Red)
    drawCircle(context, 150, 120, 110, '#4c4c4c', 'DeFi Treasury', '54.39%', '15px Arial', 'bold 28px Arial');

    // Circle 2 (Green octagon)
    drawOctagon(context, 260, 70, 70, '#efd7bc', 'Discretionary', '19.62%', '15px Arial', 'bold 23px Arial');

    // Circle 3 (Blue nonagon)
    drawNonagon(context, 300, 160, 50, '#f7be73', 'Operational Treasury', '9.72%', '10px Arial', 'bold 23px Arial');

    // Circle 4 (Yellow)
    drawCircle(context, 90, 250, 60, '#e4e071', 'PoL', '16.27%', '12px Arial', 'bold 20px Arial');

    

  }, [cardWidth, cardHeight]);

  const drawCircle = (context, x, y, radius, fillColor, label, percentage, labelFont, percentageFont) => {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = fillColor;
    context.fill();
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.stroke();
    context.fillStyle = 'white';
    context.font = labelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, x, y - 10);
    context.font = percentageFont;
    context.fillText(percentage, x, y + 20);
  };

  // Function to draw a regular octagon
  const drawOctagon = (context, x, y, radius, fillColor, label, percentage, labelFont, percentageFont) => {
    context.beginPath();
    context.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    for (let i = 1; i <= 8; i++) {
      context.lineTo(x + radius * Math.cos((i * 2 * Math.PI) / 8), y + radius * Math.sin((i * 2 * Math.PI) / 8));
    }
    context.closePath();
    context.fillStyle = fillColor;
    context.fill();
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.stroke();
    context.fillStyle = 'white';
    context.font = labelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, x, y - 10);
    context.font = percentageFont;
    context.fillText(percentage, x, y + 20);
  };

  // Function to draw a regular nonagon
  const drawNonagon = (context, x, y, radius, fillColor, label, percentage, labelFont, percentageFont) => {
    context.beginPath();
    context.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    for (let i = 1; i <= 9; i++) {
      context.lineTo(x + radius * Math.cos((i * 2 * Math.PI) / 9), y + radius * Math.sin((i * 2 * Math.PI) / 9));
    }
    context.closePath();
    context.fillStyle = fillColor;
    context.fill();
    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = 'white';
    context.font = labelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, x, y - 10);
    context.font = percentageFont;
    context.fillText(percentage, x, y + 20);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas ref={canvasRef} width={cardWidth} height={cardHeight}></canvas>
    </div>
  );
};

export default CirclesOverlap;
