/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  BriefcaseBusiness,
  CalendarCheck,
  Code2,
  Database,
  ExternalLink,
  FolderKanban,
  Github,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MonitorPlay,
  MonitorSmartphone,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { initialProjects, type Project } from "@/lib/projects";

const navItems = ["Projects", "Services", "Process", "About", "Contact"];

const services = [
  {
    icon: MonitorSmartphone,
    title: "Custom Websites",
    copy: "Responsive websites built around each client’s brand, audience, and goals.",
  },
  {
    icon: Rocket,
    title: "Landing Pages",
    copy: "Modern pages for services, products, portfolios, campaigns, and online offers.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Systems",
    copy: "Scheduling flows, inquiry forms, service pages, and appointment-focused interfaces.",
  },
  {
    icon: Settings2,
    title: "Management Systems",
    copy: "Admin dashboards, records, content management, and internal workflow tools.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Portfolio Websites",
    copy: "Clean personal and professional websites for creators, freelancers, and teams.",
  },
  {
    icon: Database,
    title: "Full-Stack Development",
    copy: "Frontend, backend, database, authentication, and deployment support when needed.",
  },
];

const stack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Firebase", "Supabase", "Vercel", "GitHub", "UI/UX Design"];

const process = [
  ["01", "Discover", "Understand the client’s goals, project type, content, style, and required features."],
  ["02", "Structure", "Plan the sections, pages, user flow, and what the system or website needs to do."],
  ["03", "Design", "Create a modern interface based on the client’s preferred brand direction."],
  ["04", "Build", "Develop the website or system with responsive layouts, clean code, and real usability."],
  ["05", "Launch", "Test, polish, deploy, and prepare the project for public use or client handoff."],
];

const footerLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Admin", href: "/admin" },
];

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

function ProjectPreview({ project }: { project: Project }) {
  return (
    <div className="media-frame mb-6 h-52">
      {project.mediaUrl ? (
        project.mediaType === "video" ? (
          <video src={project.mediaUrl} className="project-media" controls muted playsInline preload="metadata" />
        ) : (
          <img src={project.mediaUrl} alt={`${project.title} preview`} className="project-media" loading="lazy" />
        )
      ) : (
        <div className="grid h-full place-items-center px-6 text-center" style={{ background: `radial-gradient(circle at 30% 20%, ${project.accent}44, transparent 35%)` }}>
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-white/15 bg-white/10" style={{ color: project.accent }}>
              <MonitorPlay size={28} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-white/70">Project Preview</p>
            <p className="font-display mt-1 text-2xl font-bold tracking-[-0.04em] text-white">{project.title}</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 z-10 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
        {project.mediaType === "video" ? "Video" : project.mediaType === "image" ? "Image" : project.type}
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState("All");
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const stored = window.localStorage.getItem("jb_projects");
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch {
        setProjects(initialProjects);
      }
    }
  }, []);

  const filters = ["All", ...Array.from(new Set(projects.map((project) => project.type)))];
  const filteredProjects = activeFilter === "All" ? projects : projects.filter((project) => project.type === activeFilter);

  return (
    <main className="min-h-screen overflow-hidden text-white">
      <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300" />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#05070d]/78 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#05070d] shadow-xl shadow-cyan-400/10 transition group-hover:-rotate-6 group-hover:scale-105">
              <Code2 size={20} />
            </span>
            <span>
              <span className="font-display block text-xl font-bold tracking-[-0.04em]">Jonathan Broqueza</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300">Web Developer</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-sm font-semibold text-slate-300 hover:text-white">
                {item}
              </a>
            ))}
          </div>

          <a href="#contact" className="btn-primary hidden items-center rounded-full px-5 py-3 text-sm shadow-xl lg:inline-flex">
            <span>Start a Project</span>
          </a>

          <button onClick={() => setMenuOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden" aria-label="Open navigation menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#070b14] px-5 py-5 lg:hidden">
            <div className="grid gap-3">
              {navItems.map((item) => (
                <a key={item} onClick={() => setMenuOpen(false)} href={`#${item.toLowerCase()}`} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-bold text-slate-200">
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <section id="home" className="relative px-5 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="floating-orb pointer-events-none absolute right-[8%] top-28 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="floating-orb pointer-events-none absolute bottom-10 left-[6%] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl [animation-delay:1.8s]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles size={14} /> Available for custom digital builds
            </div>
            <h1 className="font-display max-w-5xl text-[clamp(3.6rem,8vw,7.8rem)] font-bold leading-[0.86] tracking-[-0.075em]">
              I build <span className="gradient-text">interactive websites</span> and digital systems.
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-medium leading-8 text-slate-300">
              I’m Jonathan Broqueza, a BSCS graduate from Bicol University Polangui. I design and develop landing pages, booking systems, management systems, portfolios, and full-stack websites based on what each client needs.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#projects" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm hover:-translate-y-1">
                <span>View Projects</span> <ArrowRight size={17} />
              </a>
              <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-black text-white hover:-translate-y-1 hover:bg-white/[0.08]">
                Explore Services
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="glass-card overflow-hidden rounded-[2.2rem] p-5">
              <div className="rounded-[1.7rem] border border-white/10 bg-[#080c15] p-5">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-auto text-xs font-bold uppercase tracking-[0.24em] text-slate-500">project.engine</span>
                </div>
                <div className="space-y-4 font-mono text-sm text-slate-300">
                  <p><span className="text-cyan-300">const</span> developer = <span className="text-emerald-300">"Jonathan Broqueza"</span>;</p>
                  <p><span className="text-cyan-300">services</span>.build([<span className="text-emerald-300">"websites"</span>, <span className="text-emerald-300">"systems"</span>, <span className="text-emerald-300">"interfaces"</span>]);</p>
                  <p><span className="text-violet-300">design</span>.matchClientVision();</p>
                  <p><span className="text-violet-300">deploy</span>.toProduction();</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[["06+", "Projects"], ["10+", "Tools"], ["100%", "Responsive"]].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="font-display text-3xl font-bold">{value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035] px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 text-center text-xs font-black uppercase tracking-[0.26em] text-slate-400 lg:justify-between">
          <span>Custom Websites</span><span>Booking Systems</span><span>Management Systems</span><span>Full-Stack Development</span><span>UI/UX Design</span>
        </div>
      </section>

      <section id="projects" className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Selected Work</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">Projects built across brands, systems, and digital products.</h2>
            </div>
            <a href="/admin" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.08]">
              Open Admin <Settings2 size={16} />
            </a>
          </motion.div>

          <div className="mb-8 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-bold ${activeFilter === filter ? "bg-cyan-200 text-[#05070d]" : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"}`}>
                {filter}
              </button>
            ))}
          </div>

          <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <motion.article layout key={project.id} {...fadeUp} className="glass-card group flex min-h-[610px] flex-col rounded-[2rem] p-5">
                <ProjectPreview project={project} />
                <div className="flex flex-1 flex-col px-1 pb-1">
                  <div className="mb-5 flex items-start justify-between gap-5">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${project.accent}22`, color: project.accent }}>
                      <FolderKanban size={22} />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-300">{project.status}</span>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: project.accent }}>{project.type}</p>
                  <h3 className="font-display mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] text-white">{project.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{project.industry}</p>
                  <p className="mt-5 text-sm font-medium leading-7 text-slate-300">{project.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.highlights.slice(0, 4).map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300">{item}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-7">
                    <div className="mb-5 flex flex-wrap gap-2">
                      {project.tools.slice(0, 4).map((tool) => (
                        <span key={tool} className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{tool}</span>
                      ))}
                    </div>
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-white group-hover:text-cyan-200">
                        View live project <ExternalLink size={15} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm font-black text-slate-500">Project details available on request</span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="services" className="bg-white/[0.035] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Services</p>
            <h2 className="font-display mt-4 text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">Built around what your project needs.</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-slate-400">I do not limit projects to one template. I design based on the client’s content, goal, audience, and required features.</p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.article key={service.title} {...fadeUp} className="glass-card rounded-[1.8rem] p-7">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200"><Icon size={23} /></div>
                  <h3 className="font-display mt-7 text-3xl font-bold tracking-[-0.04em]">{service.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-7 text-slate-400">{service.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="process" className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Process</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">From first idea to working product.</h2>
            </div>
            <p className="max-w-md font-medium leading-7 text-slate-400">A clear process helps clients understand what is being built, how it will look, and how it will function before launch.</p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-5">
            {process.map(([number, title, copy]) => (
              <motion.article key={title} {...fadeUp} className="glass-card rounded-[1.6rem] p-6">
                <div className="font-display text-5xl font-bold text-cyan-200">{number}</div>
                <h3 className="font-display mt-8 text-2xl font-bold tracking-[-0.04em]">{title}</h3>
                <p className="mt-4 text-sm font-medium leading-6 text-slate-400">{copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-white/[0.035] px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <motion.div {...fadeUp} className="glass-card rounded-[2rem] p-8 lg:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">About</p>
            <h2 className="font-display mt-4 text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">Jonathan Broqueza</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-slate-300">BSCS graduate from Bicol University Polangui, focused on building useful digital experiences for businesses, organizations, creators, and online projects.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Responsive interfaces", "Custom project design", "Admin dashboard thinking", "Frontend and full-stack builds"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200"><BadgeCheck size={16} className="text-cyan-200" /> {item}</div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <div className="mb-6 flex items-center gap-3 text-sm font-black uppercase tracking-[0.25em] text-slate-500"><Blocks size={16} /> Tools and technologies</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stack.map((tool) => (
                <div key={tool} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-bold text-slate-200 hover:border-cyan-300/35 hover:bg-cyan-300/10">{tool}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="px-5 py-24 lg:px-8">
        <motion.div {...fadeUp} className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.4rem] border border-white/10 bg-white text-[#05070d] shadow-2xl shadow-cyan-400/10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-8 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-700">Start a project</p>
            <h2 className="font-display mt-4 text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">Tell me what you want to build.</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-slate-600">Whether it is a landing page, booking system, management system, portfolio, or full-stack website, the build starts with your goal and required features.</p>
            <a href="mailto:heyhey282928@gmail.com" className="btn-dark mt-8 inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm hover:-translate-y-1">
              <span>Send Email</span> <Mail size={17} />
            </a>
          </div>
          <div className="bg-[#05070d] p-8 text-white lg:p-12">
            <h3 className="font-display text-3xl font-bold tracking-[-0.04em]">Project checklist</h3>
            <div className="mt-8 space-y-4">
              {["Project type and goal", "Brand name and preferred style", "Required pages or sections", "Features such as booking, admin, forms, or dashboard", "Content, images, logo, and examples"].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold text-slate-200"><ShieldCheck size={18} className="shrink-0 text-cyan-200" /> {item}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative border-t border-white/10 px-5 py-14 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr]">
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#05070d]"><Code2 size={21} /></span>
              <div>
                <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">Jonathan Broqueza</h3>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Web Developer</p>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium leading-7 text-slate-400">Designing and building responsive websites, booking systems, management systems, portfolios, and full-stack web projects based on client needs.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="mailto:heyhey282928@gmail.com" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-200" aria-label="Email Jonathan"><Mail size={18} /></a>
              <a href="https://github.com/tan15hacks" target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-200" aria-label="GitHub profile"><Github size={18} /></a>
              <a href="/admin" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-200" aria-label="Portfolio admin"><Settings2 size={18} /></a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h4 className="text-sm font-black uppercase tracking-[0.24em] text-white">Services</h4>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-400">
              {services.slice(0, 6).map((service) => <a key={service.title} href="#services" className="hover:text-cyan-200">{service.title}</a>)}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h4 className="text-sm font-black uppercase tracking-[0.24em] text-white">Navigate</h4>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-400">
              {footerLinks.map((link) => <a key={link.label} href={link.href} className="hover:text-cyan-200">{link.label}</a>)}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h4 className="text-sm font-black uppercase tracking-[0.24em] text-white">Details</h4>
            <div className="mt-5 space-y-4 text-sm font-semibold text-slate-400">
              <div className="flex gap-3"><GraduationCap size={18} className="shrink-0 text-cyan-300" /> BSCS Graduate, Bicol University Polangui</div>
              <div className="flex gap-3"><MapPin size={18} className="shrink-0 text-cyan-300" /> Bicol, Philippines</div>
              <a href="mailto:heyhey282928@gmail.com" className="flex gap-3 hover:text-cyan-200"><Mail size={18} className="shrink-0 text-cyan-300" /> heyhey282928@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-slate-500 md:flex-row md:items-center">
          <p>© 2026 Jonathan Broqueza. Built with Next.js, Tailwind CSS, and Framer Motion.</p>
          <p>Custom digital builds for brands, businesses, creators, and organizations.</p>
        </div>
      </footer>
    </main>
  );
}
