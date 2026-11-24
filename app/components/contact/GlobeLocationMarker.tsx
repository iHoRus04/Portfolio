"use client";

import { useState } from "react";
import { ArrowUpRight, MapPin, X } from "lucide-react";

type GlobeLocationMarkerProps = {
  screenX: number;
  screenY: number;
  isVisible: boolean;
};

export default function GlobeLocationMarker({
  screenX,
  screenY,
  isVisible,
}: GlobeLocationMarkerProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none absolute z-20 transition-opacity duration-300"
      style={{
        left: `${screenX}px`,
        top: `${screenY}px`,
        transform: "translate(-50%, -50%)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Pulsing Beacon Anchor Point */}
      <div className="relative flex items-center justify-center">
        {/* Radar wave ping */}
        <span className="absolute h-8 w-8 animate-ping rounded-full bg-[#ff0000]/30 pointer-events-none" />
        <span className="absolute h-5 w-5 rounded-full bg-[#ff0000]/40 pointer-events-none" />

        {/* Interactive Clickable Pin */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="pointer-events-auto relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-[#bc0202] shadow-[0_0_16px_rgba(255,0,0,0.9)] ring-2 ring-white/90 transition-transform hover:scale-125"
          aria-label="Toggle Ho Chi Minh City Location Information"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </button>
      </div>

      {/* Floating Location Information Card (Dark Editorial Glass) */}
      {isOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="location-popup-card pointer-events-auto absolute left-6 -top-12 z-30 w-64 rounded-2xl border border-[#830000]/60 bg-[#000000]/95 p-4 shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95"
        >
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#830000]/25 border border-[#830000]/60 text-[#ff0000]">
                <MapPin className="h-3 w-3" strokeWidth={2} />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-white font-mono">
                Ho Chi Minh City
              </span>
            </div>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close location card"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 pt-2.5 text-xs text-zinc-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Vietnam</span>
              <span className="text-[10px] font-mono text-[#ff0000] font-medium">
                10.82° N, 106.63° E
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Ho Chi Minh City
            </p>

            <div className="pt-2 border-t border-white/10">
              <a
                href="https://www.google.com/maps/search/?api=1&query=10.8231,106.6297"
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    "https://www.google.com/maps/search/?api=1&query=10.8231,106.6297",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="btn-gradient-secondary px-3 py-1.5 text-[11px]"
              >
                <span>View on Google Maps</span>
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
