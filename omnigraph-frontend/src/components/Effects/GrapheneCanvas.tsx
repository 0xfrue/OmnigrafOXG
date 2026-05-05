"use client";

import { useEffect, useRef } from "react";

export function GrapheneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let grid: { bx: number; by: number; ph: number; sp: number; am: number; op: number }[] = [];
    let particles: any[] = [];
    let mx = -9999, my = -9999;
    const S = 22;
    const LIFT_R = 200;
    const GLOW_R = 300;

    const build = () => {
      grid = [];
      const dx = S * 1.78, dy = S * 1.54;
      const cols = Math.ceil(W / dx) + 4;
      const rows = Math.ceil(H / dy) + 4;
      for (let r = -2; r < rows; r++)
        for (let c = -2; c < cols; c++)
          grid.push({
            bx: c * dx + (r & 1 ? dx / 2 : 0),
            by: r * dy,
            ph: Math.random() * 6.28,
            sp: 0.0012 + Math.random() * 0.002,
            am: 1.2 + Math.random() * 2,
            op: 0.02 + Math.random() * 0.035,
          });
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      build();
    };

    const hex = (cx: number, cy: number, r: number, opacity: number, lift: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      if (lift > 0.08) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4);
        g.addColorStop(0, `rgba(56,189,248,${(lift * 0.18).toFixed(3)})`);
        g.addColorStop(1, "rgba(56,189,248,0)");
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = `rgba(56,189,248,${Math.min(opacity + lift * 0.6, 1).toFixed(3)})`;
        ctx.lineWidth = 0.7 + lift * 2;
        ctx.shadowColor = `rgba(56,189,248,${(lift * 0.7).toFixed(3)})`;
        ctx.shadowBlur = lift * 25;
      } else {
        ctx.strokeStyle = `rgba(56,189,248,${opacity.toFixed(4)})`;
        ctx.lineWidth = 0.5;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const burst = (x: number, y: number) => {
      for (let i = 0; i < 18; i++) {
        const a = (6.28 / 18) * i + (Math.random() - 0.5) * 0.3;
        const v = 10 + Math.random() * 8;
        particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, sz: 8 + Math.random() * 14, life: 1, decay: 0.008 + Math.random() * 0.008, rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 0.15, type: "hex", r: 56, g: 189, b: 248 });
      }
      for (let i = 0; i < 28; i++) {
        const a = Math.random() * 6.28;
        const v = 5 + Math.random() * 12;
        particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, sz: 4 + Math.random() * 10, life: 1, decay: 0.01 + Math.random() * 0.015, rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 0.2, type: Math.random() > 0.4 ? "hex" : "dot", r: Math.random() > 0.5 ? 56 : 100, g: Math.random() > 0.5 ? 189 : 220, b: 248 });
      }
      for (let i = 0; i < 20; i++) {
        const a = Math.random() * 6.28;
        const v = 2 + Math.random() * 5;
        particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, sz: 3 + Math.random() * 6, life: 1, decay: 0.006 + Math.random() * 0.01, rot: 0, spin: 0, type: "glow", r: 120, g: 200, b: 255 });
      }
      for (let i = 0; i < 30; i++) {
        const a = Math.random() * 6.28;
        const v = 8 + Math.random() * 16;
        particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, sz: 1 + Math.random() * 3, life: 1, decay: 0.02 + Math.random() * 0.03, rot: 0, spin: 0, type: "spark", r: 200, g: 230, b: 255 });
      }
      particles.push({ x, y, vx: 0, vy: 0, sz: 5, life: 1, decay: 0.025, rot: 0, spin: 0, type: "ring", r: 56, g: 189, b: 248 });
    };

    const drawParticle = (p: any) => {
      const a = p.life;
      const c = `rgba(${p.r},${p.g},${p.b},`;
      if (p.type === "hex") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i;
          if (i === 0) ctx.moveTo(p.sz * Math.cos(ang), p.sz * Math.sin(ang));
          else ctx.lineTo(p.sz * Math.cos(ang), p.sz * Math.sin(ang));
        }
        ctx.closePath();
        ctx.strokeStyle = c + (a * 0.85).toFixed(3) + ")";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = c + (a * 0.5).toFixed(3) + ")";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else if (p.type === "dot") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz * 0.45, 0, 6.28);
        ctx.fillStyle = c + (a * 0.8).toFixed(3) + ")";
        ctx.shadowColor = c + (a * 0.4).toFixed(3) + ")";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.type === "glow") {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.sz * 2);
        g.addColorStop(0, c + (a * 0.6).toFixed(3) + ")");
        g.addColorStop(0.5, c + (a * 0.2).toFixed(3) + ")");
        g.addColorStop(1, c + "0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz * 2, 0, 6.28);
        ctx.fill();
      } else if (p.type === "spark") {
        ctx.fillStyle = c + a.toFixed(3) + ")";
        ctx.fillRect(p.x - 0.5, p.y - 0.5, 1 + p.sz * a, 1 + p.sz * a);
      } else if (p.type === "ring") {
        const radius = (1 - a) * 150 + 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, 6.28);
        ctx.strokeStyle = c + (a * 0.4).toFixed(3) + ")";
        ctx.lineWidth = 2 * a;
        ctx.stroke();
      }
    };

    const tickParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.955;
        p.vy *= 0.955;
        p.vy += 0.03;
        p.life -= p.decay;
        p.rot += p.spin;
        if (p.type !== "ring") p.sz *= 0.995;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        drawParticle(p);
      }
    };

    let t = 0;
    let raf = 0;
    const frame = () => {
      t++;
      ctx.clearRect(0, 0, W, H);
      for (const h of grid) {
        const hx = h.bx + Math.sin(t * h.sp + h.ph) * h.am;
        const hy = h.by + Math.cos(t * h.sp * 0.7 + h.ph) * h.am * 0.5;
        const d = Math.hypot(hx - mx, hy - my);
        const lift = d < LIFT_R ? Math.pow(1 - d / LIFT_R, 1.6) : 0;
        const glow = d < GLOW_R ? (1 - d / GLOW_R) * 0.1 : 0;
        const s = S + lift * S * 0.4;
        const px = lift > 0 ? (mx - hx) * lift * 0.06 : 0;
        const py = lift > 0 ? (my - hy) * lift * 0.06 : 0;
        hex(hx + px, hy + py, s, h.op + glow, lift);
      }
      tickParticles();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onOut = () => { mx = -9999; my = -9999; };
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("[data-burst]");
      if (!target) return;
      const r = (target as HTMLElement).getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);
    document.addEventListener("click", onClick);

    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={ref} id="graphene-canvas" />;
}
