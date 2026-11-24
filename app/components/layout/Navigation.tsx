"use client";

type NavigationProps = {
  onItemClick: () => void;
  activeSection?: string;
  "aria-hidden"?: boolean;
  isMobile?: boolean;
};

const navLinks = [
  { href: "home", title: "Home" },
  { href: "projects", title: "Projects" },
  { href: "experiences", title: "Experience" },
  { href: "skills", title: "Skills" },
  { href: "education-certifications", title: "Education" },
  { href: "contact", title: "Contact" },
];

export default function Navigation({
  onItemClick,
  activeSection = "home",
  "aria-hidden": ariaHidden,
  isMobile = false,
}: NavigationProps) {
  return (
    <nav aria-label="Main navigation" aria-hidden={ariaHidden}>
      <ul
        className={
          isMobile
            ? "flex flex-col items-center gap-6 text-lg font-bold tracking-widest uppercase text-gray-200"
            : "flex items-center gap-4 sm:gap-6 text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-zinc-400"
        }
      >
        {navLinks.map((item) => {
          const isActive = activeSection === item.href;
          return (
            <li key={item.href}>
              <a
                className={
                  isMobile
                    ? `relative flex items-center py-2 transition-colors ${
                        isActive
                          ? "text-[#ff0000] font-bold"
                          : "text-zinc-300 hover:text-white"
                      }`
                    : `group relative flex items-center py-1 transition-colors ${
                        isActive ? "text-white font-bold" : "hover:text-white"
                      }`
                }
                href={`#${item.href}`}
                onClick={onItemClick}
              >
                {/* Tactile Lift on Hover (Preserves single text node for flawless Google Translate) */}
                <span className="inline-block py-0.5 select-none transition-transform duration-300 ease-out group-hover:-translate-y-1 group-active:translate-y-0">
                  {item.title}
                </span>

                {/* Underline only on hover / active (no borders) */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-linear-to-r from-[#bc0202] to-[#ff0000] transition-all duration-300 ease-out ${
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                  style={{ transformOrigin: "left" }}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
