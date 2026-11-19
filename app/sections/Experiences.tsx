type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
};

const experiences: Experience[] = [
  {
    id: "techvanguard-intern",
    company: "TechVanguard Co., Ltd.",
    role: "Fullstack Developer Intern",
    period: "10/2025 – 01/2026",
    description:
      "Participated in developing backend services and business logic for CMS modules and Learning Academy Management System (LAMS).",
    responsibilities: [
      "Developed RESTful APIs and business logic for CMS and LAMS modules.",
      "Implemented secure examination logic with randomized questions and One-time Token authentication.",
      "Developed automated transactional email service with CC/BCC support.",
      "Built an assessment grading API using linear interpolation.",
      "Collaborated with the team using Gitflow, pull requests and peer code reviews.",
    ],
    technologies: [
      "PHP",
      "Laravel",
      "Node.js",
      "Express.js",
      "MongoDB",
      "ReactJS",
      "Next.js",
      "Git",
      "Gitea",
    ],
  },
];

export default function Expriences() {
  return (
    <section id="experiences" className="mx-auto w-full max-w-7xl px-4 py-20"   aria-labelledby="experiences-title">
      <div className="space-y-6">
        <h2 id="experiences-title" className="text-4xl md:text-5xl">EXPERIENCE</h2>
        <ul>
          {experiences.map((ex) => (
            <li className="space-y-8" key={ex.id}>
              <h3 className="text-2xl md:text-4xl">{ex.role}</h3>
              <h4 className="text-xl md:text-3xl">{ex.company}</h4>
              <p className="text-lg md:text-2xl">{ex.period}</p>
              <p className="text-base md:text-xl">{ex.description}</p>
              <ul className="list-disc space-y-2 pl-5">
                {ex.responsibilities.map((res) => (
                  <li key={res}>{res}</li>
                ))}
              </ul>

              <ul className="flex flex-wrap gap-2">
                {ex.technologies.map((tech) => (
                  <li
                    className="rounded-full border px-3 py-2 text-center text-sm transition-colors hover:bg-gray-500 hover:text-white"
                    key={tech}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
