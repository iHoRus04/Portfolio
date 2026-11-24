export type Project = {
  id: "rental-saas" | "it-recruitment";
  number: string;
  category: string;
  title: string;
  displayTitle: {
    line1: string;
    line2: string;
  };
  description: string;
  highlights: readonly string[];
  techStack: readonly string[];
  demoUrl: string;
  landingUrl?: string;
  githubUrl: string;
  badge: string;
  image: string;
  brandName: string;
  brandTagline: string;
};

export const projectsData: readonly Project[] = [
  {
    id: "rental-saas",
    number: "01",
    category: "FULLSTACK SAAS • MULTI-TENANCY",
    title: "DreamHouse — Multi-branch Rental System",
    displayTitle: {
      line1: "DreamHouse",
      line2: "Rental SaaS",
    },
    description:
      "Multi-branch rental management system built with multi-tenant data isolation architecture, automated billing workflows, and dynamic payment integration.",
    highlights: [
      "Role-Based Access Control (RBAC): 4-tier granular permissions (Super Admin, Landlord, Staff, Tenant).",
      "VietQR Dynamic Payments: Automated utility calculation with dynamic QR code generation per billing cycle.",
      "Document Automation: Background PDF contract generation and automated email delivery via DomPDF & Mailables.",
      "Maintenance Ticket Flow: 4-stage issue resolution pipeline powered by a deterministic State Machine.",
    ],
    techStack: [
      "Laravel 11",
      "MySQL",
      "ReactJS",
      "Inertia.js",
      "TailwindCSS",
      "VietQR API",
      "DomPDF",
    ],
    demoUrl: "https://dreamhouse-app.onrender.com",
    landingUrl: "https://dreamhouse-pied.vercel.app",
    githubUrl: "https://github.com/iHoRus04/Rental-Management",
    badge: "Deployed • Render",
    image: "/projects/dreamhouse-dashboard.jpg",
    brandName: "DREAMHOUSE",
    brandTagline: "ENTERPRISE SAAS SYSTEM",
  },
  {
    id: "it-recruitment",
    number: "02",
    category: "FRONTEND APPLICATION • ECOSYSTEM",
    title: "IT Career & Recruitment Platform",
    displayTitle: {
      line1: "Career Hub",
      line2: "Recruitment",
    },
    description:
      "Specialized IT recruitment platform optimizing candidate and employer workflows with centralized state management and protected access routes.",
    highlights: [
      "Global UI State Management: Leveraged Redux Toolkit to orchestrate application-wide toast notifications and user feedback across asynchronous flows.",
      "Client-side Auth & Route Guards: Enforced cookie-based authentication and protected routes (PrivateProtect) to restrict unauthorized access to administrative employer dashboards.",
      "Modular RESTful API Integration: Architected a clean service layer executing full CRUD operations, coupled with URL-driven search queries and multi-criteria job filtering.",
      "Responsive Component-Driven UI: Built with Ant Design 5 and SCSS media queries, featuring dynamic mobile drawer navigation and adaptive grid layouts.",
    ],
    techStack: [
      "ReactJS",
      "Redux Toolkit",
      "Ant Design",
      "SCSS",
      "RESTful API",
      "Express",
      "Vite",
    ],
    demoUrl: "https://recruitment-project-six.vercel.app",
    githubUrl: "https://github.com/iHoRus04/Recruitment-Project",
    badge: "Deployed • Vercel",
    image: "/projects/recruitment_admin.png",
    brandName: "IT RECRUIT",
    brandTagline: "CAREER MATCHING PLATFORM",
  },
];
