/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Facebook, Mail, Menu, Phone, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { initialProjects, type Project } from "@/lib/projects";

const accent = "#ff5a36";
const contactEmail = "thanbroq896@gmail.com";
const phoneNumber = "09456821503";
const facebookUrl = "https://www.facebook.com/jonathan.broqueza.75/";
const ease = [0.22, 1, 0.36, 1] as const;

const capabilities = [
  {
    label: "Websites",
    copy: "Responsive websites designed around the client’s identity, content, audience, and conversion goal—not around a reused template.",
    items: ["Landing pages", "Business websites", "Portfolio websites", "Blog and editorial websites", "Product and service websites"],
  },
  {
    label: "Digital Systems",
    copy: "Internal and public-facing systems that organize information, reduce repetitive work, and make daily operations easier to manage.",
    items: ["Booking systems", "Management systems", "Admin dashboards", "Records and workflow tools", "Content management interfaces"],
  },
  {
    label: "Full-stack Products",
    copy: "Complete digital products with the application logic, data, access control, and integrations needed to support real users.",
    items: ["Authentication", "Database integration", "Cloud storage", "User roles", "Forms and automation", "Custom application logic"],
  },
  {
    label: "Design & Delivery",
    copy: "A polished product requires more than code. I shape the interface, responsive behavior, technical setup, and final launch experience.",
    items: ["UI/UX direction", "Responsive design", "SEO foundations", "Performance optimization", "Vercel deployment", "Project handoff"],
  },
];

const process = [
  ["Discover", "Understand the project, users, content, business goal, and required features."],
  ["Define", "Organize the pages, system behavior, information structure, data, and technical scope."],
  ["Design", "Create the visual direction and interface around the client’s goals rather than forcing a preset style."],
  ["Develop", "Build the responsive frontend, backend services, database connections, and core interactions."],
  ["Refine", "Test mobile behavior, accessibility, performance, form states, and the details people notice."],
  ["Launch", "Deploy the finished product, configure the production environment, and prepare it for real use."],
];

const skillGroups = [
  ["Frontend", "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  ["Backend & Data", "Firebase", "Supabase", "Authentication", "Database Design", "Cloud Storage"],
  ["Design & Delivery", "Responsive UI", "UI/UX Design", "SEO", "GitHub", "Vercel"],
];

function normalizeProject(project: Partial<Project>, index: number): Project {
  const fallback = initialProjects.find((item) => item.id === project.id) ?? initialProjects[index] ?? initialProjects[0];
  return {
    ...fallback,
    ...project,
    slug: project.slug || project.id || fallback.slug,
    order: project.order ?? index + 1,
    year: project.year || "2026",
    overview: project.overview || project.description || fallback.overview,
    role: project.role || fallback.role,
    featured: project.featured ?? true,
    published: project.published ?? true,
  };
}

function MagneticLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="magnetic-link"
      style={{ x, y }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeCapability, setActiveCapability] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  useEffect(() => {
    const stored = window.localStorage.getItem("jb_projects");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Project>[];
        setProjects(parsed.map(normalizeProject).filter((item) => item.published).sort((a, b) => a.order - b.order));
      } catch {
        setProjects(initialProjects);
      }
    }
    if (!window.sessionStorage.getItem("jb_intro_seen")) {
      setShowIntro(true);
      window.sessionStorage.setItem("jb_intro_seen", "1");
      window.setTimeout(() => setShowIntro(false), 1450);
    }
    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX - 6);
      cursorY.set(event.clientY - 6);
      previewX.set(Math.min(event.clientX + 28, window.innerWidth - 470));
      previewY.set(Math.min(event.clientY + 28, window.innerHeight - 360));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY, previewX, previewY]);

  const visibleProjects = useMemo(() => projects.filter((project) => project.published).sort((a, b) => a.order - b.order), [projects]);

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio inquiry — ${data.get("projectType") || "New project"}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nProject type: ${data.get("projectType")}\nPreferred launch: ${data.get("launch")}\nBudget: ${data.get("budget")}\n\nProject details:\n${data.get("message")}`,
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <main>
      <motion.div className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left" style={{ scaleX: progress, background: accent }} />
      <motion.div className="cursor-dot" style={{ x: cursorX, y: cursorY }} />

      <AnimatePresence>
        {showIntro && (
          <motion.div className="intro-screen" exit={{ y: "-100%" }} transition={{ duration: 0.7, ease }}>
            <div className="text-center">
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="section-kicker">Jonathan Broqueza</motion.p>
              <motion.h2 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="mt-4 font-display text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Digital products & web systems</motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="nav-pill site-shell flex items-center justify-between px-5 py-3">
          <a href="#start" className="font-display text-lg font-semibold tracking-[-.04em]">JB<span className="accent">.</span></a>
          <div className="hidden items-center gap-7 text-sm text-[#c8c5be] md:flex">
            {["Work", "Capabilities", "Process", "About", "Contact"].map((item) => (
              <MagneticLink key={item} href={`#${item.toLowerCase()}`}>{item}</MagneticLink>
            ))}
          </div>
          <MagneticLink href="#contact"><span className="hidden sm:inline">Start a project</span><ArrowUpRight size={17} /></MagneticLink>
          <button className="md:hidden" onClick={() => setMobileMenu((value) => !value)} aria-label="Toggle menu">{mobileMenu ? <X /> : <Menu />}</button>
        </nav>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="nav-pill site-shell mt-2 grid gap-2 p-4 md:hidden">
              {["Work", "Capabilities", "Process", "About", "Contact"].map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="border-b hairline py-3">{item}</a>)}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="start" className="site-shell min-h-screen pt-36 pb-20 flex flex-col justify-between">
        <div className="grid gap-12 lg:grid-cols-[1fr_.38fr] lg:items-start">
          <div>
            <p className="section-kicker mb-8">Full-stack developer / Digital product designer</p>
            <h1 className="display-title">
              <span className="block">I turn rough ideas</span>
              <span className="block">into working</span>
              <span className="block accent">digital products.</span>
            </h1>
          </div>
          <motion.div initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }} animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.1, delay: .35, ease }} className="relative mt-10 lg:mt-24">
            <img src="/profile-photo.png" alt="Jonathan Broqueza" className="aspect-[4/5] w-full object-cover object-top grayscale-[12%]" />
            <div className="absolute -bottom-5 -left-5 bg-[var(--accent)] px-4 py-3 text-sm font-bold text-[#08090b]">Available for selected projects</div>
          </motion.div>
        </div>
        <div className="mt-16 grid gap-8 border-t hairline pt-8 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <p className="body-large max-w-2xl muted">I design and build websites, booking systems, management platforms, and full-stack products around the way each client actually works.</p>
          <div className="text-sm leading-7 muted"><p>Bicol, Philippines</p><p>BSCS Graduate — Bicol University Polangui</p></div>
          <MagneticLink href="#work">View selected work <ArrowDownRight size={18} /></MagneticLink>
        </div>
      </section>

      <section id="work" className="section-pad site-shell">
        <p className="section-kicker">01 / Selected work</p>
        <div className="mt-8 mb-20 grid gap-8 lg:grid-cols-2 lg:items-end">
          <h2 className="section-title">Different industries. Different problems. Built with intent.</h2>
          <p className="body-large muted lg:pb-3">Each project begins with the audience, the workflow, and what the finished product needs to accomplish—not with a recycled layout.</p>
        </div>
        <div>
          {visibleProjects.map((project, index) => (
            <motion.a
              href={project.liveUrl || "#contact"}
              target={project.liveUrl ? "_blank" : undefined}
              rel={project.liveUrl ? "noreferrer" : undefined}
              className="project-row"
              key={project.id}
              onMouseEnter={() => setActiveProject(project)}
              onMouseLeave={() => setActiveProject(null)}
              whileHover={{ x: 8 }}
              transition={{ duration: .35, ease }}
            >
              <span className="section-kicker">{String(index + 1).padStart(2, "0")}</span>
              <div><h3 className="project-title">{project.title}</h3><p className="mt-3 max-w-xl muted">{project.description}</p></div>
              <div className="text-right text-sm"><p>{project.type}</p><p className="mt-2 muted">{project.year} / {project.status}</p><ArrowUpRight className="ml-auto mt-4" size={20} /></div>
            </motion.a>
          ))}
        </div>
        <AnimatePresence>
          {activeProject && (
            <motion.div className="project-preview" style={{ x: previewX, y: previewY }} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .92 }} transition={{ duration: .22 }}>
              {activeProject.mediaUrl ? activeProject.mediaType === "video" ? <video src={activeProject.mediaUrl} autoPlay muted loop playsInline /> : <img src={activeProject.mediaUrl} alt="" /> : <div className="preview-fallback"><div className="relative z-10"><p className="section-kicker">{activeProject.type}</p><p className="mt-3 font-display text-4xl font-semibold tracking-[-.05em]">{activeProject.title}</p></div></div>}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="capabilities" className="section-pad border-y hairline">
        <div className="site-shell">
          <p className="section-kicker">02 / Capabilities</p>
          <h2 className="section-title mt-8 max-w-5xl">Different projects need different systems.</h2>
          <div className="mt-20 grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>{capabilities.map((item, index) => <button key={item.label} className="capability-tab" data-active={activeCapability === index} onClick={() => setActiveCapability(index)}><span className="mr-5 section-kicker">0{index + 1}</span><span className="text-2xl">{item.label}</span></button>)}</div>
            <AnimatePresence mode="wait">
              <motion.div key={activeCapability} className="capability-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .4, ease }}>
                <p className="body-large max-w-2xl muted">{capabilities[activeCapability].copy}</p>
                <div className="mt-12 grid gap-0 sm:grid-cols-2">{capabilities[activeCapability].items.map((item) => <div key={item} className="border-b hairline py-4 text-lg">{item}</div>)}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="process" className="section-pad site-shell">
        <p className="section-kicker">03 / Process</p>
        <div className="mt-8 grid gap-16 lg:grid-cols-[.9fr_1.1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start"><h2 className="section-title">From first conversation to real launch.</h2><p className="body-large muted mt-8 max-w-xl">A clear build process keeps scope, design, functionality, and expectations aligned from the beginning.</p></div>
          <div className="relative pt-2"><div className="process-line" /><motion.div className="process-progress" style={{ scaleY: progress, height: "100%" }} />{process.map(([title, copy], index) => <motion.div className="process-step" key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20%" }}><span className="process-dot" /><p className="section-kicker">0{index + 1}</p><h3 className="mt-3 font-display text-4xl font-semibold tracking-[-.05em]">{title}</h3><p className="mt-4 max-w-xl text-lg leading-8 muted">{copy}</p></motion.div>)}</div>
        </div>
      </section>

      <section id="about" className="section-pad border-y hairline">
        <div className="site-shell">
          <p className="section-kicker">04 / About</p>
          <div className="mt-12 grid gap-14 lg:grid-cols-[.72fr_1.28fr]">
            <div className="portrait-frame"><img src="/profile-photo.png" alt="Jonathan Broqueza in a blue suit" /></div>
            <div>
              <p className="section-kicker">about.jonathan</p>
              <h2 className="section-title mt-6">I build around purpose, not a preset style.</h2>
              <p className="body-large muted mt-8 max-w-3xl">I am Jonathan Broqueza, a BSCS graduate from Bicol University Polangui. I design and develop websites and digital systems for businesses, organizations, creators, and product ideas.</p>
              <div className="mt-12 border-y hairline py-10"><div className="quote-mark">“</div><p className="font-display text-3xl leading-tight tracking-[-.04em] sm:text-5xl">I do not force a project into a template. I build around its purpose.</p></div>
              <div className="mt-14 grid gap-10 md:grid-cols-3">{skillGroups.map(([heading, ...items]) => <div className="skill-column" key={heading}><h3>{heading}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-pad site-shell">
        <p className="section-kicker">05 / Contact</p>
        <div className="mt-8 grid gap-16 lg:grid-cols-[.9fr_1.1fr]">
          <div><h2 className="section-title">Have something you want to build?</h2><p className="body-large muted mt-8 max-w-xl">Share what it needs to become. I’ll use your details to understand the scope and recommend the right approach.</p><div className="mt-12 space-y-4 text-lg"><a href={`mailto:${contactEmail}`} className="flex items-center gap-3"><Mail size={18} className="accent" />{contactEmail}</a><a href={`tel:${phoneNumber}`} className="flex items-center gap-3"><Phone size={18} className="accent" />{phoneNumber}</a><a href={facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3"><Facebook size={18} className="accent" />Facebook</a></div></div>
          <form onSubmit={submitContact} className="grid gap-8 sm:grid-cols-2"><input name="name" required placeholder="Your name" className="contact-input" /><input name="email" type="email" required placeholder="Email address" className="contact-input" /><select name="projectType" className="contact-input"><option>Website</option><option>Landing Page</option><option>Booking System</option><option>Management System</option><option>Full-stack Product</option><option>Other</option></select><input name="launch" placeholder="Preferred launch date" className="contact-input" /><input name="budget" placeholder="Estimated budget — optional" className="contact-input sm:col-span-2" /><textarea name="message" required rows={6} placeholder="Tell me about the project, goals, required features, and preferred style." className="contact-input resize-none sm:col-span-2" /><button className="justify-self-start border-b pb-2 text-lg" style={{ borderColor: accent }}>Prepare project email <ArrowUpRight className="ml-2 inline" size={18} /></button></form>
        </div>
      </section>

      <footer className="border-t hairline py-10"><div className="site-shell flex flex-col justify-between gap-4 text-sm muted sm:flex-row"><p>© 2026 Jonathan Broqueza</p><p>Full-stack developer & digital product designer — Bicol, Philippines</p></div></footer>
    </main>
  );
}
