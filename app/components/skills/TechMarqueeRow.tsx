"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

export type TechItem = {
  id: string;
  name: string;
  category: string;
  iconPath: string;
};

type TechMarqueeRowProps = {
  items: readonly TechItem[];
  direction: "ltr" | "rtl";
  speed?: number;
  label: string;
};

export default function TechMarqueeRow({
  items,
  direction,
  speed = 0.85,
  label,
}: TechMarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const singleWidthRef = useRef(0);

  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const isHoveredRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Replicate array 4 times for seamless infinite wrap
  const duplicatedItems = [...items, ...items, ...items, ...items];

  // Helper to dynamically get or measure singleWidth safely using exact child offset distance
  const getSingleWidth = useCallback(() => {
    if (singleWidthRef.current > 0) return singleWidthRef.current;
    if (trackRef.current && trackRef.current.children.length >= items.length * 2) {
      const firstChild = trackRef.current.children[0] as HTMLElement;
      const secondSetFirstChild = trackRef.current.children[items.length] as HTMLElement;
      if (firstChild && secondSetFirstChild) {
        const sw = secondSetFirstChild.offsetLeft - firstChild.offsetLeft;
        if (sw > 0) {
          singleWidthRef.current = sw;
          if (offsetRef.current === 0) {
            offsetRef.current = direction === "ltr" ? -sw : -sw * 1.5;
          }
          return sw;
        }
      }
    }
    // Fallback to scrollWidth / 4 if DOM children not yet fully laid out
    if (trackRef.current && trackRef.current.scrollWidth > 0) {
      const sw = trackRef.current.scrollWidth / 4;
      if (sw > 0) {
        singleWidthRef.current = sw;
        if (offsetRef.current === 0) {
          offsetRef.current = direction === "ltr" ? -sw : -sw * 1.5;
        }
        return sw;
      }
    }
    return 0;
  }, [direction, items.length]);

  useEffect(() => {
    const updateDimensions = () => {
      if (!trackRef.current) return;
      singleWidthRef.current = 0; // force re-measure with exact offset
      getSingleWidth();
    };

    updateDimensions();
    // Re-check shortly after mount in case web fonts or SVGs finish layout
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);

    let rafId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      // Normalize delta time to 60fps (1.0 at 60fps, 0.5 at 120fps) to eliminate stutter across all frame rates
      const dt = Math.min((currentTime - lastTime) / 16.67, 2.5);
      lastTime = currentTime;

      const sw = getSingleWidth();
      if (sw > 0) {
        if (!isDraggingRef.current) {
          // Smooth speed multiplier with frame-rate independent physics
          const currentVelocity = (isHoveredRef.current ? speed * 0.15 : speed) * dt;

          if (direction === "ltr") {
            // Move left to right (offset increases)
            offsetRef.current += currentVelocity;
            while (offsetRef.current >= 0) {
              offsetRef.current -= sw;
            }
          } else {
            // Move right to left (offset decreases)
            offsetRef.current -= currentVelocity;
            while (offsetRef.current <= -sw * 2) {
              offsetRef.current += sw;
            }
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(rafId);
    };
  }, [direction, speed, getSingleWidth]);

  // Pointer drag event handlers for direct manual scrubbing on both tracks
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsDraggingState(true);
    lastXRef.current = e.clientX;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if browser blocks capture
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const sw = getSingleWidth();
    if (sw <= 0) return;

    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    offsetRef.current += deltaX;

    // Wrap-around bounds protection during continuous dragging
    while (offsetRef.current > 0) {
      offsetRef.current -= sw;
    }
    while (offsetRef.current < -sw * 2) {
      offsetRef.current += sw;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Stream Label Header */}
      <div className="flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gray-300">
            {label}
          </span>
        </div>
      </div>

      {/* Marquee Outer Container with Edge Vignettes */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden py-3 select-none touch-none ${
          isDraggingState ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragStart={(e) => e.preventDefault()}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        {/* Left & Right Smooth Edge Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#000000] via-[#000000]/80 to-transparent z-10" />

        {/* Inner Moving Track */}
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 w-max will-change-transform"
        >
          {duplicatedItems.map((tech, index) => {
            return (
              <div
                key={`${tech.id}-${index}`}
                className="group/card relative flex items-center gap-4 rounded-2xl px-5 py-3.5 shadow-lg shadow-black/60 shrink-0 select-none interactive-glass-item cursor-pointer animate-wave-float"
                style={{
                  animationDelay: `${(index % 8) * 0.42}s`,
                }}
              >
                {/* Tech Icon Container from skill-icons */}
                <div className="pointer-events-none relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden transition-all duration-300 group-hover/card:scale-110 select-none">
                  <Image
                    src={tech.iconPath}
                    alt={tech.name}
                    width={44}
                    height={44}
                    className="h-full w-full object-contain pointer-events-none select-none"
                    unoptimized
                    draggable={false}
                  />
                </div>

                {/* Tech Info */}
                <div className="pointer-events-none space-y-0.5 text-left select-none">
                  <span className="block font-bold text-sm tracking-tight text-white transition-colors duration-200 group-hover/card:text-white">
                    {tech.name}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-gray-400">
                    {tech.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
