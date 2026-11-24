export type TimelineMilestone = {
  id: string;
  year: string;
  monthBadge: string;
  period: string;
  stageBadge: string;
  role: string;
  company: string;
  location: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: readonly {
    value: string;
    label: string;
  }[];
  highlights: readonly string[];
  caption: string;
  image: string;
  tags: readonly string[];
};

export const timelineMilestones: readonly TimelineMilestone[] = [
  {
    id: "techvanguard-m1",
    year: "10/2025",
    monthBadge: "MONTH 01 · OCT 2025",
    period: "Month 1 · October 2025",
    stageBadge: "ONBOARDING & CMS BACKEND",
    role: "Fullstack Developer Intern",
    company: "TechVanguard Co., Ltd.",
    location: "Ho Chi Minh City, Vietnam",
    title: "Backend Architecture & RESTful APIs for CMS Module",
    subtitle: "Content Management System (CMS) Engine",
    description:
      "Onboarded to enterprise engineering workflows at TechVanguard, standardized development with internal Gitea Gitflow, and designed scalable RESTful APIs with business logic for the Content Management System (CMS) module.",
    metrics: [
      { value: "REST", label: "RESTful API Standard" },
      { value: "Gitea", label: "Gitflow Collaboration" },
    ],
    highlights: [
      "Engineered RESTful APIs and data processing pipelines for the core CMS module",
      "Adopted and maintained Gitflow branching conventions on internal Gitea repository",
      "Optimized MongoDB schema indexing and structured lightweight API payloads",
    ],
    caption: "FIG. 01 · CMS BACKEND ARCHITECTURE & REST APIS",
    image: "/experience/techvanguard.png",
    tags: ["PHP", "Laravel", "Node.js", "Express", "MongoDB", "Gitea", "Gitflow"],
  },
  {
    id: "techvanguard-m2",
    year: "11/2025",
    monthBadge: "MONTH 02 · NOV 2025",
    period: "Month 2 · November 2025",
    stageBadge: "LAMS & PRETEST SECURITY",
    role: "Fullstack Developer Intern",
    company: "TechVanguard Co., Ltd.",
    location: "Ho Chi Minh City, Vietnam",
    title: "Secure Assessment Engine & Linear Interpolation Grading",
    subtitle: "Learning Academy Management System (LAMS)",
    description:
      "Developed an anti-cheat candidate pretest examination module for LAMS featuring One-Time Token single-use validation and automated scoring powered by linear interpolation algorithms.",
    metrics: [
      { value: "0%", label: "Exam Leak Rate" },
      { value: "Linear", label: "Interpolation Algorithm" },
    ],
    highlights: [
      "Implemented randomized question engine for balanced test distribution",
      "Enforced single-use One-Time Token authentication to prevent duplicate submissions",
      "Constructed automated evaluation API utilizing linear interpolation algorithms",
    ],
    caption: "FIG. 02 · SECURE PRETEST EXAM & GRADING ENGINE",
    image: "/experience/techvanguard.png",
    tags: ["Algorithm", "One-Time Token", "Security", "Linear Interpolation", "LAMS"],
  },
  {
    id: "techvanguard-m3",
    year: "12/2025",
    monthBadge: "MONTH 03 · DEC 2025 – JAN 2026",
    period: "Month 3 · Dec 2025 – Jan 2026",
    stageBadge: "EMAIL QUEUE & FINAL DELIVERY",
    role: "Fullstack Developer Intern",
    company: "TechVanguard Co., Ltd.",
    location: "Ho Chi Minh City, Vietnam",
    title: "Transactional Email Queue & Internship Completion",
    subtitle: "Transactional Email Service & Delivery",
    description:
      "Architected background asynchronous queue for transactional candidate notifications with CC/BCC delivery, conducted peer code reviews, and successfully completed the 3-month enterprise internship.",
    metrics: [
      { value: "100%", label: "Delivery Success Rate" },
      { value: "3 Months", label: "Internship Completed" },
    ],
    highlights: [
      "Designed automated notification dispatcher powered by background worker queues",
      "Implemented CC/BCC routing with non-blocking execution and 100% delivery reliability",
      "Participated in peer code reviews and delivered final production sign-off",
    ],
    caption: "FIG. 03 · TRANSACTIONAL EMAIL QUEUE & COMPLETION",
    image: "/experience/techvanguard.png",
    tags: ["Email Queue", "Background Jobs", "Peer Code Review", "Gitflow", "3 Months"],
  },
];
