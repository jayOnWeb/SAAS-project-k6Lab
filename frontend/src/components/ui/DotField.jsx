import React, { useRef, useEffect } from 'react';

export default function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  gradientFrom = '#ef4444',
  gradientTo = '#b91c1c',
  glowColor = '#120F17',
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const updateSize = () => {
      const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : canvas.getBoundingClientRect();
      canvas.width = rect.width || window.innerWidth;
      canvas.height = rect.height || window.innerHeight;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    // Color conversion helpers
    const hexToRgb = (hex) => {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      const num = parseInt(c, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    };

    const rgbFrom = hexToRgb(gradientFrom);
    const rgbTo = hexToRgb(gradientTo);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      // Draw glow under dots if active
      if (mX > 0 && mY > 0 && glowRadius > 0) {
        const glowGrad = ctx.createRadialGradient(mX, mY, 0, mX, mY, glowRadius);
        glowGrad.addColorStop(0, glowColor || 'rgba(239, 68, 68, 0.25)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mX, mY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      const cols = Math.ceil(canvas.width / dotSpacing) + 2;
      const rows = Math.ceil(canvas.height / dotSpacing) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const origX = i * dotSpacing;
          const origY = j * dotSpacing;

          let posX = origX;
          let posY = origY;

          // Wave effect if enabled
          if (waveAmplitude > 0) {
            posY += Math.sin(time + origX * 0.02) * waveAmplitude;
          }

          const dx = mX - origX;
          const dy = mY - origY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let scale = 1;
          let alpha = 0.25;

          if (dist < cursorRadius && mX > 0 && mY > 0) {
            const normDist = 1 - dist / cursorRadius;
            const factor = Math.pow(normDist, 2);

            // Bulge displacement
            const push = factor * bulgeStrength * cursorForce;
            const angle = Math.atan2(dy, dx);
            posX -= Math.cos(angle) * push;
            posY -= Math.sin(angle) * push;

            scale = 1 + factor * 1.4;
            alpha = 0.25 + factor * 0.65;
          }

          if (sparkle) {
            alpha += Math.sin(time * 3 + i * 7 + j * 13) * 0.1;
            alpha = Math.max(0.1, Math.min(1, alpha));
          }

          // Interpolate color between gradientFrom and gradientTo based on x ratio
          const ratio = Math.min(1, Math.max(0, posX / canvas.width));
          const r = Math.round(rgbFrom.r + (rgbTo.r - rgbFrom.r) * ratio);
          const g = Math.round(rgbFrom.g + (rgbTo.g - rgbFrom.g) * ratio);
          const b = Math.round(rgbFrom.b + (rgbTo.b - rgbFrom.b) * ratio);

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(posX, posY, dotRadius * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    dotRadius,
    dotSpacing,
    bulgeStrength,
    glowRadius,
    sparkle,
    waveAmplitude,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    gradientFrom,
    gradientTo,
    glowColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0, ...style }}
    />
  );
}
