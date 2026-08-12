import React, { useRef, useEffect } from 'react';

export default function FuzzyText({
  children = 'Fuzzy',
  baseIntensity = 0.2,
  hoverIntensity = 0.5,
  enableHover = true,
  color = '#ffffff',
  fontSize,
  fontWeight = 900,
  fontFamily = 'Space Grotesk, sans-serif',
  className = '',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isHoveredRef = useRef(false);
  const inViewRef = useRef(true);
  const textStr = React.Children.toArray(children).join('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let lastRenderTime = 0;
    const targetFps = 30;
    const frameInterval = 1000 / targetFps;

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    const updateCanvasSizeAndParticles = () => {
      if (!offCtx || !canvas) return;

      const parentEl = containerRef.current?.parentElement || canvas.parentElement;
      const computed = parentEl ? window.getComputedStyle(parentEl) : null;
      
      let pxSize = 64;
      if (fontSize) {
        const tempDiv = document.createElement('div');
        tempDiv.style.fontSize = fontSize;
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        document.body.appendChild(tempDiv);
        pxSize = parseFloat(window.getComputedStyle(tempDiv).fontSize) || 64;
        document.body.removeChild(tempDiv);
      } else if (computed) {
        pxSize = parseFloat(computed.fontSize) || 64;
      }

      const compFontWeight = computed ? computed.fontWeight : fontWeight.toString();
      const compFontFamily = computed ? computed.fontFamily : fontFamily;
      const fontStr = `${compFontWeight} ${pxSize}px ${compFontFamily}`;

      offCtx.font = fontStr;

      const textMetrics = offCtx.measureText(textStr);
      const padX = 5; // Compact padding for crisp subtle jitter
      const width = Math.ceil(textMetrics.width) + padX * 2;
      const height = Math.ceil(pxSize * 1.16);

      canvas.width = width;
      canvas.height = height;

      offCanvas.width = width;
      offCanvas.height = height;
      offCtx.font = fontStr;

      // Draw text to offscreen canvas precisely positioned
      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = color;
      offCtx.textBaseline = 'middle';
      offCtx.fillText(textStr, padX, height / 2);

      // Pre-extract active pixel coordinates ONCE
      const imgData = offCtx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      const newParticles = [];

      const step = 2;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 30) {
            newParticles.push({
              x,
              y,
              alpha: alpha / 255
            });
          }
        }
      }
      particles = newParticles;
    };

    updateCanvasSizeAndParticles();
    window.addEventListener('resize', updateCanvasSizeAndParticles);

    // Re-draw once custom web fonts (Space Grotesk) have finished loading
    if (document.fonts) {
      document.fonts.ready.then(() => {
        updateCanvasSizeAndParticles();
      });
    }

    // Pause animation when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);

      if (!inViewRef.current || document.hidden) return;

      const elapsed = currentTime - lastRenderTime;
      if (elapsed < frameInterval) return;
      lastRenderTime = currentTime - (elapsed % frameInterval);

      const currentIntensity = isHoveredRef.current && enableHover ? hoverIntensity : baseIntensity;
      const maxJitter = currentIntensity * 6.5;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        const jitterX = (Math.random() - 0.5) * maxJitter;
        const jitterY = (Math.random() - 0.5) * maxJitter;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x + jitterX, p.y + jitterY, 2, 2);
      }
      ctx.globalAlpha = 1.0;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSizeAndParticles);
      observer.disconnect();
    };
  }, [textStr, baseIntensity, hoverIntensity, enableHover, color, fontSize, fontWeight, fontFamily]);

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center justify-center relative cursor-pointer select-none align-middle ${className}`}
      style={{ lineHeight: 1 }}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      <canvas ref={canvasRef} className="block align-middle" />
    </span>
  );
}


