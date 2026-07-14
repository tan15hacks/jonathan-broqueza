/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight, Facebook, Mail, Menu, Phone, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { initialProjects, type Project } from "@/lib/projects";

const accent = "#8b5cf6";
const contactEmail = "thanbroq896@gmail.com";
const phoneNumber = "09456821503";
const facebookUrl = "https://www.facebook.com/jonathan.broqueza.75/";
const ease = [0.22, 1, 0.36, 1] as const;
const roleWords = ["websites", "digital systems", "web apps"];

const services = [
  ["Websites", "Landing pages, business sites, portfolios, and blogs."],
  ["Systems", "Booking flows, management tools, and admin dashboards."],
  ["Full-stack", "Authentication, databases, storage, and custom logic."],
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

function MagneticLink({ href, children, external = false, className = "" }: { href: string; children: React.ReactNode; external?: boolean; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`magnetic-link ${className}`}
      style={{ x, y }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.11);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.11);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const sceneX = useMotionValue(0);
  const sceneY = useMotionValue(0);
  const smoothSceneX = useSpring(sceneX, { stiffness: 70, damping: 20 });
  const smoothSceneY = useSpring(sceneY, { stiffness: 70, damping: 20 });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28 });

  useEffect(() => {
    const stored = window.localStorage.getItem("jb_projects");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Project>[];
        setProjects(parsed.map(normalizeProject));
      } catch {
        setProjects(initialProjects);
      }
    }

    const roleTimer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roleWords.length);
    }, 1800);

    const move = (event: MouseEvent) => {
      const horizontal = event.clientX / window.innerWidth - 0.5;
      const vertical = event.clientY / window.innerHeight - 0.5;
      sceneX.set(horizontal * 24);
      sceneY.set(vertical * 18);
      previewX.set(Math.min(event.clientX + 24, window.innerWidth - 430));
      previewY.set(Math.min(event.clientY + 24, window.innerHeight - 320));
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.clearInterval(roleTimer);
      window.removeEventListener("mousemove", move);
    };
  }, [previewX, previewY, sceneX, sceneY]);

  const visibleProjects = useMemo(
    () => projects.filter((project) => project.published).sort((a, b) => a.order - b.order),
    [projects],
  );

  return (
    <main>
      <motion.div className="scroll-progress" style={{ scaleX: progress, background: accent }} />

      <header className="site-header">
        <nav className="site-shell nav-wrap">
          <a href="#start" className="brand-mark">JB<span>.</span></a>

          <div className="desktop-nav">
            {["Start", "Work", "Services", "About", "Contact"].map((item) => (
              <MagneticLink key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</MagneticLink>
            ))}
          </div>

          <button className="menu-button" onClick={() => setMobileMenu((current) => !current)} aria-label="Toggle navigation">
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div className="mobile-nav site-shell" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {["Start", "Work", "Services", "About", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)}>{item}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="start" className="hero-section">
        <motion.div className="shape-field" style={{ x: smoothSceneX, y: smoothSceneY }} aria-hidden="true">
          <span className="facet facet-one" />
          <span className="facet facet-two" />
          <span className="facet facet-three" />
          <span className="facet facet-four" />
        </motion.div>

        <div className="site-shell hero-layout">
          <div className="hero-rail" aria-hidden="true">
            <span className="rail-dot" />
            <span className="rail-line" />
            <span className="rail-label">scroll</span>
          </div>

          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.18 } } }}
          >
            <motion.p className="route-label" variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } } }}>
              Start /&gt;
            </motion.p>

            <motion.h1 variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}>
              Hi, I&apos;m <span>Jonathan Broqueza</span>
            </motion.h1>

            <motion.div className="role-line" variants={{ hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}>
              <span>I design and develop</span>
              <span className="role-window">
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={roleWords[roleIndex]}
                    initial={{ opacity: 0, y: 28, rotateX: -45 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -26, rotateX: 45 }}
                    transition={{ duration: 0.42, ease }}
                  >
                    {roleWords[roleIndex]}
                  </motion.strong>
                </AnimatePresence>
              </span>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.15 } } }}>
              <MagneticLink href="#work" className="hero-link">Let me show you <ArrowDown size={16} /></MagneticLink>
            </motion.div>
          </motion.div>

          <motion.div className="hero-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.7 }}>
            <p>Web developer</p>
            <p>Bicol, Philippines</p>
          </motion.div>
        </div>
      </section>

      <section id="work" className="section site-shell">
        <div className="section-heading">
          <p className="route-label">Work /&gt;</p>
          <h2>Selected projects.</h2>
          <p>Websites and systems built for real goals.</p>
        </div>

        <div className="project-list">
          {visibleProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.liveUrl || "#contact"}
              target={project.liveUrl ? "_blank" : undefined}
              rel={project.liveUrl ? "noreferrer" : undefined}
              className="project-row"
              onMouseEnter={() => setActiveProject(project)}
              onMouseLeave={() => setActiveProject(null)}
              whileHover={{ x: 8 }}
              transition={{ duration: 0.3, ease }}
            >
              <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <div className="project-meta">
                <span>{project.type}</span>
                <ArrowUpRight size={20} />
              </div>
            </motion.a>
          ))}
        </div>

        <AnimatePresence>
          {activeProject && (
            <motion.div className="project-preview" style={{ x: previewX, y: previewY }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
              {activeProject.mediaUrl ? (
                activeProject.mediaType === "video" ?
                  <video src={activeProject.mediaUrl} autoPlay muted loop playsInline /> :
                  <img src={activeProject.mediaUrl} alt={`${activeProject.title} preview`} />
              ) : (
                <div className="preview-fallback"><span>{activeProject.type}</span><strong>{activeProject.title}</strong></div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="services" className="section section-dark">
        <div className="site-shell">
          <div className="section-heading compact">
            <p className="route-label">Services /&gt;</p>
            <h2>What I build.</h2>
          </div>

          <div className="service-list">
            {services.map(([title, copy], index) => (
              <motion.div className="service-row" key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.55, delay: index * 0.08, ease }}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section site-shell about-layout">
        <motion.div className="about-photo" initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }} whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>
          <img src="/profile-photo.png" alt="Jonathan Broqueza" />
        </motion.div>

        <motion.div className="about-copy" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
          <p className="route-label">About /&gt;</p>
          <h2>I build around what the project needs.</h2>
          <p>BSCS graduate from Bicol University Polangui. I create custom websites and digital systems for businesses, organizations, and product ideas.</p>
          <div className="skills-line">Next.js <span>/</span> React <span>/</span> TypeScript <span>/</span> Firebase <span>/</span> Supabase</div>
        </motion.div>
      </section>

      <section id="contact" className="contact-section">
        <div className="site-shell">
          <p className="route-label">Contact /&gt;</p>
          <h2>Let&apos;s build something useful.</h2>

          <div className="contact-links">
            <MagneticLink href={`mailto:${contactEmail}`}><Mail size={18} /> Email me</MagneticLink>
            <MagneticLink href={`tel:${phoneNumber}`}><Phone size={18} /> {phoneNumber}</MagneticLink>
            <MagneticLink href={facebookUrl} external><Facebook size={18} /> Facebook</MagneticLink>
          </div>
        </div>
      </section>

      <footer>
        <div className="site-shell footer-inner">
          <p>© 2026 Jonathan Broqueza</p>
          <p>Websites / Systems / Full-stack</p>
        </div>
      </footer>
    </main>
  );
}
