"use client";

import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { Send } from "lucide-react";

const SECTIONS = [
  "home",
  "projects",
  "experiences",
  "skills",
  "education-certifications",
  "contact",
];

export default function Header() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      // Track scroll progress along the page
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(
          Math.min(100, Math.max(0, (scrollY / docHeight) * 100))
        );
      }

      // Active Section Spy
      const currentSection = SECTIONS.find((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 280 && rect.bottom >= 120;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      } else if (scrollY < 200) {
        setActiveSection("home");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpenMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenMenu]);

  const isVisible = isScrolled || isOpenMenu;

  return (
    <>
      {/* Upgraded Floating Island / Dynamic Capsule Header (Bottom on Mobile, Top on Desktop) */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          /* Desktop: top-3 sm:top-5 | Mobile: bottom-3 sm:bottom-4 */
          "bottom-3 sm:bottom-4 md:bottom-auto md:top-5"
        } ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-24 md:-translate-y-28 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/60 md:bg-black/15 px-3.5 sm:px-6 py-2 sm:py-3 backdrop-blur-xl transition-all hover:border-white/20 shadow-2xl shadow-black/80 md:shadow-none">
          <div className="mx-auto flex w-full items-center justify-between">
            {/* Brand Logo: Clean text name hung.dev (no avatar, do not machine-translate) */}
            <a
              className="notranslate group flex items-center text-white focus-visible:outline-none transition-transform duration-200 hover:scale-105 shrink-0"
              href="#home"
              aria-label="Home - hung.dev"
              translate="no"
            >
              <span className="text-xs sm:text-base font-black uppercase tracking-widest text-white transition-colors">
                HUNG<span className=" text-[#ff2200] group-hover:text-[#ff0000] transition-colors">.DEV</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center px-2 py-1">
              <Navigation
                activeSection={activeSection}
                onItemClick={() => setIsOpenMenu(false)}
              />
            </div>

            {/* Actions & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Header Action Button (Let's Contact with Gradient Hover Transition) */}
              <a
                className="group relative inline-flex items-center gap-1.5 sm:gap-2 overflow-hidden rounded-full border border-white/15 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-black/40 transition-all duration-300 hover:border-transparent hover:shadow-[0_0_22px_rgba(255,0,0,0.55)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                href="#contact"
              >
                {/* Base idle background (sleek dark glass) */}
                <span className="absolute inset-0 bg-white/[0.05] rounded-full transition-opacity duration-300 group-hover:opacity-0" />

                {/* Smooth Gradient reveal on hover */}
                <span className="absolute inset-0 bg-linear-to-r from-[#830000] via-[#bc0202] to-[#ff0000] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

                {/* Subtle light shimmer sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

                {/* Content */}
                <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                  <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.25} />
                  <span className="hidden xs:inline sm:inline">Let&apos;s Contact</span>
                  <span className="xs:hidden sm:hidden">Contact</span>
                </span>
              </a>

              {/* Mobile Menu Button (Animated Hamburger / Close) */}
              <button
                type="button"
                className="relative z-50 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 p-1.5 sm:p-2 text-white backdrop-blur-md transition-colors hover:border-[#ff0000] md:hidden focus-visible:outline-none cursor-pointer"
                onClick={() => setIsOpenMenu((prev) => !prev)}
                aria-label={isOpenMenu ? "Close menu" : "Open menu"}
                aria-expanded={isOpenMenu}
              >
                <div className="flex flex-col items-center justify-center gap-1.5 w-4 h-4">
                  <span
                    className={`h-0.5 w-4 bg-white transition-all duration-300 ${isOpenMenu ? "translate-y-2 rotate-45 bg-[#ff0000]" : ""
                      }`}
                  />
                  <span
                    className={`h-0.5 w-4 bg-white transition-all duration-300 ${isOpenMenu ? "opacity-0" : ""
                      }`}
                  />
                  <span
                    className={`h-0.5 w-4 bg-white transition-all duration-300 ${isOpenMenu ? "-translate-y-2 -rotate-45 bg-[#ff0000]" : ""
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Micro Scroll Progress Bar along capsule (Top on mobile, bottom on desktop) */}
          <div className="pointer-events-none absolute top-0 md:top-auto md:bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <div
              className="h-full bg-linear-to-r from-[#830000] via-[#bc0202] to-[#ff0000] transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 flex h-screen w-screen flex-col items-center justify-center bg-black/95 px-6 backdrop-blur-2xl transition-all duration-500 md:hidden ${isOpenMenu
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >
        <Navigation
          activeSection={activeSection}
          aria-hidden={!isOpenMenu}
          isMobile
          onItemClick={() => setIsOpenMenu(false)}
        />

        <div className="mt-12 flex flex-col items-center gap-4">
          <a
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:border-transparent hover:shadow-[0_0_25px_rgba(255,0,0,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
            href="#contact"
            onClick={() => setIsOpenMenu(false)}
          >
            {/* Base idle background */}
            <span className="absolute inset-0 bg-white/[0.08] transition-opacity duration-300 group-hover:opacity-0" />
            {/* Gradient transition on hover */}
            <span className="absolute inset-0 bg-linear-to-r from-[#830000] via-[#bc0202] to-[#ff0000] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-2">
              <Send className="h-4 w-4" strokeWidth={2.25} />
              <span>Let&apos;s Contact</span>
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
