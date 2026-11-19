type Education = {
  id: string;
  school: string;
  major: string;
  period: string;
  gpa: string;
};

type Certification = {
  id: string;
  name: string;
  score: string;
};

const educationArr: Education[] = [
  {
    id: "stu",
    school: "Saigon Technology University (STU)",
    major: "Information Technology",
    period: "2022 – 2026",
    gpa: "3.14/4.0",
  },
];

const certificationsArr: Certification[] = [
  {
    id: "toeic",
    name: "TOEIC",
    score: "660",
  },
];
export default function EducationCertifications() {
  return (
    <section
      id="education-certifications"
      className="sections-2"
      aria-labelledby="education-title certifications-title"
    >
      <div className="w-full space-y-4 rounded-2xl border p-6  md:flex-1 md:basis-0">
        <h2 id="education-title" className="text-4xl md:text-5xl">
          Education
        </h2>

        <ul className="space-y-4">
          {educationArr.map((edu) => (
            <li className="space-y-2" key={edu.id}>
              <h3 className="text-2xl md:text-3xl">{edu.school}</h3>
              <h4 className="text-xl">{edu.major}</h4>
              <p>{edu.period}</p>
              <p>GPA: {edu.gpa}</p>
            </li>
          ))}
        </ul>
      </div>
      <div  className="w-full space-y-4 rounded-2xl border p-6 md:flex-1 md:basis-0">
        <h2 id="certifications-title" className="text-4xl md:text-5xl">Certifications</h2>
        <ul className="space-y-4">
          {certificationsArr.map((cer) => (
            <li className="space-y-2" key={cer.id}>
              <h3 className="text-2xl md:text-3xl">{cer.name}</h3>
              <p className="text-base">Score: {cer.score}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
