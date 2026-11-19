const skills = [
  "HTML5",
  "CSS3",
  "SCSS",
  "JavaScript (ES6+)",
  "TypeScript",
  "ReactJS",
  "Next.js",
  "Redux Toolkit",
  "Inertia.js",
  "Tailwind CSS",
  "Ant Design",
  "Bootstrap",
  "PHP",
  "Laravel",
  "Node.js",
  "Express.js",
  "MySQL",
  "MongoDB",
  "RESTful API",
  "Git",
  "GitHub",
  "Gitea",
  "Postman",
  "Vite",
];

export default function Skills() {
  return (
    <section id="skills" className="mx-auto w-full max-w-7xl px-4 py-20">
      <div className="space-y-8 border p-6 text-center">
        <h2 className="text-5xl">Technology Skills</h2>

        <ul className="flex flex-wrap items-center justify-center gap-4">
          {skills.map((skill) => (
            <li
              className="h-16 w-24 rounded-2xl border px-2 py-6 text-center transition-colors hover:bg-gray-500 hover:text-white"
              key={skill}
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
