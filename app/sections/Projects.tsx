import SectionHeader from "@/app/components/ui/SectionHeader";
import ProjectCard from "@/app/components/projects/ProjectCard";
import { projectsData } from "@/app/data/projects";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative scroll-mt-20 bg-[#000000] px-4 py-24 sm:px-8 lg:px-12 text-white"
    >
      <div className="relative z-10 mx-auto max-w-6xl space-y-16">
        <SectionHeader
          eyebrow="// 01 · SELECTED WORKS"
          title="Featured Projects"
          accentWord="Projects"
          description="Production-grade SaaS & Web applications built with multi-tenant architectures and resilient engineering."
          id="projects-title"
        />

        {/* Khung chứa các thẻ dự án xếp tầng kính mờ (Pure CSS Sticky - Phản hồi tức thì 100% Zero Delay) */}
        <div className="relative pb-28 sm:pb-36">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
