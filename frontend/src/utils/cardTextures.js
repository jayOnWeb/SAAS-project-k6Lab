// Utility to generate dynamic high-res card textures for 3D Lanyard cards

export function createFeatureCardTexture(title, desc, tag = "K6 LAB FEATURE") {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');

  // Background Dark Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 600, 900);
  bgGrad.addColorStop(0, '#180c12');
  bgGrad.addColorStop(0.4, '#09070a');
  bgGrad.addColorStop(1, '#1f080e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 600, 900);

  // Outer Border & Red Corner Glow
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 12;
  ctx.strokeRect(12, 12, 576, 876);

  // Glass Inner Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 540, 840);

  // Header Badge Box
  ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
  ctx.fillRect(50, 70, 500, 70);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 70, 500, 70);

  // Header Tag Text
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(tag, 300, 113);

  // Decorative Central Tech Ring
  ctx.beginPath();
  ctx.arc(300, 340, 100, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(300, 340, 75, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
  ctx.fill();

  // Central Icon Dot
  ctx.beginPath();
  ctx.arc(300, 340, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444';
  ctx.fill();

  // Main Card Title (Multi-line wrapper if needed)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'extrabold 40px sans-serif';
  ctx.textAlign = 'center';

  const words = title.split(' ');
  if (words.length > 2) {
    ctx.fillText(words.slice(0, 2).join(' '), 300, 520);
    ctx.fillText(words.slice(2).join(' '), 300, 570);
  } else {
    ctx.fillText(title, 300, 540);
  }

  // Description / Subtitle Text
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '26px sans-serif';
  ctx.fillText(desc, 300, 640);

  // Red accent line
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(200, 700, 200, 4);

  // Bottom Branding & Serial
  ctx.fillStyle = '#71717a';
  ctx.font = '20px monospace';
  ctx.fillText('LOCAL-FIRST // LOAD TEST ENGINE', 300, 830);

  return canvas.toDataURL('image/png');
}
