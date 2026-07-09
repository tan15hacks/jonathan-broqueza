/* eslint-disable @next/next/no-img-element */
"use client";

import { initialProjects, type Project } from "@/lib/projects";
import { ArrowLeft, Download, ImageUp, Plus, RotateCcw, Save, Trash2, UploadCloud, Video, XCircle } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

const emptyProject: Project = {
  id: "",
  title: "",
  type: "Landing Page",
  industry: "",
  description: "",
  highlights: [],
  tools: [],
  liveUrl: "",
  mediaUrl: "",
  mediaType: undefined,
  mediaName: "",
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

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<Project>(emptyProject);
  const [highlightsText, setHighlightsText] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [notice, setNotice] = useState("Changes are saved in this browser. Media uploads work for preview, but production media storage should use Supabase or Firebase Storage.");

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
    try {
      window.localStorage.setItem("jb_projects", JSON.stringify(projects));
    } catch {
      setNotice("The upload is too large for browser storage. Use a smaller image/video, or connect Supabase/Firebase Storage for real production uploads.");
    }
  }, [projects]);

  const projectJson = useMemo(() => JSON.stringify(projects, null, 2), [projects]);

  function resetForm() {
    setForm(emptyProject);
    setHighlightsText("");
    setToolsText("");
  }

  function editProject(project: Project) {
    setForm({ ...emptyProject, ...project });
    setHighlightsText(project.highlights.join(", "));
    setToolsText(project.tools.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setNotice("Please upload an image or video file only.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setNotice(`This file is ${formatBytes(file.size)}. For this local admin version, use files under 8 MB. Production upload should use Supabase/Firebase Storage.`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        mediaUrl: String(reader.result),
        mediaType: isVideo ? "video" : "image",
        mediaName: file.name,
      }));
      setNotice(`${file.name} added to the project form. Save the project to publish it on this browser.`);
    };
    reader.onerror = () => setNotice("The file could not be read. Try another image or video.");
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removeMedia() {
    setForm((current) => ({ ...current, mediaUrl: "", mediaType: undefined, mediaName: "" }));
    setNotice("Media removed from the form.");
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
      mediaUrl: form.mediaUrl || undefined,
      mediaName: form.mediaName || undefined,
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
            <button onClick={downloadJson} className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm"><Download size={16} /> Export JSON</button>
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

              <div className="space-y-3 rounded-3xl border border-white/10 bg-[#090d16] p-4 sm:col-span-2">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-200">Project Image or Video</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Upload a preview for the public project card. Keep it under 8 MB for this local version.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 hover:bg-cyan-300/20">
                    <UploadCloud size={16} /> Upload Media
                    <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
                  </label>
                </div>

                {form.mediaUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    {form.mediaType === "video" ? (
                      <video src={form.mediaUrl} controls muted playsInline className="h-64 w-full object-cover" />
                    ) : (
                      <img src={form.mediaUrl} alt="Project media preview" className="h-64 w-full object-cover" />
                    )}
                    <div className="flex flex-col justify-between gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                        {form.mediaType === "video" ? <Video size={16} /> : <ImageUp size={16} />}
                        <span>{form.mediaName || "Uploaded media"}</span>
                      </div>
                      <button type="button" onClick={removeMedia} className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 hover:bg-red-500/20"><XCircle size={16} /> Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
                    <div>
                      <ImageUp className="mx-auto text-cyan-200" size={30} />
                      <p className="mt-3 text-sm font-bold text-slate-300">No media uploaded yet</p>
                      <p className="mt-1 text-xs text-slate-500">Images are best. Short compressed videos can work for preview.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm hover:-translate-y-1"><Save size={17} /> Save Project</button>
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
                    <div className="min-w-0 flex-1">
                      {project.mediaUrl && (
                        <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                          {project.mediaType === "video" ? (
                            <video src={project.mediaUrl} muted playsInline className="h-40 w-full object-cover" />
                          ) : (
                            <img src={project.mediaUrl} alt={`${project.title} preview`} className="h-40 w-full object-cover" />
                          )}
                        </div>
                      )}
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
