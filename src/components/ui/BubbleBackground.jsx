import { useEffect, useRef } from 'react';

const PALETTE = ['#99C4F4', '#2474C0'];
const BUBBLE_COUNT = 15;

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function getGridCells(width, height, count) {
  const cols = Math.max(1, Math.round(Math.sqrt((count * width) / height)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const cellW = width / cols;
  const cellH = height / rows;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: c * cellW, y: r * cellH, w: cellW, h: cellH });
    }
  }

  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  return cells.slice(0, count);
}

function createBubble(cell, index) {
  const color = PALETTE[index % PALETTE.length];
  const cellMin = Math.min(cell.w, cell.h);
  const baseRadius = Math.max(cellMin * (0.35 + Math.random() * 0.2), 120);

  return {
    color: hexToRgb(color),
    baseRadius,
    anchorX: cell.x + cell.w / 2 + (Math.random() - 0.5) * cell.w * 0.3,
    anchorY: cell.y + cell.h / 2 + (Math.random() - 0.5) * cell.h * 0.3,
    ampX: cell.w * (0.1 + Math.random() * 0.08),
    ampY: cell.h * (0.1 + Math.random() * 0.08),
    speedX: 0.00012 + Math.random() * 0.00012,
    speedY: 0.00009 + Math.random() * 0.00015,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    pulseSpeed: 0.0002 + Math.random() * 0.0003,
    pulsePhase: Math.random() * Math.PI * 2,
    opacity: 0.25 + Math.random() * 0.2,
  };
}

export default function BubbleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let bubbles = [];
    let rafId;
    const startTime = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : canvas.clientWidth || window.innerWidth;
      height = parent ? parent.clientHeight : canvas.clientHeight || window.innerHeight;
      if (!width) width = window.innerWidth;
      if (!height) height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      bubbles = getGridCells(width, height, BUBBLE_COUNT).map(createBubble);
    };

    const drawFrame = (t) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const elapsed = t - startTime;
      for (const b of bubbles) {
        const x = b.anchorX + Math.sin(elapsed * b.speedX + b.phaseX) * b.ampX;
        const y = b.anchorY + Math.cos(elapsed * b.speedY + b.phaseY) * b.ampY;
        const pulse = Math.sin(elapsed * b.pulseSpeed + b.pulsePhase);
        const radius = b.baseRadius * (1 + pulse * 0.12);
        const alpha = b.opacity + pulse * 0.08;
        const { r, g, b: bl } = b.color;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${bl}, ${alpha})`);
        gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${bl}, ${alpha * 0.6})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${bl}, ${alpha * 0.2})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${bl}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(drawFrame);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      drawFrame(startTime);
    } else {
      rafId = requestAnimationFrame(drawFrame);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ zIndex: -1, filter: 'blur(75px)' }}
    />
  );
}