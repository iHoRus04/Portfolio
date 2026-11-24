"use client";

import { useEffect, useRef, useState } from "react";

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  accentWord?: string;
  id?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  title,
  eyebrow,
  description,
  accentWord,
  id,
  align = "left",
}: SectionHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split title if accentWord is provided
  let titleParts: [string, string, string] = [title, "", ""];
  if (accentWord && title.includes(accentWord)) {
    const index = title.indexOf(accentWord);
    titleParts = [
      title.slice(0, index),
      accentWord,
      title.slice(index + accentWord.length),
    ];
  }

  return (
    <div
      ref={headerRef}
      className={`space-y-3.5 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {/* Animated Eyebrow Tag with Expanding Red Indicator Line */}
      {eyebrow && (
        <div
          className={`flex items-center gap-3 transition-all duration-700 ease-out ${align === "center" ? "justify-center" : "justify-start"
            } ${isInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
            }`}
        >
          <span
            className={`h-[2px] rounded-full bg-[#bc0202] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(188,2,2,0.8)] ${isInView ? "w-8 sm:w-12" : "w-0"
              }`}
          />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#ff3333]">
            {eyebrow}
          </span>
        </div>
      )}

      {/* Kinetic Masked Title */}
      <div className="overflow-hidden py-1">
        <h2
          id={id}
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] transition-all duration-800 will-change-transform ${isInView
              ? "translate-y-0 opacity-100"
              : "translate-y-[115%] opacity-0"
            }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {accentWord && titleParts[1] ? (
            <>
              {titleParts[0]}
              <span className=" text-[#ff2200] transition-colors duration-500">
                {titleParts[1]}
              </span>
              {titleParts[2]}
            </>
          ) : (
            title
          )}
        </h2>
      </div>

      {/* Description Lede with Smooth Fade Up */}
      {description && (
        <div className="overflow-hidden">
          <p
            className={`max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed transition-all duration-800 delay-150 will-change-transform ${isInView
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
              }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
