"use client";

import { useState } from "react";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import ScrollRevealHeading from "@/app/components/ui/ScrollRevealHeading";

export default function ContactInformation() {
  const [copiedType, setCopiedType] = useState<"email" | "phone" | null>(null);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText("hungtong113@gmail.com").catch(() => { });
    }
    setCopiedType("email");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleEmailDirect = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=hungtong113@gmail.com&su=Portfolio%20Inquiry%20-%20Tong%20Thoi%20Duy%20Hung",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText("0394572152").catch(() => { });
    }
    setCopiedType("phone");
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-8 sm:w-12 bg-[#bc0202] rounded-full shadow-[0_0_8px_rgba(188,2,2,0.8)]" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#ff3333]">
            {"// 05 · GET IN TOUCH"}
          </span>
        </div>

        <ScrollRevealHeading>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.05]">
            Let&apos;s work <span className=" text-[#ff2200]">together.</span>
          </h2>
        </ScrollRevealHeading>

        <p className="max-w-md text-sm leading-relaxed text-zinc-400">
          I&apos;m currently seeking a Developer role in Ho Chi Minh City or
          remote. Feel free to reach out directly via email or phone.
        </p>
      </div>

      {/* Editorial Contact Ledger - Clean, authentic developer architecture */}
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] pt-1">
        {/* Email Row */}
        <div className="group flex items-center justify-between py-3.5 transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded-lg">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 w-16 shrink-0">
              Email
            </span>
            <a
              href="mailto:hungtong113@gmail.com"
              onClick={(e) => {
                e.preventDefault();
                handleEmailDirect();
              }}
              className="text-xs sm:text-sm font-mono font-medium text-white group-hover:text-[#ff3333] transition-colors truncate"
              title="Click to compose email"
            >
              hungtong113@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-white rounded-md border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95"
              aria-label="Copy email address"
            >
              {copiedType === "email" ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleEmailDirect}
              className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Open Gmail compose"
              aria-label="Open Gmail compose"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Phone Row */}
        <div className="group flex items-center justify-between py-3.5 transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded-lg">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 w-16 shrink-0">
              Phone
            </span>
            <a
              href="tel:0394572152"
              className="text-xs sm:text-sm font-mono font-medium text-white group-hover:text-[#ff3333] transition-colors"
            >
              0394 572 152
            </a>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <button
              type="button"
              onClick={handleCopyPhone}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-white rounded-md border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95"
              aria-label="Copy phone number"
            >
              {copiedType === "phone" ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Location & Status Row */}
        <div className="flex items-center justify-between py-3.5 -mx-2 px-2">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 w-16 shrink-0">
              Location
            </span>
            <span className="text-xs sm:text-sm text-zinc-300 font-medium truncate">
              Ho Chi Minh City, Vietnam
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 shrink-0 ml-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Available</span>
          </span>
        </div>
      </div>
    </div>
  );
}
