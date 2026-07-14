/* eslint-disable @next/next/no-img-element */
"use client";

import { initialProjects, type Project } from "@/lib/projects";
import { ArrowLeft, Eye, ImageUp, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const emptyProject: Project = {
  id: "",
  slug: "",
  order: 1,
  title: "",
  type: "Website",
  industry: "",
  year: "2026",
  description: "",
  overview: "",
  role: "",
  highlights: [],
  tools: [],
  liveUrl: "",
  mediaUrl: "",
  mediaType: undefined,
  mediaName: "",
  status: "In Progress",
  featured: false,
  published: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function list(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export default function StudioPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<Project>(emptyProject);
  const [highlights, setHighlights] = useState("");
  const [tools, setTools] = useState("");
  const [notice, setNotice] = useState("Local Studio mode is active. Supabase publishing will be connected next.");

  useEffect(() => {
    const saved = window.localStorage.getItem("jb_projects");
    if (saved) {
      try { setProjects(JSON.parse(saved)); } catch { setProjects(initialProjects); }
    }
  }, []);

  function persist(next: Project[]) {
    setProjects(next);
    try {
      window.localStorage.setItem("jb_projects", JSON.stringify(next));
      setNotice("Projects saved in this browser. The public portfolio updates immediately on this device.");
    } catch {
      setNotice("Storage is full. Use smaller media files until Supabase Storage is connected.");
    }
  }

  function handleMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setNotice("Upload an image or video file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setNotice("Use a file under 8 MB for local Studio mode.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, mediaUrl: String(reader.result), mediaType: file.type.startsWith("video/") ? "video" : "image", mediaName: file.name }));
    reader.readAsDataURL(file);
  }

  function edit(project: Project) {
    setForm(project);
    setHighlights(project.highlights.join(", "));
    setTools(project.tools.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setForm({ ...emptyProject, order: projects.length + 1 });
    setHighlights("");
    setTools("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = form.id || slugify(form.title);
    const project: Project = {
      ...form,
      id,
      slug: form.slug || id,
      highlights: list(highlights),
      tools: list(tools),
      liveUrl: form.liveUrl?.trim() || undefined,
      mediaUrl: form.mediaUrl || undefined,
      mediaName: form.mediaName || undefined,
    };
    const exists = projects.some((item) => item.id === id);
    const next = exists ? projects.map((item) => item.id === id ? project : item) : [...projects, project];
    persist(next.sort((a, b) => a.order - b.order));
    reset();
  }

  return (
    <main className="min-h-screen bg-[#08090b] px-5 py-8 text-[#f4f1ea] lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-white/15 pb-7 md:flex-row md:items-end">
          <div><p className="section-kicker">Private route / Studio</p><h1 className="mt-3 font-display text-5xl font-semibold tracking-[-.06em]">Project publisher</h1><p className="mt-3 max-w-2xl text-sm text-[#8b8b92]">{notice}</p></div>
          <Link href="/" className="flex items-center gap-2"><ArrowLeft size={17} /> Public portfolio</Link>
        </header>

        <div className="grid gap-8 xl:grid-cols-[.95fr_1.05fr]">
          <form onSubmit={submit} className="border border-white/15 p-5 sm:p-7">
            <div className="mb-7 flex items-center justify-between"><h2 className="font-display text-3xl font-semibold tracking-[-.04em]">Add or edit project</h2><button type="button" onClick={reset}>Clear</button></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, id: form.id || slugify(e.target.value), slug: form.slug || slugify(e.target.value) })} className="contact-input" /></label>
              <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className="contact-input" /></label>
              <label>Project type<input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="contact-input" /></label>
              <label>Industry<input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="contact-input" /></label>
              <label>Year<input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="contact-input" /></label>
              <label>Display order<input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="contact-input" /></label>
              <label className="sm:col-span-2">Short description<textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="contact-input resize-none" /></label>
              <label className="sm:col-span-2">Full overview<textarea rows={5} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} className="contact-input resize-none" /></label>
              <label className="sm:col-span-2">My role<textarea rows={3} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="contact-input resize-none" /></label>
              <label className="sm:col-span-2">Highlights — comma separated<input value={highlights} onChange={(e) => setHighlights(e.target.value)} className="contact-input" /></label>
              <label className="sm:col-span-2">Technologies — comma separated<input value={tools} onChange={(e) => setTools(e.target.value)} className="contact-input" /></label>
              <label>Live URL<input value={form.liveUrl || ""} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="contact-input" /></label>
              <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })} className="contact-input"><option>Live</option><option>In Progress</option><option>Concept</option></select></label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured project</label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
              <div className="sm:col-span-2 border border-dashed border-white/20 p-5">
                <label className="flex cursor-pointer items-center gap-3"><UploadCloud size={19} /> Upload project image or video<input type="file" accept="image/*,video/*" onChange={handleMedia} className="hidden" /></label>
                {form.mediaUrl && <div className="mt-5">{form.mediaType === "video" ? <video src={form.mediaUrl} controls className="max-h-72 w-full object-cover" /> : <img src={form.mediaUrl} alt="Preview" className="max-h-72 w-full object-cover" />}</div>}
              </div>
            </div>
            <button className="mt-7 flex items-center gap-2 border-b border-[#ff5a36] pb-2 text-lg"><Save size={18} /> Save project</button>
          </form>

          <section>
            <div className="mb-5 flex items-end justify-between"><div><p className="section-kicker">Published content</p><h2 className="mt-2 font-display text-4xl font-semibold tracking-[-.05em]">Current projects</h2></div><span className="text-[#8b8b92]">{projects.length} total</span></div>
            <div className="space-y-3">
              {projects.sort((a, b) => a.order - b.order).map((project) => (
                <article key={project.id} className="grid gap-4 border border-white/15 p-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                  <div className="aspect-[4/3] overflow-hidden bg-[#15161a]">{project.mediaUrl ? project.mediaType === "video" ? <video src={project.mediaUrl} muted className="h-full w-full object-cover" /> : <img src={project.mediaUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><ImageUp size={22} /></div>}</div>
                  <div><p className="section-kicker">{String(project.order).padStart(2, "0")} / {project.type}</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.04em]">{project.title}</h3><p className="mt-2 text-sm text-[#8b8b92]">{project.published ? "Published" : "Draft"} · {project.status}</p></div>
                  <div className="flex gap-2"><button onClick={() => edit(project)} className="border border-white/15 p-3" aria-label="Edit"><Plus size={17} /></button><button onClick={() => persist(projects.filter((item) => item.id !== project.id))} className="border border-white/15 p-3" aria-label="Delete"><Trash2 size={17} /></button>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="border border-white/15 p-3"><Eye size={17} /></a>}</div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
