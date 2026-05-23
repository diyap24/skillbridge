'use client';
import { useEffect, useRef } from 'react';

export function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#190019';
      ctx.fillRect(0, 0, w, h);

      const g1 = ctx.createRadialGradient(
        w * (0.3 + 0.2 * Math.sin(t)),
        h * (0.3 + 0.2 * Math.cos(t * 0.7)),
        0, w * 0.5, h * 0.5, w * 0.8
      );
      g1.addColorStop(0,   'rgba(82,43,91,0.35)');
      g1.addColorStop(0.5, 'rgba(43,18,76,0.5)');
      g1.addColorStop(1,   'rgba(25,0,25,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(
        w * (0.7 + 0.15 * Math.cos(t * 0.6)),
        h * (0.65 + 0.15 * Math.sin(t * 0.9)),
        0, w * 0.6, h * 0.6, w * 0.55
      );
      g2.addColorStop(0,   'rgba(133,79,108,0.18)');
      g2.addColorStop(0.6, 'rgba(82,43,91,0.08)');
      g2.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }} />
  );
}
