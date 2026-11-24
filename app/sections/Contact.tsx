"use client";

import { useState } from "react";
import ContactInformation from "@/app/components/contact/ContactInformation";
import InteractiveDottedGlobe from "@/app/components/contact/InteractiveDottedGlobe";
import { Send, Download, ArrowUpRight, Check } from "lucide-react";

export default function Contact() {
  const [isCopied, setIsCopied] = useState(false);

  const handleSendEmail = () => {
    // Copy email directly to clipboard
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText("hungtong113@gmail.com").catch(() => {});
    }

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);

    // Open Gmail web compose in a new tab (works reliably on any browser/OS)
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=hungtong113@gmail.com&su=Portfolio%20Inquiry%20-%20Tong%20Thoi%20Duy%20Hung",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden bg-[#000000] px-5 py-20 pb-28 text-white sm:px-10 sm:py-28 lg:px-16"
      aria-labelledby="contact-title"
    >
      {/* Ambient Red Glow Highlights matching Skills & Projects */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#830000]/15 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-[#bc0202]/[0.05] blur-[150px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Essential Developer Contact Information & Actions */}
          <div className="space-y-8 lg:col-span-6 xl:col-span-5">
            <ContactInformation />

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Email CTA */}
              <button
                type="button"
                onClick={handleSendEmail}
                className="btn-gradient-primary px-5 py-3 text-xs"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    <span>Copied &amp; Opening...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Send Email</span>
                  </>
                )}
              </button>

              {/* Download CV */}
              <a
                href="/TongThoiDuyHung_Fullstack_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient-secondary px-5 py-3 text-xs"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Download CV</span>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/iHoRus04"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient-secondary px-4 py-3 text-xs"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>iHoRus04</span>
                <ArrowUpRight className="h-3 w-3 text-zinc-400" strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Right Column: Full Interactive 3D Dotted Earth Globe */}
          <div className="relative flex items-center justify-center lg:col-span-6 xl:col-span-7">
            {/* Subtle Circular Backlight Halo */}
            <div
              className="pointer-events-none absolute h-[380px] w-[380px] rounded-full bg-[#830000]/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="w-full">
              <InteractiveDottedGlobe />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
