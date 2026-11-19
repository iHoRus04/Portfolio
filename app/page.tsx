import Header from "./components/layout/Header";
import Contact from "./sections/Contact";
import EducationCertifications from "./sections/EducationCertifications";
import Experiences from "./sections/Experiences";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <EducationCertifications />
      <Experiences />
      <Projects />
      <Skills />

      <Contact />
    </>
  );
}
