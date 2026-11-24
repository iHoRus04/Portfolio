"use client";

import SectionHeader from "@/app/components/ui/SectionHeader";
import TechMarqueeRow, { TechItem } from "@/app/components/skills/TechMarqueeRow";
import WaveBackground from "@/app/components/skills/WaveBackground";

// Track 1 (Top): Frontend & Client-side Ecosystem (Moves Left to Right)
// Authentic brand SVGs sourced from tandpfun/skill-icons
const frontendTechs: readonly TechItem[] = [
  { id: "react", name: "ReactJS", category: "Component Library", iconPath: "/tech/react.svg" },
  { id: "nextjs", name: "Next.js", category: "Fullstack Framework", iconPath: "/tech/nextjs.svg" },
  { id: "typescript", name: "TypeScript", category: "Typed Language", iconPath: "/tech/ts.svg" },
  { id: "javascript", name: "JavaScript", category: "ES6+ Standard", iconPath: "/tech/js.svg" },
  { id: "tailwind", name: "Tailwind CSS", category: "Utility-first CSS", iconPath: "/tech/tailwind.svg" },
  { id: "redux", name: "Redux Toolkit", category: "State Management", iconPath: "/tech/redux.svg" },
  { id: "vite", name: "Vite", category: "Fast Build Tool", iconPath: "/tech/vite.svg" },
  { id: "html5", name: "HTML5", category: "Semantic Markup", iconPath: "/tech/html.svg" },
  { id: "css3", name: "CSS3", category: "Modern Styling", iconPath: "/tech/css.svg" },
  { id: "sass", name: "SASS / SCSS", category: "CSS Preprocessor", iconPath: "/tech/sass.svg" },
];

// Track 2 (Bottom): Backend, Database & Infrastructure (Moves Right to Left)
// Authentic brand SVGs sourced from tandpfun/skill-icons
const backendTechs: readonly TechItem[] = [
  { id: "laravel", name: "Laravel 11", category: "PHP Framework", iconPath: "/tech/laravel.svg" },
  { id: "php", name: "PHP 8+", category: "Backend Engine", iconPath: "/tech/php.svg" },
  { id: "nodejs", name: "Node.js", category: "Async Runtime", iconPath: "/tech/nodejs.svg" },
  { id: "express", name: "Express.js", category: "REST Framework", iconPath: "/tech/express.svg" },
  { id: "mysql", name: "MySQL", category: "Relational DB", iconPath: "/tech/mysql.svg" },
  { id: "mongodb", name: "MongoDB", category: "Document Database", iconPath: "/tech/mongodb.svg" },
  { id: "git", name: "Git", category: "Version Control", iconPath: "/tech/git.svg" },
  { id: "github", name: "GitHub", category: "Collaboration", iconPath: "/tech/github.svg" },
  { id: "postman", name: "Postman", category: "API Testing", iconPath: "/tech/postman.svg" },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-20 bg-[#000000] px-4 py-24 sm:px-8 lg:px-12 text-white overflow-hidden"
      aria-labelledby="skills-title"
    >
      {/* Fluid Harmonic Wave Background (replaces static red glow) */}
      <WaveBackground />

      <div className="relative z-10 mx-auto max-w-7xl space-y-16">
        {/* Section Heading */}
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="// 03 · TECHNICAL STACK"
            title="Technology Skills"
            accentWord="Skills"
            description="Core frontend frameworks, backend engines, databases, and system development tools."
            id="skills-title"
          />
        </div>

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* DUAL INTERACTIVE CONTINUOUS TICKER MARQUEE STREAMS              */}
        {/* Top: Left to Right | Bottom: Right to Left | Drag to scrub       */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6 pt-2">
          {/* Stream 01: Frontend Ecosystem (Left to Right) */}
          <TechMarqueeRow
            items={frontendTechs}
            direction="ltr"
            speed={0.8}
            label="01. Frontend & Client-Side Ecosystem"
          />

          {/* Stream 02: Backend, Database & Infrastructure (Right to Left) */}
          <TechMarqueeRow
            items={backendTechs}
            direction="rtl"
            speed={0.8}
            label="02. Backend, Database & Infrastructure"
          />
        </div>


      </div>
    </section>
  );
}
