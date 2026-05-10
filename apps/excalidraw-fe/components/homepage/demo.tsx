'use client';

import { useRef, useState, useEffect } from 'react';

export function Demo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#f0abfc');
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    const resize = () => {
      const r = c.getBoundingClientRect();
      c.width = r.width * devicePixelRatio;
      c.height = r.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const onUp = () => (drawing.current = false);
  const clear = () => {
    const c = canvasRef.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
  };

  const colors = ['#f0abfc', '#67e8f9', '#a78bfa', '#fde047', '#86efac', '#ffffff'];

  return (
    <section id="demo" className="relative z-20 mx-auto -mt-36 max-w-7xl px-6 pb-24 md:-mt-52">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d14] shadow-[0_30px_100px_-40px_rgba(59,130,246,0.75)]">
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  color === c ? 'border-white scale-110' : 'border-white/20'
                }`}
                style={{ background: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <button
            onClick={clear}
            className="ml-auto rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
          >
            Clear
          </button>
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="block h-[380px] w-full cursor-crosshair touch-none md:h-[440px]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Try it. Right here.</h2>
        <p className="mt-4 text-zinc-400">No signup. No tutorial. Just draw.</p>
      </div>
    </section>
  );
}
  