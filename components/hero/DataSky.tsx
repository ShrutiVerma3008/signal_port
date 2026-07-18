"use client";

import { useEffect, useRef } from "react";

export default function DataSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true });
    if (!gl) return;

    // ─── Resize ──────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ─── Shader source ────────────────────────────────────────────────────
    const vsSource = `#version 300 es
      in vec2 a_pos;
      in float a_alpha;
      uniform vec2 u_res;
      out float v_alpha;
      void main() {
        vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
        gl_PointSize = 2.0;
        v_alpha = a_alpha;
      }
    `;
    const fsSource = `#version 300 es
      precision mediump float;
      in float v_alpha;
      out vec4 fragColor;
      void main() {
        fragColor = vec4(1.0, 0.95, 0.85, v_alpha);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const aPos = gl.getAttribLocation(prog, "a_pos");
    const aAlpha = gl.getAttribLocation(prog, "a_alpha");
    const uRes = gl.getUniformLocation(prog, "u_res");

    // ─── Node graph stars ─────────────────────────────────────────────────
    const NODE_COUNT = 300;
    const nodes: { x: number; y: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random(),
        y: Math.random() * 0.6, // upper 60%
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
      });
    }

    // Precompute edges (pairs within 0.08 distance)
    const edges: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 0.07) edges.push([i, j]);
      }
    }

    // ─── Line shader (for edges + streaks) ───────────────────────────────
    const vsLine = `#version 300 es
      in vec2 a_pos;
      in float a_alpha;
      uniform vec2 u_res;
      out float v_alpha;
      void main() {
        vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
        v_alpha = a_alpha;
      }
    `;
    const fsLine = `#version 300 es
      precision mediump float;
      in float v_alpha;
      out vec4 fragColor;
      void main() {
        fragColor = vec4(1.0, 0.85, 0.5, v_alpha);
      }
    `;
    const vsL = compile(gl.VERTEX_SHADER, vsLine);
    const fsL = compile(gl.FRAGMENT_SHADER, fsLine);
    const progLine = gl.createProgram()!;
    gl.attachShader(progLine, vsL);
    gl.attachShader(progLine, fsL);
    gl.linkProgram(progLine);

    const aPosL = gl.getAttribLocation(progLine, "a_pos");
    const aAlphaL = gl.getAttribLocation(progLine, "a_alpha");
    const uResL = gl.getUniformLocation(progLine, "u_res");

    // Buffers
    const pointBuf = gl.createBuffer()!;
    const lineBuf = gl.createBuffer()!;

    // ─── Streaks ──────────────────────────────────────────────────────────
    type Streak = {
      x: number; y: number;
      vx: number; vy: number;
      trail: { x: number; y: number }[];
      life: number;
      maxLife: number;
    };
    const streaks: Streak[] = [];
    let nextStreak = 0;

    const spawnStreak = (now: number) => {
      nextStreak = now + 1500 + Math.random() * 2500;
      streaks.push({
        x: Math.random(),
        y: Math.random() * 0.4,
        vx: (0.002 + Math.random() * 0.003) * (Math.random() < 0.5 ? 1 : -1),
        vy: 0.001 + Math.random() * 0.002,
        trail: [],
        life: 0,
        maxLife: 1200 + Math.random() * 800,
      });
    };

    // ─── Render loop ──────────────────────────────────────────────────────
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive

    let last = 0;
    const render = (now: number) => {
      if (pausedRef.current) { animRef.current = requestAnimationFrame(render); return; }
      const dt = now - last; last = now;
      const W = canvas.width; const H = canvas.height;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // ── Draw edge lines ───────────────────────────────────────────────
      gl.useProgram(progLine);
      gl.uniform2f(uResL, W, H);
      const lineData: number[] = [];
      for (const [i, j] of edges) {
        const t = now * 0.001;
        const ai = (0.05 + 0.04 * Math.sin(nodes[i].phase + t * nodes[i].speed));
        const aj = (0.05 + 0.04 * Math.sin(nodes[j].phase + t * nodes[j].speed));
        const avg = (ai + aj) * 0.5;
        lineData.push(nodes[i].x * W, nodes[i].y * H, avg);
        lineData.push(nodes[j].x * W, nodes[j].y * H, avg);
      }
      if (lineData.length > 0) {
        const arr = new Float32Array(lineData);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW);
        const stride = 3 * 4;
        gl.enableVertexAttribArray(aPosL);
        gl.vertexAttribPointer(aPosL, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(aAlphaL);
        gl.vertexAttribPointer(aAlphaL, 1, gl.FLOAT, false, stride, 8);
        gl.drawArrays(gl.LINES, 0, lineData.length / 3);
      }

      // ── Draw streak trails ────────────────────────────────────────────
      const streakData: number[] = [];
      for (let si = streaks.length - 1; si >= 0; si--) {
        const s = streaks[si];
        s.life += dt;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 40) s.trail.shift();
        s.x += s.vx; s.y += s.vy;
        if (s.life > s.maxLife) { streaks.splice(si, 1); continue; }
        for (let ti = 1; ti < s.trail.length; ti++) {
          const a = (ti / s.trail.length) * 0.6 * (1 - s.life / s.maxLife);
          streakData.push(s.trail[ti - 1].x * W, s.trail[ti - 1].y * H, a);
          streakData.push(s.trail[ti].x * W, s.trail[ti].y * H, a);
        }
      }
      if (streakData.length > 0) {
        const arr = new Float32Array(streakData);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW);
        const stride = 3 * 4;
        gl.enableVertexAttribArray(aPosL);
        gl.vertexAttribPointer(aPosL, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(aAlphaL);
        gl.vertexAttribPointer(aAlphaL, 1, gl.FLOAT, false, stride, 8);
        gl.drawArrays(gl.LINES, 0, streakData.length / 3);
      }
      if (now > nextStreak) spawnStreak(now);

      // ── Draw node points ──────────────────────────────────────────────
      gl.useProgram(prog);
      gl.uniform2f(uRes, W, H);
      const pointData: number[] = [];
      const t = now * 0.001;
      for (const n of nodes) {
        const a = 0.3 + 0.5 * Math.sin(n.phase + t * n.speed);
        pointData.push(n.x * W, n.y * H, a);
      }
      const pArr = new Float32Array(pointData);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pArr, gl.DYNAMIC_DRAW);
      const stride = 3 * 4;
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(aAlpha);
      gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, stride, 8);
      gl.drawArrays(gl.POINTS, 0, NODE_COUNT);

      animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);

    // ─── IntersectionObserver — pause when off-screen ─────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
