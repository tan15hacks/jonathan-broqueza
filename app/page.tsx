/* eslint-disable @next/next/no-img-element */
"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Database,
  ExternalLink,
  Facebook,
  Mail,
  Menu,
  Monitor,
  Phone,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { initialProjects, type Project } from "@/lib/projects";

const contactEmail = "thanbroq896@gmail.com";
const phoneNumber = "09456821503";
const facebookUrl = "https://www.facebook.com/jonathan.broqueza.75/";
const ease = [0.22, 1, 0.36, 1] as const;
const sectionIds = ["start", "work", "services", "about", "contact"];
const heroWords = ["web apps", "mobile apps", "websites", "UI/UX", "things"];

const services = [
  {
    number: "01",
    title: "Web experiences",
    copy: "Landing pages, business sites, portfolios, and editorial websites.",
    icon: Monitor,
  },
  {
    number: "02",
    title: "Digital systems",
    copy: "Booking flows, management tools, records, and admin dashboards.",
    icon: Database,
  },
  {
    number: "03",
    title: "Product builds",
    copy: "Responsive web apps with auth, databases, storage, and custom logic.",
    icon: Smartphone,
  },
];

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Firebase",
  "Supabase",
  "Vercel",
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

function MagneticLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
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
        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
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

function ProjectTile({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 170, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 170, damping: 20 });

  return (
    <motion.button
      type="button"
      className={`project-tile project-tile-${index % 6}`}
      onClick={() => onOpen(project)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * 8);
        rotateX.set(py * -8);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 45, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.07, 0.28), ease }}
    >
      <motion.div className="project-tile-media" layoutId={`project-media-${project.id}`}>
        {project.mediaUrl ? (
          project.mediaType === "video" ? (
            <video src={project.mediaUrl} autoPlay muted loop playsInline />
          ) : (
            <img src={project.mediaUrl} alt={`${project.title} preview`} />
          )
        ) : (
          <div className={`project-fallback project-fallback-${index % 6}`}>
            <div className="fake-browser-bar"><i /><i /><i /></div>
            <div className="fake-interface">
              <span className="fake-kicker">{project.type}</span>
              <strong>{project.title}</strong>
              <div className="fake-lines"><i /><i /><i /></div>
            </div>
          </div>
        )}
        <span className="project-open-cue"><ArrowUpRight size={18} /></span>
      </motion.div>

      <div className="project-tile-copy">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>{project.title}</h3>
          <p>{project.type}</p>
        </div>
      </div>
    </motion.button>
  );
}

function GlitchWord({ word }: { word: string }) {
  return (
    <motion.strong
      key={word}
      className="relative !inline-grid whitespace-nowrap font-[inherit] font-semibold text-[var(--accent)]"
      initial={{ opacity: 0, y: 28, skewX: -8, filter: "blur(7px)" }}
      animate={{
        opacity: 1,
        y: 0,
        skewX: 0,
        filter: "blur(0px)",
        x: [0, -3, 3, -1, 0],
      }}
      exit={{ opacity: 0, y: -24, skewX: 8, filter: "blur(6px)" }}
      transition={{ duration: 0.46, ease }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none !absolute !inset-0 !inline !text-cyan-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.65, 0, 0.4, 0], x: [-4, 3, -2, 0] }}
        transition={{ duration: 0.34 }}
      >
        {word}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none !absolute !inset-0 !inline !text-fuchsia-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0, 0.35, 0], x: [4, -3, 2, 0] }}
        transition={{ duration: 0.34, delay: 0.03 }}
      >
        {word}
      </motion.span>
      <span className="relative !inline !text-[var(--accent)]">{word}</span>
    </motion.strong>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSkill, setActiveSkill] = useState("Next.js");
  const [activeSection, setActiveSection] = useState("start");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [heroWordIndex, setHeroWordIndex] = useState(0);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 65, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 65, damping: 22 });
  const slowX = useTransform(smoothX, (value) => value * 0.35);
  const slowY = useTransform(smoothY, (value) => value * 0.35);
  const mediumX = useTransform(smoothX, (value) => value * -0.58);
  const mediumY = useTransform(smoothY, (value) => value * -0.58);
  const fastX = useTransform(smoothX, (value) => value * 0.85);
  const fastY = useTransform(smoothY, (value) => value * 0.85);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 125, damping: 28 });

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

    if (!window.sessionStorage.getItem("jb_workshop_intro")) {
      setShowIntro(true);
      window.sessionStorage.setItem("jb_workshop_intro", "1");
      window.setTimeout(() => setShowIntro(false), 1250);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroWordIndex((current) => (current + 1) % heroWords.length);
    }, 1900);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { threshold: [0.25, 0.45, 0.7] },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProject]);

  const visibleProjects = useMemo(
    () => projects.filter((project) => project.published).sort((a, b) => a.order - b.order),
    [projects],
  );

  const relatedProjects = useMemo(
    () => visibleProjects.filter((project) => project.tools.some((tool) => tool.toLowerCase().includes(activeSkill.toLowerCase().split(" ")[0]))),
    [activeSkill, visibleProjects],
  );

  return (
    <LayoutGroup>
      <main>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />

        <AnimatePresence>
          {showIntro && (
            <motion.div
              className="workshop-intro"
              initial={{ opacity: 1 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.72, ease }}
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <p>jonathan.dev</p>
                <div className="intro-loader"><i /><i /><i /><i /></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="site-header">
          <nav className="site-shell nav-wrap">
            <a href="#start" className="brand-mark">Jonathan<span>.</span></a>
            <div className="desktop-nav">
              {sectionIds.map((item) => (
                <MagneticLink key={item} href={`#${item}`} className={activeSection === item ? "nav-link active" : "nav-link"}>
                  {item === "start" ? "Home" : item[0].toUpperCase() + item.slice(1)}
                </MagneticLink>
              ))}
            </div>
            <MagneticLink href="#contact" className="nav-cta">Let&apos;s talk <ArrowUpRight size={16} /></MagneticLink>
            <button className="menu-button" onClick={() => setMobileMenu((value) => !value)} aria-label="Toggle navigation">
              {mobileMenu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </nav>

          <AnimatePresence>
            {mobileMenu && (
              <motion.div className="mobile-nav site-shell" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {sectionIds.map((item) => (
                  <a key={item} href={`#${item}`} onClick={() => setMobileMenu(false)}>
                    {item === "start" ? "Home" : item[0].toUpperCase() + item.slice(1)}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <aside className="scene-nav" aria-label="Page sections">
          {sectionIds.map((item, index) => (
            <a key={item} href={`#${item}`} data-active={activeSection === item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
            </a>
          ))}
        </aside>

        <section
          id="start"
          className="hero-section"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            pointerX.set((event.clientX - rect.left - rect.width / 2) / 8);
            pointerY.set((event.clientY - rect.top - rect.height / 2) / 8);
          }}
          onMouseLeave={() => {
            pointerX.set(0);
            pointerY.set(0);
          }}
        >
          <div className="hero-grid" aria-hidden="true" />

          <motion.div className="floating-object object-browser" style={{ x: slowX, y: fastY }} aria-hidden="true">
            <div className="mini-window-top"><i /><i /><i /></div>
            <div className="mini-window-body"><b /><span /><span /><span /></div>
          </motion.div>

          <motion.div className="floating-object object-database" style={{ x: mediumX, y: mediumY }} aria-hidden="true">
            <Database size={19} />
            <span>data.connected</span>
            <i />
          </motion.div>

          <motion.div className="floating-object object-phone" style={{ x: fastX, y: slowY }} aria-hidden="true">
            <Smartphone size={24} />
            <span>mobile ready</span>
          </motion.div>

          <motion.div className="floating-object object-status" style={{ x: mediumX, y: fastY }} aria-hidden="true">
            <i /> available for projects
          </motion.div>

          <div className="site-shell hero-layout">
            <motion.div
              className="hero-copy"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.18 } } }}
            >
              <motion.p className="eyebrow" variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } } }}>
                Jonathan Broqueza / Web Developer
              </motion.p>

              <motion.h1 variants={{ hidden: { opacity: 0, y: 35 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}>
                <span className="!block !text-[var(--text)]">Hi, my name is <b className="font-[inherit] font-semibold text-[var(--accent)]">Jonathan</b></span>
                <span className="!block !text-[var(--text)]">
                  I design and build{" "}
                  <span className="relative !inline-grid min-w-[5.8em] align-baseline">
                    <AnimatePresence mode="wait">
                      <GlitchWord key={heroWords[heroWordIndex]} word={heroWords[heroWordIndex]} />
                    </AnimatePresence>
                  </span>
                </span>
              </motion.h1>

              <motion.div className="hero-actions" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}>
                <MagneticLink href="#work" className="primary-link">Explore my work <ArrowDown size={17} /></MagneticLink>
                <span>Bicol, Philippines</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-portrait-wrap"
              initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1, delay: 0.35, ease }}
            >
              <div className="portrait-code">&lt;builder /&gt;</div>
              <img src="/profile-photo.png" alt="Jonathan Broqueza" />
              <div className="portrait-caption"><span>BSCS Graduate</span><span>Open to projects</span></div>
            </motion.div>
          </div>
        </section>

        <section id="work" className="section site-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Selected work</p>
              <h2>Projects I brought to life.</h2>
            </div>
            <p>Open one.</p>
          </div>

          <div className="project-canvas">
            {visibleProjects.map((project, index) => (
              <ProjectTile key={project.id} project={project} index={index} onOpen={setSelectedProject} />
            ))}
          </div>
        </section>

        <section id="services" className="section workshop-strip">
          <div className="site-shell">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">02 / What I build</p>
                <h2>Different ideas. The right setup.</h2>
              </div>
            </div>

            <div className="service-grid">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.article
                    className="service-console"
                    key={service.title}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.65, delay: index * 0.1, ease }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="console-top"><span>{service.number}</span><i /><i /></div>
                    <Icon size={23} />
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                    <div className="console-command">build --custom</div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="section site-shell about-layout">
          <motion.div
            className="about-photo"
            initial={{ opacity: 0, rotate: -3, y: 40 }}
            whileInView={{ opacity: 1, rotate: -1.5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <img src="/profile-photo.png" alt="Jonathan Broqueza in a blue suit" />
            <span>Jonathan.jpg</span>
          </motion.div>

          <div className="about-copy">
            <p className="eyebrow">03 / About me</p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
              A builder who likes useful ideas.
            </motion.h2>
            <p>I&apos;m a BSCS graduate from Bicol University Polangui. I enjoy turning rough concepts into polished websites and digital systems.</p>

            <div className="profile-terminal">
              <div><span>role</span><strong>Web Developer</strong></div>
              <div><span>location</span><strong>Bicol, Philippines</strong></div>
              <div><span>focus</span><strong>Websites / Systems / Products</strong></div>
            </div>
          </div>

          <div className="toolkit-panel">
            <div className="toolkit-code">
              <p><span>const</span> toolkit = {"{"}</p>
              <p>&nbsp;&nbsp;frontend: <b>[&quot;Next.js&quot;, &quot;React&quot;],</b></p>
              <p>&nbsp;&nbsp;backend: <b>[&quot;Firebase&quot;, &quot;Supabase&quot;],</b></p>
              <p>&nbsp;&nbsp;delivery: <b>[&quot;GitHub&quot;, &quot;Vercel&quot;]</b></p>
              <p>{"}"};</p>
            </div>

            <div className="skill-picker">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  data-active={activeSkill === skill}
                  onMouseEnter={() => setActiveSkill(skill)}
                  onFocus={() => setActiveSkill(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="skill-result">
              <span>Used in</span>
              <strong>{relatedProjects.length ? relatedProjects.slice(0, 3).map((project) => project.title).join(" · ") : "Custom project builds"}</strong>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="site-shell contact-layout">
            <div>
              <p className="eyebrow">04 / Contact</p>
              <h2>Got an idea?<br /><span>Let&apos;s make it real.</span></h2>
            </div>

            <div className="contact-links">
              <MagneticLink href={`mailto:${contactEmail}`}><Mail size={18} /> Email me</MagneticLink>
              <MagneticLink href={`tel:${phoneNumber}`}><Phone size={18} /> {phoneNumber}</MagneticLink>
              <MagneticLink href={facebookUrl} external><Facebook size={18} /> Facebook</MagneticLink>
            </div>
          </div>
        </section>

        <footer>
          <div className="site-shell footer-wrap">
            <span>© 2026 Jonathan Broqueza</span>
            <span>Designed and built in Bicol.</span>
          </div>
        </footer>

        <AnimatePresence>
          {selectedProject && (
            <motion.div className="project-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button className="modal-backdrop" type="button" onClick={() => setSelectedProject(null)} aria-label="Close project" />
              <motion.article className="project-modal-panel" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.72, ease }}>
                <button className="modal-close" type="button" onClick={() => setSelectedProject(null)} aria-label="Close project"><X size={22} /></button>

                <motion.div className="modal-media" layoutId={`project-media-${selectedProject.id}`}>
                  {selectedProject.mediaUrl ? (
                    selectedProject.mediaType === "video" ? (
                      <video src={selectedProject.mediaUrl} autoPlay muted loop playsInline controls />
                    ) : (
                      <img src={selectedProject.mediaUrl} alt={`${selectedProject.title} project`} />
                    )
                  ) : (
                    <div className="modal-fallback">
                      <div className="fake-browser-bar"><i /><i /><i /></div>
                      <strong>{selectedProject.title}</strong>
                      <span>{selectedProject.type}</span>
                    </div>
                  )}
                </motion.div>

                <div className="modal-copy">
                  <div className="modal-heading">
                    <div>
                      <p className="eyebrow">{selectedProject.year} / {selectedProject.status}</p>
                      <h2>{selectedProject.title}</h2>
                    </div>
                    <span>{selectedProject.type}</span>
                  </div>

                  <p className="modal-overview">{selectedProject.overview}</p>

                  <div className="modal-details">
                    <div><span>My role</span><p>{selectedProject.role}</p></div>
                    <div><span>Built with</span><p>{selectedProject.tools.join(" · ")}</p></div>
                    <div><span>Highlights</span><p>{selectedProject.highlights.join(" · ")}</p></div>
                  </div>

                  {selectedProject.liveUrl && (
                    <MagneticLink href={selectedProject.liveUrl} external className="modal-live-link">
                      Visit live project <ExternalLink size={18} />
                    </MagneticLink>
                  )}
                </div>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </LayoutGroup>
  );
}
