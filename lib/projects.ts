export type ProjectCategory = "Web" | "Mobile";

export type Project = {
  id: string;
  slug: string;
  order: number;
  category: ProjectCategory;
  title: string;
  type: string;
  industry: string;
  year: string;
  description: string;
  overview: string;
  role: string;
  highlights: string[];
  tools: string[];
  liveUrl?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  mediaName?: string;
  status: "Live" | "Concept" | "In Progress";
  featured: boolean;
  published: boolean;
};

export const initialProjects: Project[] = [
  {
    id: "nitroedge-garage",
    slug: "nitroedge-garage",
    order: 1,
    category: "Web",
    title: "NitroEdge Garage",
    type: "Automotive Website",
    industry: "Automotive / Car Detailing",
    year: "2026",
    description: "A performance-focused website for an automotive detailing and ceramic coating brand.",
    overview: "I designed a dark, aggressive interface that communicates paint quality, service packages, visible results, and a clear path from browsing to booking an inquiry.",
    role: "Direction, UI design, frontend development, responsive behavior, SEO, and deployment.",
    highlights: ["Animated hero", "Service packages", "Before and after results", "Inquiry flow"],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://nitroedge-garage.vercel.app/",
    status: "Live",
    featured: true,
    published: true,
  },
  {
    id: "vowlens-studio",
    slug: "vowlens-studio",
    order: 2,
    category: "Web",
    title: "VowLens Studio",
    type: "Photography Website",
    industry: "Wedding Photography / Events",
    year: "2026",
    description: "An editorial wedding photography website built around emotion, trust, and visual storytelling.",
    overview: "The experience guides couples through the portfolio, coverage packages, process, frequently asked questions, and availability inquiry without making the site feel commercial or crowded.",
    role: "Creative direction, interface design, responsive frontend, motion, SEO, and deployment.",
    highlights: ["Editorial gallery", "Coverage packages", "Process", "Availability inquiry"],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://vow-lens-studio.vercel.app/",
    status: "Live",
    featured: true,
    published: true,
  },
  {
    id: "noteview",
    slug: "noteview",
    order: 3,
    category: "Web",
    title: "NoteView",
    type: "Editorial Platform",
    industry: "Publishing / Digital Journal",
    year: "2026",
    description: "A modern digital journal for thoughtful articles, practical guides, and clear ideas.",
    overview: "The design combines editorial typography, category discovery, search, featured writing, popular posts, and newsletter conversion in a responsive reading-focused homepage.",
    role: "Product direction, editorial UI, frontend development, responsive behavior, and SEO.",
    highlights: ["Featured writing", "Search", "Categories", "Newsletter conversion"],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://noteview.vercel.app/",
    status: "Live",
    featured: true,
    published: true,
  },
  {
    id: "baryoconnect",
    slug: "baryoconnect",
    order: 4,
    category: "Web",
    title: "BaryoConnect",
    type: "Community Management System",
    industry: "Local Government / Barangay",
    year: "2026",
    description: "A public information and management platform designed for barangay communities.",
    overview: "The system brings announcements, officials, projects, events, community information, and administrative content management into one organized digital service.",
    role: "Product planning, system structure, UI design, frontend development, Firebase integration, and admin workflows.",
    highlights: ["Announcements", "Officials", "Projects", "Admin management"],
    tools: ["Next.js", "Firebase", "React", "Tailwind CSS"],
    status: "In Progress",
    featured: true,
    published: true,
  },
  {
    id: "certibatch",
    slug: "certibatch",
    order: 5,
    category: "Mobile",
    title: "CertiBatch",
    type: "Productivity Application",
    industry: "Education / Certificates",
    year: "2026",
    description: "A bulk certificate generator for schools, organizations, events, and small teams.",
    overview: "CertiBatch turns a repeated manual task into a guided workflow for importing names, choosing a certificate design, and exporting ready-to-share PDF files.",
    role: "Product strategy, workflow design, offline-first architecture, and mobile application planning.",
    highlights: ["Bulk names", "PDF export", "Offline workflow", "Saved projects"],
    tools: ["Flutter", "Dart", "Local Storage", "PDF Generation"],
    status: "Concept",
    featured: false,
    published: true,
  },
  {
    id: "tipid-grocery-list",
    slug: "tipid-grocery-list",
    order: 6,
    category: "Mobile",
    title: "Tipid Grocery List",
    type: "Mobile Product Concept",
    industry: "Personal Finance / Grocery Planning",
    year: "2026",
    description: "A grocery planning and price-tracking product for practical household budgeting.",
    overview: "The concept stores item prices over time, tracks spending, compares changes, and turns routine grocery lists into useful daily, weekly, and monthly insights.",
    role: "Product strategy, feature planning, monetization model, and offline-first UX direction.",
    highlights: ["Price history", "Expense reports", "Budgeting", "Suggestions"],
    tools: ["Flutter", "Dart", "Local Database", "Offline-first UX"],
    status: "Concept",
    featured: false,
    published: true,
  },
];