import Image from "next/image";

type Project = {
  slug: string;
  demoUrl: string;
  title: string;
  description: string;
  tech: string[];
};
const projectsArr : Project[]= [
  {
    slug: "slug1",
    demoUrl: "demoUrl1",
    title: "Project 1",
    description: "  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci ut laborum harum minima, ducimus iure maxime animi saepe facilis delectus quae quaerat nobis, eos repellat consectetur et quasi, nisi possimus?",
    tech: ["PHP", "CSS"],
  },
  {
    slug: "slug2",
    demoUrl: "demoUrl2",
    title: "Project 2",
    description: "  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci ut laborum harum minima, ducimus iure maxime animi saepe facilis delectus quae quaerat nobis, eos repellat consectetur et quasi, nisi possimus?",
    tech: ["PHP", "CSS"],
  },
  {
    slug: "slug3",
    demoUrl: "demoUrl3",
    title: "Project 3",
    description: "  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci ut laborum harum minima, ducimus iure maxime animi saepe facilis delectus quae quaerat nobis, eos repellat consectetur et quasi, nisi possimus?",
    tech: ["PHP", "CSS"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-4 py-16">
      <div className="text-center">
        <h2 className=" text-5xl">MY PROJECTS</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl gap-6 px-2 py-6">
        {projectsArr.map((pro) => (
          <div
            key={pro.slug}
            className="space-y-6 px-2 py-6 text-center border-2 rounded-2xl shadow-sm  hover:shadow-lg  transition-all group overflow-hidden "
          >
            <Image
              className="h-56 w-full object-cover group-hover:scale-105 duration-500 rounded-2xl"
              src={"/web-developer-la-gi.webp"}
              height={500}
              width={330}
              alt={pro.title}
            />
            <h3 className="text-2xl font-bold">{pro.title}</h3>
            <p className=" leading-tight">{pro.description}</p>
            <p className="space-x-2">
              {pro.tech.map((t) => (
                <span className="border rounded-2xl p-2" key={t}> {t}</span>
              ))}
            </p>
            <a className="btn-primary" target="_blank" rel="noopener noreferrer" href={pro.demoUrl}>
               View project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
