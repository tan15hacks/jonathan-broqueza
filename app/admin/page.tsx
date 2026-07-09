"use client";

import { initialProjects, type Project } from "@/lib/projects";
import { ArrowLeft, Download, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const emptyProject: Project = {
  id: "",
  title: "",
  type: "Landing Page",
  industry: "",
  description: "",
  highlights: [],
  tools: [],
  liveUrl: "",
  status: "Live",
  accent: "#22d3ee",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<Project>(emptyProject);
  const [highlightsText, setHighlightsText] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [notice, setNotice] = useState("Changes are saved in this browser. Connect a database later for a production admin system.");

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

  useEffect(() => {
    window.localStorage.setItem("jb_projects", JSON.stringify(projects));
  }, [projects]);

  const projectJson = useMemo(() => JSON.stringify(projects, null, 2), [projects]);

  function resetForm() {
    setForm(emptyProject);
    setHighlightsText("");
    setToolsText("");
  }

  function editProject(project: Project) {
    setForm(project);
    setHighlightsText(project.highlights.join(", "));
    setToolsText(project.tools.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = form.id || slugify(form.title);

    if (!form.title || !form.description || !form.type) {
      setNotice("Please add at least a project title, type, and description.");
      return;
    }

    const project: Project = {
      ...form,
      id,
      liveUrl: form.liveUrl?.trim() || undefined,
      highlights: splitList(highlightsText),
      tools: splitList(toolsText),
    };

    setProjects((current) => {
      const exists = current.some((item) => item.id === id);
      return exists ? current.map((item) => (item.id === id ? project : item)) : [project, ...current];
    });

    setNotice(`${project.title} has been saved.`);
    resetForm();
  }

  function deleteProject(id: string) {
    setProjects((current) => current.filter((project) => project.id !== id));
    setNotice("Project removed from this browser admin list.");
  }

  function restoreDefaults() {
    setProjects(initialProjects);
    setNotice("Default project list restored.");
    resetForm();
  }

  function downloadJson() {
    const blob = new Blob([projectJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jonathan-broqueza-projects.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Portfolio Admin</p>
            <h1 className="font-display mt-2 text-4xl font-bold tracking-[-0.05em]">Manage Projects</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-400">{notice}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.1]"><ArrowLeft size={16} /> Public View</Link>
            <button onClick={downloadJson} className="inline-flex items-center gap-2 rounded-full bg-cyan-200 px-4 py-3 text-sm font-black text-[#05070d]"><Download size={16} /> Export JSON</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={saveProject} className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em]">Add / Edit Project</h2>
              <button type="button" onClick={resetForm} className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300 hover:bg-white/[0.08]">Clear</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-slate-300">Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, id: slugify(event.target.value) })} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Project name" /></label>
              <label className="space-y-2 text-sm font-bold text-slate-300">Type<input value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Landing Page, Booking System..." /></label>
              <label className="space-y-2 text-sm font-bold text-slate-300">Industry<input value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Automotive, Education..." /></label>
              <label className="space-y-2 text-sm font-bold text-slate-300">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Project["status"] })} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300"><option>Live</option><option>Concept</option><option>In Progress</option></select></label>
              <label className="space-y-2 text-sm font-bold text-slate-300 sm:col-span-2">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} className="w-full resize-none rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Short project description" /></label>
              <label className="space-y-2 text-sm font-bold text-slate-300 sm:col-span-2">Highlights<input value={highlightsText} onChange={(event) => setHighlightsText(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Admin dashboard, Booking form, SEO, Mobile responsive" /></label>
              <label className="space-y-2 text-sm font-bold text-slate-300 sm:col-span-2">Tools<input value={toolsText} onChange={(event) => setToolsText(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="Next.js, React, Tailwind CSS" /></label>
              <label className="space-y-2 text-sm font-bold text-slate-300">Live URL<input value={form.liveUrl || ""} onChange={(event) => setForm({ ...form, liveUrl: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="https://..." /></label>
              <label className="space-y-2 text-sm font-bold text-slate-300">Accent Color<input value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-[#090d16] px-4 py-3 text-white outline-none focus:border-cyan-300" placeholder="#22d3ee" /></label>
            </div>

            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-[#05070d] hover:-translate-y-1 hover:bg-cyan-100"><Save size={17} /> Save Project</button>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em]">Current Projects</h2>
              <button onClick={restoreDefaults} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300 hover:bg-white/[0.08]"><RotateCcw size={14} /> Restore</button>
            </div>

            <div className="space-y-3">
              {projects.map((project) => (
                <article key={project.id} className="rounded-2xl border border-white/10 bg-[#090d16] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.accent }} /><h3 className="font-display text-xl font-bold tracking-[-0.03em]">{project.title}</h3></div>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{project.type} · {project.status}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{project.description}</p>
                    </div>
                    <button onClick={() => deleteProject(project.id)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"><Trash2 size={16} /></button>
                  </div>
                  <button onClick={() => editProject(project)} className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/[0.08]"><Plus size={15} /> Edit this project</button>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6">
          <h2 className="font-display text-3xl font-bold tracking-[-0.04em]">Export Preview</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Use this JSON as a backup or later migrate it to Supabase/Firebase for a production admin system.</p>
          <pre className="mt-5 max-h-[420px] overflow-auto rounded-2xl bg-[#090d16] p-5 text-xs leading-6 text-slate-300">{projectJson}</pre>
        </section>
      </div>
    </main>
  );
}
