"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { GraduationCap, Award } from "lucide-react";
import ScrollRevealHeading from "@/app/components/ui/ScrollRevealHeading";

/* ─────────────────────────────────────────────
   Count-up hook — animates a number from 0 to `end`
   when `start` becomes true. Respects reduced-motion.
   ───────────────────────────────────────────── */
function useCountUp(end: number, start: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const prefersReduced = useRef(false);

  // Read reduced-motion preference once on mount
  useEffect(() => {
    prefersReduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!start) return;

    // If user prefers reduced motion, jump to final value immediately via rAF
    if (prefersReduced.current) {
      rafRef.current = requestAnimationFrame(() => setValue(end));
      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(2)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [start, end, duration]);

  return value;
}

/* ─────────────────────────────────────────────
   Intersection Observer hook for reveal animations
   ───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

/* ─────────────────────────────────────────────
   Main Section Component
   ───────────────────────────────────────────── */
export default function EducationCertifications() {
  const { ref: sectionRef, isInView } = useInView(0.1);

  const gpaValue = useCountUp(3.14, isInView, 1400);
  const toeicValue = useCountUp(660, isInView, 1600);

  // Format GPA to always show 2 decimal places
  const formatGpa = useCallback((v: number) => v.toFixed(2), []);
  // Format TOEIC as integer
  const formatToeic = useCallback((v: number) => Math.round(v).toString(), []);

  // Score progress percentage for the bar
  const toeicPercent = (660 / 990) * 100; // ~66.7%

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="education-certifications"
      className="relative scroll-mt-24 bg-[#000000] px-6 py-28 text-white sm:px-10 lg:px-16"
      aria-labelledby="edu-cert-title"
    >
      <div className="mx-auto max-w-6xl">
        {/* ── Section Header ── */}
        <div
          className="transition-all duration-700 ease-out space-y-3"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 sm:w-12 bg-[#bc0202] rounded-full shadow-[0_0_8px_rgba(188,2,2,0.8)]" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#ff3333]">
              {"// 04 · CREDENTIALS"}
            </span>
          </div>

          <ScrollRevealHeading>
            <h2
              id="edu-cert-title"
              className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              Education &amp;{" "}
              <span className=" text-[#ff2200]">Credentials</span>
            </h2>
          </ScrollRevealHeading>

          {/* Thin divider */}
          <div className="mt-8 h-px w-full bg-zinc-800" />
        </div>

        {/* ── Two-Column Asymmetric Layout ── */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
          {/* ━━ Left Column — Academic Background (STU) ━━ */}
          <div
            className="group relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/[0.12] bg-[#0d0d10] p-6 sm:p-8 lg:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.85)] interactive-glass-card lg:col-span-7 flex flex-col justify-between"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(32px)",
              transitionDelay: "150ms",
            }}
          >
            <div className="space-y-6 relative z-10">
              {/* Header: Label + Period */}
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-2.5">
                  <GraduationCap
                    className="h-4 w-4  text-[#ff2200]"
                    strokeWidth={1.75}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">
                    Academic Background
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
                  2022 — 2026
                </span>
              </div>

              {/* Logo + University Info */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-black/50 border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/stu/logo.png"
                    alt="Saigon Technology University (STU) Logo"
                    width={72}
                    height={72}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                    Saigon Technology University
                    <span className="ml-2 text-base sm:text-lg font-bold text-zinc-400 font-mono">
                      (STU)
                    </span>
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-zinc-300">
                    Bachelor of Information Technology
                  </p>
                </div>
              </div>

              {/* GPA Metric Block */}
              <div className="mt-6 flex items-end gap-3.5 border-l-2 border-[#bc0202] pl-5 py-1">
                <span className="font-mono text-5xl font-black leading-none tracking-tight text-white sm:text-6xl">
                  {formatGpa(gpaValue)}
                </span>
                <div className="mb-1 flex flex-col">
                  <span className="text-sm font-bold text-zinc-400">
                    / 4.0
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    Cumulative GPA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ━━ Right Column — Language Certification (TOEIC / IIG) ━━ */}
          <div
            className="group relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/[0.12] bg-[#0d0d10] p-6 sm:p-8 lg:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.85)] interactive-glass-card lg:col-span-5 flex flex-col justify-between"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0)" : "translateY(32px)",
              transitionDelay: "300ms",
            }}
          >
            <div className="space-y-6 relative z-10">
              {/* Header: Label + Issue Date */}
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4  text-[#ff2200]" strokeWidth={1.75} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">
                    Language Certification
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03]">
                  30/07/2026
                </span>
              </div>

              {/* Logo + Certificate Info */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-black/50 border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/iig/logo.png"
                    alt="IIG Vietnam Official Logo"
                    width={72}
                    height={72}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                    TOEIC Official Certificate
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-zinc-300">
                    Administered by IIG Vietnam
                  </p>
                </div>
              </div>

              {/* Large Score Display & Progress */}
              <div className="mt-6 border-l-2 border-[#bc0202] pl-5 py-1">
                <div className="flex items-end gap-2">
                  <span className="font-mono text-5xl sm:text-6xl font-black leading-none tracking-tight text-white">
                    {formatToeic(toeicValue)}
                  </span>
                  <span className="mb-1 text-base sm:text-lg font-bold text-zinc-400">
                    / 990
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="h-[3px] w-full overflow-hidden bg-zinc-800 rounded-full">
                    <div
                      className="h-full bg-[#bc0202] transition-all duration-1000 ease-out rounded-full"
                      style={{
                        width: isInView ? `${toeicPercent}%` : "0%",
                        transitionDelay: "400ms",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    <span>Performance</span>
                    <span>{Math.round(toeicPercent)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
