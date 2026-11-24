"use client";

import { useEffect, useRef, useState } from "react";
import TypewriterRole from "@/app/components/ui/TypewriterRole";

const TOTAL_FRAMES = 89;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollGuideOpacity, setScrollGuideOpacity] = useState(1);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [contentTranslateY, setContentTranslateY] = useState(30);

  // Helper to get frame image path (frame_0001.webp -> frame_0089.webp)
  const getFrameSrc = (index: number) => {
    const frameNum = (index + 1).toString().padStart(4, "0");
    return `/hero/frame_${frameNum}.webp`;
  };

  // Draw a frame to canvas with object-fit: cover and high quality smoothing
  const renderFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const w = canvas.width;
    const h = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max(w / imgW, h / imgH);
    const x = (w - imgW * scale) / 2;
    const y = (h - imgH * scale) / 2;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, x, y, imgW * scale, imgH * scale);
  };

  // Preload all 89 frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);

      img.onload = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadingProgress(pct);

        // Once the first frame is ready, render it immediately
        if (i === 0) {
          renderFrame(img);
        }

        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      imagesRef.current = [];
    };
  }, []);

  // Handle Resize & Retina DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const frameProgress = Math.min(1, currentProgressRef.current / 0.82);
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(frameProgress * (TOTAL_FRAMES - 1)))
      );
      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        renderFrame(img);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Scroll and Animation Loop (Smooth Lerp Scrubbing)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      targetProgressRef.current = progress;

      // 1. Initial Scroll Guide:
      // Visible at 0%, fades out quickly as user scrolls (0 -> 8%)
      const guideOpacity = Math.max(0, 1 - progress / 0.08);
      setScrollGuideOpacity(guideOpacity);

      // 2. Full Profile Layout Reveal:
      // Hidden while video animation plays (0 -> 72%)
      // Reveals between 72% and 85% as animation completes
      // Stays fully visible from 85% to 100%
      if (progress < 0.72) {
        setContentOpacity(0);
        setContentTranslateY(30);
      } else if (progress <= 0.85) {
        const ratio = (progress - 0.72) / 0.13;
        setContentOpacity(ratio);
        setContentTranslateY((1 - ratio) * 30);
      } else {
        setContentOpacity(1);
        setContentTranslateY(0);
      }
    };

    const updateAnimation = () => {
      // Lerp for smooth scrolling effect
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.12;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      // Map progress (0.0 to 0.82) to 89 frames
      const frameProgress = Math.min(1, currentProgressRef.current / 0.82);
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(frameProgress * (TOTAL_FRAMES - 1)))
      );

      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        renderFrame(img);
      }

      animFrameIdRef.current = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animFrameIdRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-[400vh] w-full bg-black text-white"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Background Canvas for Image Sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
        />

        {/* Subtle vignette for edge contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Mobile Torso-to-Bottom Smooth Black Fade (matches reference: crystal clear face, deep black text backdrop) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-40% to-black/95 to-75% md:hidden" />

        {/* Preload Loading Bar */}
        {!isLoaded && (
          <div className="pointer-events-none absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Loading {loadingProgress}%
            </span>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-[#bc0202] transition-all duration-150"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 1. INITIAL SCROLL GUIDE:
            Visible on black screen at start, instructs user to scroll down, fades out on scroll */}
        <div
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-end pb-24 md:justify-center md:pb-0 transition-opacity duration-300"
          style={{ opacity: scrollGuideOpacity }}
        >
          <button
            type="button"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight * 0.9,
                behavior: "smooth",
              });
            }}
            className="group pointer-events-auto flex flex-col items-center gap-3 cursor-pointer select-none focus-visible:outline-none"
            aria-label="Scroll down to explore"
          >
            {/* Animated mouse icon */}
            <div className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-white/50 p-1.5 shadow-lg shadow-black/60 backdrop-blur-md bg-black/30 transition-all duration-300 group-hover:border-[#bc0202] group-hover:scale-105">
              <div className="h-2.5 w-1 animate-bounce rounded-full bg-[#ff0000]" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-white/80 uppercase transition-colors group-hover:text-white">
              Scroll down to explore
            </span>
            {/* Animated Down Chevron */}
            <svg
              className="h-4 w-4 animate-pulse text-[#ff0000] transition-transform duration-300 group-hover:translate-y-1"
              fill="none"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* 2. FULL EDITORIAL PROFILE LAYOUT:
            Reveals in the exact composition of the reference image once scrolled.
            Mobile: Content is pushed to bottom at torso level ("ngay ngang người"),
                    leaving the upper half (face & head) completely clear and unobstructed, exactly like the reference image.
            Desktop: Spacious two-column editorial spread. */}
        <div
          className="relative z-20 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end md:justify-between px-5 pb-20 sm:px-8 sm:pb-24 md:px-14 md:py-14 lg:px-20 transition-transform duration-100 pointer-events-none"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY}px)`,
          }}
        >
          {/* Top spacer to align with the visual grid on desktop */}
          <div className="hidden md:block h-6" />

          {/* Main Content Row:
              Mobile: Sits snugly at torso level and below (justify-end, no stretching).
              Desktop: Wide two-column editorial spread with items-end justify-between. */}
          <div className="flex flex-col justify-end md:flex-1 md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 md:gap-8 w-full">
            {/* Left Column: Greeting, Big Name, Role, Bio, Buttons & Availability */}
            <div className="flex max-w-lg flex-col justify-end space-y-2.5 sm:space-y-4 md:space-y-8">
              <div className="space-y-1.5 sm:space-y-2.5 md:space-y-3">
                {/* Script "Hello, I'm" */}
                <span
                  className="block text-xs sm:text-2xl md:text-3xl font-light italic text-rose-100/95 tracking-wide"
                  style={{
                    fontFamily:
                      "'Playfair Display', Georgia, 'Times New Roman', serif",
                  }}
                >
                  Hello, I&apos;m
                </span>

                {/* Big Bold Condensed Name */}
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.92] sm:leading-[0.88] drop-shadow-md">
                  TONG THOI
                  <br />
                  DUY HUNG
                </h1>

                {/* Role with Dynamic Typewriter Effect */}
                <h2 className="text-xs sm:text-base md:text-lg lg:text-xl font-black tracking-wider text-[#ff2200] uppercase pt-0.5 sm:pt-2 min-h-[1.5em] sm:min-h-[1.8em] flex items-center">
                  <TypewriterRole />
                </h2>

                {/* Bio / Description from CV */}
                <p className="text-[11px] sm:text-sm text-gray-300 font-normal leading-relaxed max-w-sm pt-0.5 sm:pt-1 line-clamp-2 sm:line-clamp-none">
                  Fresh IT graduate specializing in modern Frontend (React, Next.js, TypeScript)
                  and Fullstack development (Laravel, Node.js, MySQL). Dedicated to building
                  responsive, high-performance web applications.
                </p>

                {/* Action Buttons (Download CV & View Projects) */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1.5 sm:pt-3 pointer-events-auto">
                  <a
                    className="btn-gradient-primary px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-xs"
                    href="/TongThoiDuyHung_Fullstack_CV.pdf"
                    download
                  >
                    {/* Download Icon */}
                    <svg
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download CV</span>
                  </a>
                  <a
                    className="btn-gradient-secondary px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-xs"
                    href="#projects"
                  >
                    View Projects
                  </a>
                </div>
              </div>

              {/* Bottom Tag: Available for Hire / HCM City */}
              <div className="flex items-center gap-2 pt-0.5 sm:pt-2 text-[9px] sm:text-[11px] font-bold tracking-[0.16em] sm:tracking-[0.2em] text-gray-300 uppercase">
                <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-green-500" />
                </span>
                OPEN TO WORK • HO CHI MINH CITY
              </div>
            </div>

            {/* Right Column: Key Stats (Horizontal grid on mobile, vertical stack on desktop) */}
            <div className="flex flex-col justify-between items-start md:items-end text-left md:text-right pb-1 sm:pb-2 w-full md:w-auto">
              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:flex md:flex-col md:space-y-6 md:self-end pt-2 md:pt-0 border-t border-white/10 md:border-t-0 w-full md:w-auto">
                {/* Stat 1 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-baseline md:justify-end gap-1 sm:gap-3.5 pb-1 sm:pb-2 md:border-b md:border-gray-300">
                  <span className="text-xl sm:text-4xl lg:text-6xl font-black text-[#ff2200] tracking-tight leading-none">
                    1
                  </span>
                  <span className="text-[8px] sm:text-[10px] md:text-[11px] font-extrabold text-gray-400 tracking-[0.12em] sm:tracking-[0.18em] uppercase text-left leading-tight">
                    YEAR
                    <br />
                    EXPERIENCE
                  </span>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-baseline md:justify-end gap-1 sm:gap-3.5 pb-1 sm:pb-2 md:border-b md:border-gray-300">
                  <span className="text-xl sm:text-4xl lg:text-6xl font-black text-[#ff2200] tracking-tight leading-none">
                    5+
                  </span>
                  <span className="text-[8px] sm:text-[10px] md:text-[11px] font-extrabold text-gray-400 tracking-[0.12em] sm:tracking-[0.18em] uppercase text-left leading-tight">
                    PROJECTS
                    <br />
                    COMPLETED
                  </span>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-baseline md:justify-end gap-1 sm:gap-3.5 pb-1 sm:pb-2">
                  <span className="text-xl sm:text-4xl lg:text-6xl font-black text-[#ff2200] tracking-tight leading-none">
                    15+
                  </span>
                  <span className="text-[8px] sm:text-[10px] md:text-[11px] font-extrabold text-gray-400 tracking-[0.12em] sm:tracking-[0.18em] uppercase text-left leading-tight">
                    TECH
                    <br />
                    STACKS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
