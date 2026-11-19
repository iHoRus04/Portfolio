type NavigationProps = {
  onItemClick: () => void;
  className?: string;
};
const navLinks = [
  { href: "about", title: "About" },
  { href: "skills", title: "Skills" },
  { href: "experiences", title: "Experience" },
  { href: "projects", title: "Projects" },
  { href: "contact", title: "Contact" },
];

export default function Navigation({ onItemClick , className = "" }: NavigationProps) {
  return <nav className={className} aria-label="Main navigation">
    <ul className=" flex flex-col items-center md:flex-row text-white gap-4 md:text-xs md:text-gray-400">
         {navLinks.map((item) => (
          <li key={item.href}>
            <a
              className="transition-colors hover:text-gray-900"
              href={`#${item.href}`}
              onClick={onItemClick}
            >
              {item.title}
            </a>
          </li>
        ))}
    </ul>

  </nav>;
}
