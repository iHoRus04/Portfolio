"use client";

import { useEffect, useRef } from "react";

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Multi-frequency undulating wave curves (Crimson & Ruby Red Harmonics)
    const waves = [
      {
        amplitude: 34,
        frequency: 0.0032,
        speed: 0.012,
        phase: 0,
        yOffset: 0.32,
        colorStart: "rgba(188, 2, 2, 0)",
        colorMid: "rgba(255, 0, 0, 0.45)",
        colorEnd: "rgba(188, 2, 2, 0)",
        glowColor: "rgba(255, 0, 0, 0.15)",
        lineWidth: 1.8,
      },
      {
        amplitude: 46,
        frequency: 0.0024,
        speed: -0.009,
        phase: 1.5,
        yOffset: 0.46,
        colorStart: "rgba(131, 0, 0, 0)",
        colorMid: "rgba(255, 30, 30, 0.5)",
        colorEnd: "rgba(131, 0, 0, 0)",
        glowColor: "rgba(255, 30, 30, 0.18)",
        lineWidth: 2.2,
      },
      {
        amplitude: 26,
        frequency: 0.0042,
        speed: 0.016,
        phase: 3.1,
        yOffset: 0.58,
        colorStart: "rgba(188, 2, 2, 0)",
        colorMid: "rgba(188, 2, 2, 0.38)",
        colorEnd: "rgba(188, 2, 2, 0)",
        glowColor: "rgba(188, 2, 2, 0.12)",
        lineWidth: 1.5,
      },
      {
        amplitude: 52,
        frequency: 0.0019,
        speed: -0.007,
        phase: 4.4,
        yOffset: 0.68,
        colorStart: "rgba(131, 0, 0, 0)",
        colorMid: "rgba(255, 0, 0, 0.4)",
        colorEnd: "rgba(131, 0, 0, 0)",
        glowColor: "rgba(255, 0, 0, 0.14)",
        lineWidth: 2.0,
      },
      {
        amplitude: 40,
        frequency: 0.0028,
        speed: 0.01,
        phase: 2.2,
        yOffset: 0.52,
        colorStart: "rgba(188, 2, 2, 0)",
        colorMid: "rgba(255, 50, 50, 0.35)",
        colorEnd: "rgba(188, 2, 2, 0)",
        glowColor: "rgba(255, 50, 50, 0.12)",
        lineWidth: 1.4,
      },
    ];

    // Pre-cache linear gradients so we NEVER allocate in the 60fps render loop
    let cachedGradients: CanvasGradient[] = [];
    let cachedGlowGradients: CanvasGradient[] = [];

    const rebuildGradients = () => {
      cachedGradients = waves.map((wave) => {
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, wave.colorStart);
        grad.addColorStop(0.18, wave.colorMid);
        grad.addColorStop(0.5, wave.colorMid);
        grad.addColorStop(0.82, wave.colorMid);
        grad.addColorStop(1, wave.colorEnd);
        return grad;
      });

      cachedGlowGradients = waves.map((wave) => {
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.2, wave.glowColor);
        grad.addColorStop(0.5, wave.glowColor);
        grad.addColorStop(0.8, wave.glowColor);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        return grad;
      });
    };

    rebuildGradients();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      rebuildGradients();
    };

    window.addEventListener("resize", handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      // Delta time physics to avoid any stutter during frame drops or 120Hz/144Hz monitors
      const dt = Math.min((currentTime - lastTime) / 16.67, 2.5);
      lastTime = currentTime;

      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < waves.length; i++) {
          const wave = waves[i];
          wave.phase += wave.speed * dt;

          const cy = height * wave.yOffset;

          // Build single smooth line path
          ctx.beginPath();
          for (let x = 0; x <= width; x += 8) {
            const y =
              cy +
              Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
              Math.sin(x * wave.frequency * 0.5 + wave.phase * 0.7) *
                (wave.amplitude * 0.35);

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          // Pass 1: Soft Ambient Glow (pure hardware GPU stroke, 0ms lag!)
          ctx.lineWidth = wave.lineWidth * 2.8;
          ctx.strokeStyle = cachedGlowGradients[i];
          ctx.stroke();

          // Pass 2: Crisp Core Laser Line
          ctx.lineWidth = wave.lineWidth;
          ctx.strokeStyle = cachedGradients[i];
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80 z-0"
      aria-hidden="true"
    />
  );
}
