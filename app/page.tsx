/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MonitorPlay,
  MonitorSmartphone,
  Phone,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { initialProjects, type Project } from "@/lib/projects";

const navItems = ["Projects", "Services", "Process", "About", "Contact"];
const contactEmail = "thanbroq896@gmail.com";
const phoneNumber = "09456821503";
const facebookUrl = "https://www.facebook.com/jonathan.broqueza.75/";

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
  { label: "Contact", href: "#contact" },
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 34, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-90px" },
  transition: { duration: 0.75, ease: smoothEase },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: smoothEase },
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 32, scale: 0.98, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: smoothEase },
  },
};

function ProjectPreview({ project }: { project: Project }) {
  return (
    <motion.div
      className="media-frame mb-6 h-52"
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.35, ease: smoothEase }}
    >
      {project.mediaUrl ? (
        project.mediaType === "video" ? (
          <video src={project.mediaUrl} className="project-media" controls muted playsInline preload="metadata" />
        ) : (
          <motion.img
            src={project.mediaUrl}
            alt={`${project.title} preview`}
            className="project-media"
            loading="lazy"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: smoothEase }}
          />
        )
      ) : (
        <div className="grid h-full place-items-center px-6 text-center" style={{ background: `radial-gradient(circle at 30% 20%, ${project.accent}44, transparent 35%)` }}>
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.35, ease: smoothEase }}>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-white/15 bg-white/10" style={{ color: project.accent }}>
              <MonitorPlay size={28} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-white/70">Project Preview</p>
            <p className="font-display mt-1 text-2xl font-bold tracking-[-0.04em] text-white">{project.title}</p>
          </motion.div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute bottom-4 left-4 z-10 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl"
      >
        {project.mediaType === "video" ? "Video" : project.mediaType === "image" ? "Image" : project.type}
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.32,
        delay: Math.min(index * 0.025, 0.09),
        ease: smoothEase,
      }}
      whileHover={{ y: -10, scale: 1.01 }}
      key={project.id}
      className="glass-card group flex min-h-[610px] flex-col rounded-[2rem] p-5"
    >
      <ProjectPreview project={project} />
      <div className="flex flex-1 flex-col px-1 pb-1">
        <div className="mb-5 flex items-start justify-between gap-5">
          <motion.div whileHover={{ rotate: -6, scale: 1.08 }} className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${project.accent}22`, color: project.accent }}>
            <FolderKanban size={22} />
          </motion.div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-300">{project.status}</span>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: project.accent }}>{project.type}</p>
        <h3 className="font-display mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] text-white">{project.title}</h3>
        <p className="mt-2 text-sm font-semibold text-slate-500">{project.industry}</p>
        <p className="mt-5 text-sm font-medium leading-7 text-slate-300">{project.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.highlights.slice(0, 4).map((item) => (
            <motion.span whileHover={{ y: -2 }} key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300">{item}</motion.span>
          ))}
        </div>
        <div className="mt-auto pt-7">
          <div className="mb-5 flex flex-wrap gap-2">
            {project.tools.slice(0, 4).map((tool) => (
              <span key={tool} className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{tool}</span>
            ))}
          </div>
          {project.liveUrl ? (
            <motion.a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-white group-hover:text-cyan-200" whileHover={{ x: 4 }}>
              View live project <ExternalLink size={15} />
            </motion.a>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-black text-slate-500">Project details available on request</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function NavItem({ item }: { item: string }) {
  return (
    <motion.a
      href={`#${item.toLowerCase()}`}
      className="group relative px-1 py-2 text-sm font-semibold text-slate-300 hover:text-white"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      variants={{ rest: { y: 0 }, hover: { y: -2 } }}
      transition={{ duration: 0.28, ease: smoothEase }}
    >
      <span className="relative z-10">{item}</span>
      <motion.span
        className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
        variants={{ rest: { scaleX: 0, opacity: 0 }, hover: { scaleX: 1, opacity: 1 } }}
        transition={{ duration: 0.35, ease: smoothEase }}
        style={{ transformOrigin: "center" }}
      />
      <motion.span
        className="absolute inset-x-[-0.55rem] inset-y-0 -z-0 rounded-full bg-white/[0.035]"
        variants={{ rest: { opacity: 0, scale: 0.9 }, hover: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.32, ease: smoothEase }}
      />
    </motion.a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState("All");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 24, restDelta: 0.001 });
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.72]);

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

      <motion.header
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: smoothEase }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#05070d]/78 backdrop-blur-2xl"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <motion.a href="#home" className="group flex items-center gap-3" whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.98 }}>
            <motion.span
              animate={{ rotate: [0, -4, 0, 4, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#05070d] shadow-xl shadow-cyan-400/10 transition group-hover:-rotate-6 group-hover:scale-105"
            >
              <Code2 size={20} />
            </motion.span>
            <span>
              <span className="font-display block text-xl font-bold tracking-[-0.04em]">Jonathan Broqueza</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300">Web Developer</span>
            </span>
          </motion.a>

          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavItem key={item} item={item} />
            ))}
          </div>

          <motion.a href="#contact" className="btn-primary hidden items-center rounded-full px-5 py-3 text-sm shadow-xl lg:inline-flex" whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <span>Start a Project</span>
          </motion.a>

          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setMenuOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden" aria-label="Open navigation menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </nav>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.32, ease: smoothEase }}
            className="border-t border-white/10 bg-[#070b14] px-5 py-5 lg:hidden"
          >
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-3">
              {navItems.map((item) => (
                <motion.a
                  variants={revealItem}
                  key={item}
                  onClick={() => setMenuOpen(false)}
                  href={`#${item.toLowerCase()}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-bold text-slate-200"
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.header>

      <section id="home" className="relative px-5 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <motion.div
          animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[8%] top-28 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, 12, 0], scale: [1, 1.07, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          className="pointer-events-none absolute bottom-10 left-[6%] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            <motion.div variants={revealItem} className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles size={14} /> Available for custom digital builds
            </motion.div>
            <motion.h1 variants={revealItem} className="font-display max-w-5xl text-[clamp(3.6rem,8vw,7.8rem)] font-bold leading-[0.86] tracking-[-0.075em]">
              I build <span className="gradient-text">interactive websites</span> and digital systems.
            </motion.h1>
            <motion.p variants={revealItem} className="mt-8 max-w-2xl text-lg font-medium leading-8 text-slate-300">
              I’m Jonathan Broqueza, a BSCS graduate from Bicol University Polangui. I design and develop landing pages, booking systems, management systems, portfolios, and full-stack websites based on what each client needs.
            </motion.p>
            <motion.div variants={revealItem} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <motion.a href="#projects" className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm" whileHover={{ y: -5, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <span>View Projects</span> <ArrowRight size={17} />
              </motion.a>
              <motion.a href="#services" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-black text-white hover:bg-white/[0.08]" whileHover={{ y: -5, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Explore Services
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, ease: smoothEase, delay: 0.18 }}
            className="relative"
          >
            <motion.div whileHover={{ y: -8, rotate: -0.5 }} transition={{ duration: 0.35, ease: smoothEase }} className="glass-card overflow-hidden rounded-[2.2rem] p-5">
              <div className="rounded-[1.7rem] border border-white/10 bg-[#080c15] p-5">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-auto text-xs font-bold uppercase tracking-[0.24em] text-slate-500">project.engine</span>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4 font-mono text-sm text-slate-300">
                  <motion.p variants={revealItem}><span className="text-cyan-300">const</span> developer = <span className="text-emerald-300">"Jonathan Broqueza"</span>;</motion.p>
                  <motion.p variants={revealItem}><span className="text-cyan-300">services</span>.build([<span className="text-emerald-300">"websites"</span>, <span className="text-emerald-300">"systems"</span>, <span className="text-emerald-300">"interfaces"</span>]);</motion.p>
                  <motion.p variants={revealItem}><span className="text-violet-300">design</span>.matchClientVision();</motion.p>
                  <motion.p variants={revealItem}><span className="text-violet-300">deploy</span>.toProduction();</motion.p>
                </motion.div>
              </div>

              <motion.div variants={staggerContainer} initial="hidden" animate="show" className="mt-5 grid gap-4 sm:grid-cols-3">
                {[["06+", "Projects"], ["10+", "Tools"], ["100%", "Responsive"]].map(([value, label]) => (
                  <motion.div variants={cardMotion} whileHover={{ y: -5 }} key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="font-display text-3xl font-bold">{value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">{label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035] px-5 py-5 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 text-center text-xs font-black uppercase tracking-[0.26em] text-slate-400 lg:justify-between">
          {["Custom Websites", "Booking Systems", "Management Systems", "Full-Stack Development", "UI/UX Design"].map((item) => (
            <motion.span key={item} variants={revealItem} whileHover={{ y: -2, color: "#67e8f9" }}>{item}</motion.span>
          ))}
        </motion.div>
      </section>

      <section id="projects" className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Selected Work</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">Projects built across brands, systems, and digital products.</h2>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-8 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <motion.button
                variants={revealItem}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={`rounded-full px-4 py-2 text-sm font-bold ${activeFilter === filter ? "bg-cyan-200 text-[#05070d]" : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"}`}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>

          <motion.div key={activeFilter} className="grid min-h-[650px] gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={`${activeFilter}-${project.id}`} project={project} index={index} />
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

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.article key={service.title} variants={cardMotion} whileHover={{ y: -8, scale: 1.015 }} className="glass-card rounded-[1.8rem] p-7">
                  <motion.div whileHover={{ rotate: -5, scale: 1.08 }} className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200"><Icon size={23} /></motion.div>
                  <h3 className="font-display mt-7 text-3xl font-bold tracking-[-0.04em]">{service.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-7 text-slate-400">{service.copy}</p>
                </motion.article>
              );
            })}
          </motion.div>
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

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-4 lg:grid-cols-5">
            {process.map(([number, title, copy]) => (
              <motion.article key={title} variants={cardMotion} whileHover={{ y: -8, scale: 1.02 }} className="glass-card rounded-[1.6rem] p-6">
                <motion.div whileHover={{ scale: 1.08 }} className="font-display text-5xl font-bold text-cyan-200">{number}</motion.div>
                <h3 className="font-display mt-8 text-2xl font-bold tracking-[-0.04em]">{title}</h3>
                <p className="mt-4 text-sm font-medium leading-6 text-slate-400">{copy}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="about" className="bg-white/[0.035] px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <motion.div {...fadeUp} whileHover={{ y: -6 }} className="glass-card rounded-[2rem] p-8 lg:p-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">About</p>
            <h2 className="font-display mt-4 text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">Jonathan Broqueza</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-slate-300">BSCS graduate from Bicol University Polangui, focused on building useful digital experiences for businesses, organizations, creators, and online projects.</p>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Responsive interfaces", "Custom project design", "Admin dashboard thinking", "Frontend and full-stack builds"].map((item) => (
                <motion.div variants={revealItem} whileHover={{ x: 4 }} key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200"><BadgeCheck size={16} className="text-cyan-200" /> {item}</motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div {...fadeUp}>
            <div className="mb-6 flex items-center gap-3 text-sm font-black uppercase tracking-[0.25em] text-slate-500"><Blocks size={16} /> Tools and technologies</div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stack.map((tool) => (
                <motion.div variants={cardMotion} whileHover={{ y: -4, scale: 1.02 }} key={tool} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-bold text-slate-200 hover:border-cyan-300/35 hover:bg-cyan-300/10">{tool}</motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="px-5 py-24 lg:px-8">
        <motion.div {...fadeUp} whileHover={{ y: -5 }} className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.4rem] border border-white/10 bg-white text-[#05070d] shadow-2xl shadow-cyan-400/10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-8 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-700">Start a project</p>
            <h2 className="font-display mt-4 text-5xl font-bold leading-none tracking-[-0.055em] sm:text-6xl">Tell me what you want to build.</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-slate-600">Whether it is a landing page, booking system, management system, portfolio, or full-stack website, the build starts with your goal and required features.</p>
            <motion.a href={`mailto:${contactEmail}`} className="btn-dark mt-8 inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm" whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <span>Send Email</span> <Mail size={17} />
            </motion.a>
          </div>
          <div className="bg-[#05070d] p-8 text-white lg:p-12">
            <h3 className="font-display text-3xl font-bold tracking-[-0.04em]">Project checklist</h3>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-8 space-y-4">
              {["Project type and goal", "Brand name and preferred style", "Required pages or sections", "Features such as booking, admin, forms, or dashboard", "Content, images, logo, and examples"].map((item) => (
                <motion.div variants={revealItem} whileHover={{ x: 5 }} key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold text-slate-200"><ShieldCheck size={18} className="shrink-0 text-cyan-200" /> {item}</motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <footer className="relative border-t border-white/10 px-5 py-14 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr]">
          <motion.div variants={cardMotion} whileHover={{ y: -6 }} className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <motion.span whileHover={{ rotate: -6, scale: 1.06 }} className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#05070d]"><Code2 size={21} /></motion.span>
              <div>
                <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">Jonathan Broqueza</h3>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Web Developer</p>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium leading-7 text-slate-400">Designing and building responsive websites, booking systems, management systems, portfolios, and full-stack web projects based on client needs.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.a whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }} href={`mailto:${contactEmail}`} className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-200" aria-label="Email Jonathan"><Mail size={18} /></motion.a>
              <motion.a whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }} href={facebookUrl} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-lg font-black text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-200" aria-label="Facebook profile">f</motion.a>
              <motion.a whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }} href={`tel:${phoneNumber}`} className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-200" aria-label="Call Jonathan"><Phone size={18} /></motion.a>
            </div>
          </motion.div>

          <motion.div variants={cardMotion} whileHover={{ y: -6 }} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h4 className="text-sm font-black uppercase tracking-[0.24em] text-white">Services</h4>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-400">
              {services.slice(0, 6).map((service) => <motion.a whileHover={{ x: 4 }} key={service.title} href="#services" className="hover:text-cyan-200">{service.title}</motion.a>)}
            </div>
          </motion.div>

          <motion.div variants={cardMotion} whileHover={{ y: -6 }} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h4 className="text-sm font-black uppercase tracking-[0.24em] text-white">Navigate</h4>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-400">
              {footerLinks.map((link) => <motion.a whileHover={{ x: 4 }} key={link.label} href={link.href} className="hover:text-cyan-200">{link.label}</motion.a>)}
            </div>
          </motion.div>

          <motion.div variants={cardMotion} whileHover={{ y: -6 }} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <h4 className="text-sm font-black uppercase tracking-[0.24em] text-white">Details</h4>
            <div className="mt-5 space-y-4 text-sm font-semibold text-slate-400">
              <motion.div whileHover={{ x: 4 }} className="flex gap-3"><GraduationCap size={18} className="shrink-0 text-cyan-300" /> BSCS Graduate, Bicol University Polangui</motion.div>
              <motion.div whileHover={{ x: 4 }} className="flex gap-3"><MapPin size={18} className="shrink-0 text-cyan-300" /> Bicol, Philippines</motion.div>
              <motion.a whileHover={{ x: 4 }} href={`mailto:${contactEmail}`} className="flex gap-3 hover:text-cyan-200"><Mail size={18} className="shrink-0 text-cyan-300" /> {contactEmail}</motion.a>
              <motion.a whileHover={{ x: 4 }} href={`tel:${phoneNumber}`} className="flex gap-3 hover:text-cyan-200"><Phone size={18} className="shrink-0 text-cyan-300" /> {phoneNumber}</motion.a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div {...fadeUp} className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-slate-500 md:flex-row md:items-center">
          <p>© 2026 Jonathan Broqueza. Built with Next.js, Tailwind CSS, and Framer Motion.</p>
          <p>Custom digital builds for brands, businesses, creators, and organizations.</p>
        </motion.div>
      </footer>
    </main>
  );
}
