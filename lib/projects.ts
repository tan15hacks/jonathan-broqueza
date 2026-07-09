export type Project = {
  id: string;
  title: string;
  type: string;
  industry: string;
  description: string;
  highlights: string[];
  tools: string[];
  liveUrl?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  mediaName?: string;
  status: "Live" | "Concept" | "In Progress";
  accent: string;
};

export const initialProjects: Project[] = [
  {
    id: "nitroedge-garage",
    title: "NitroEdge Garage",
    type: "Landing Page",
    industry: "Automotive / Car Detailing",
    description:
      "A bold, dark, and performance-inspired website for a premium auto detailing and ceramic coating brand.",
    highlights: ["Animated hero", "Services", "Packages", "Before/after results", "Inquiry form"],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://nitroedge-garage.vercel.app/",
    status: "Live",
    accent: "#ef4444",
  },
  {
    id: "vowlens-studio",
    title: "VowLens Studio",
    type: "Landing Page",
    industry: "Wedding Photography / Events",
    description:
      "An elegant wedding photography website designed with soft editorial styling, gallery previews, packages, and inquiry flow.",
    highlights: ["Luxury visual style", "Gallery", "Packages", "FAQ", "Booking inquiry"],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://vow-lens-studio.vercel.app/",
    status: "Live",
    accent: "#d6a86f",
  },
  {
    id: "noteview",
    title: "NoteView",
    type: "Blog Website",
    industry: "Publishing / Digital Journal",
    description:
      "A warm editorial blog homepage for articles, categories, search, popular posts, and newsletter subscriptions.",
    highlights: ["Featured article", "Search section", "Mobile carousels", "Newsletter", "Editorial layout"],
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer-ready UI"],
    liveUrl: "https://noteview.vercel.app/",
    status: "Live",
    accent: "#b45309",
  },
  {
    id: "baryoconnect",
    title: "BaryoConnect",
    type: "Management System",
    industry: "Local Government / Barangay",
    description:
      "A barangay website and digital information system concept with public pages and admin management features.",
    highlights: ["Admin pages", "Announcements", "Projects", "Officials", "Community information"],
    tools: ["Next.js", "Firebase", "React", "Tailwind CSS"],
    status: "In Progress",
    accent: "#22c55e",
  },
  {
    id: "certibatch",
    title: "CertiBatch",
    type: "Productivity App",
    industry: "Education / Certificates",
    description:
      "A bulk certificate generator concept for schools, organizations, events, and small teams that need fast PDF certificate creation.",
    highlights: ["Bulk names", "Templates", "PDF export", "Offline-first workflow"],
    tools: ["Flutter", "Local Storage", "PDF Generation"],
    status: "Concept",
    accent: "#3b82f6",
  },
  {
    id: "tipid-grocery-list",
    title: "Tipid Grocery List",
    type: "Mobile App Concept",
    industry: "Personal Finance / Grocery Planning",
    description:
      "A grocery list and price tracking app concept for budgeting, item history, expense reports, and smarter shopping decisions.",
    highlights: ["Grocery lists", "Price history", "Reports", "Suggestions", "One-time unlock model"],
    tools: ["Mobile App Design", "Local Database", "Offline-first UX"],
    status: "Concept",
    accent: "#16a34a",
  }
];
