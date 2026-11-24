"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type ScrollRevealHeadingProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

export default function ScrollRevealHeading({
  children,
  className = "",
  delay = 0,
  threshold = 0.15,
}: ScrollRevealHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={containerRef} className={`overflow-hidden py-0.5 ${className}`}>
      <div
        className={`transition-all duration-800 will-change-transform ${
          isInView
            ? "translate-y-0 opacity-100"
            : "translate-y-[115%] opacity-0"
        }`}
        style={{
          transitionDelay: `${delay}ms`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
