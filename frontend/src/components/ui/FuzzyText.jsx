import React, { useRef, useEffect, useState } from 'react';

export default function FuzzyText({
  children = 'Fuzzy',
  baseIntensity = 0.2,
  hoverIntensity = 0.5,
  enableHover = true,
  color = '#ffffff',
  fontSize = 'clamp(2.5rem, 6vw, 4.5rem)',
  fontWeight = 900,
  fontFamily = 'Space Grotesk, sans-serif',
  className = '',
}) {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const textStr = React.Children.toArray(children).join('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    const updateCanvasSize = () => {
      const tempDiv = document.createElement('div');
      tempDiv.style.fontSize = fontSize;
      tempDiv.style.fontFamily = fontFamily;
      tempDiv.style.fontWeight = fontWeight.toString();
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'nowrap';
      tempDiv.innerText = textStr;
      document.body.appendChild(tempDiv);

      const computedStyle = window.getComputedStyle(tempDiv);
      const pxSize = parseFloat(computedStyle.fontSize) || 64;
      document.body.removeChild(tempDiv);

      const fontStr = `${fontWeight} ${pxSize}px ${fontFamily}`;
      ctx.font = fontStr;

      const textMetrics = ctx.measureText(textStr);
      // Give ample horizontal and vertical padding to avoid clipping edge characters like 't'
      const width = Math.ceil(textMetrics.width) + 90;
      const height = Math.ceil(pxSize * 1.4) + 30;

      canvas.width = width;
      canvas.height = height;

      offCanvas.width = width;
      offCanvas.height = height;
      offCtx.font = fontStr;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let time = 0;

    const render = () => {
      time += 0.05;
      const currentIntensity = isHovered && enableHover ? hoverIntensity : baseIntensity;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);

      // Draw text safely with padding to prevent edge cropping
      offCtx.fillStyle = color;
      offCtx.textBaseline = 'middle';
      offCtx.fillText(textStr, 25, offCanvas.height / 2);

      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const pixels = imgData.data;

      const maxJitter = currentIntensity * 10;

      ctx.fillStyle = color;
      ctx.textBaseline = 'middle';

      for (let y = 0; y < offCanvas.height; y += 2) {
        for (let x = 0; x < offCanvas.width; x += 2) {
          const index = (y * offCanvas.width + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 30) {
            const jitterX = (Math.random() - 0.5) * maxJitter;
            const jitterY = (Math.random() - 0.5) * maxJitter;
            
            ctx.fillStyle = `rgba(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]}, ${alpha / 255})`;
            ctx.fillRect(x + jitterX, y + jitterY, 2, 2);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [textStr, baseIntensity, hoverIntensity, enableHover, isHovered, color, fontSize, fontWeight, fontFamily]);

  return (
    <span
      className={`inline-block relative cursor-pointer select-none align-middle ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="inline-block align-middle" />
    </span>
  );
}
