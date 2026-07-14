/* eslint-disable @next/next/no-img-element */
"use client";

import { type Project } from "@/lib/projects";
import { ArrowLeft, Eye, ImageUp, LogOut, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";

const emptyProject: Project = {
  id: "",
  slug: "",
  order: 1,
  category: "Web",
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
  const [authStatus, setAuthStatus] = useState<"checking" | "locked" | "ready">("checking");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(emptyProject);
  const [highlights, setHighlights] = useState("");
  const [tools, setTools] = useState("");
  const [notice, setNotice] = useState("Connecting to Neon Postgres...");
  const [saving, setSaving] = useState(false);

  const nextOrder = useCallback((category: Project["category"], source = projects) => {
    return source.filter((project) => project.category === category).length + 1;
  }, [projects]);

  const loadProjects = useCallback(async () => {
    const response = await fetch("/api/studio/projects", { cache: "no-store" });
    if (response.status === 401) {
      setAuthStatus("locked");
      return;
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load projects.");

    const next = data as Project[];
    setProjects(next);
    window.localStorage.setItem("jb_projects", JSON.stringify(next));
    setForm((current) => ({
      ...current,
      category: current.category || "Web",
      order: current.id ? current.order : next.filter((project) => project.category === (current.category || "Web")).length + 1,
    }));
    setNotice("Connected to Neon. Web and Mobile projects are published into their own sections.");
  }, []);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/studio/session", { cache: "no-store" });
        const data = await response.json();
        if (data.authenticated) {
          setAuthStatus("ready");
          await loadProjects();
        } else {
          setAuthStatus("locked");
          setNotice("Enter your private Studio password.");
        }
      } catch {
        setAuthStatus("locked");
        setNotice("Add DATABASE_URL and STUDIO_PASSWORD to your environment variables first.");
      }
    }
    void checkSession();
  }, [loadProjects]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Signing in...");
    const response = await fetch("/api/studio/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setNotice(data.error || "Unable to sign in.");
      return;
    }
    setPassword("");
    setAuthStatus("ready");
    await loadProjects();
  }

  async function logout() {
    await fetch("/api/studio/session", { method: "DELETE" });
    setProjects([]);
    setAuthStatus("locked");
    setNotice("Studio locked.");
  }

  function handleSmallImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Use a hosted URL for videos. Small local uploads support images only.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setNotice("Keep database image uploads below 1 MB, or paste a hosted media URL instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({
      ...current,
      mediaUrl: String(reader.result),
      mediaType: "image",
      mediaName: file.name,
    }));
    reader.readAsDataURL(file);
  }

  function edit(project: Project) {
    setForm({ ...project, category: project.category || "Web" });
    setHighlights(project.highlights.join(", "));
    setTools(project.tools.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset(category: Project["category"] = "Web") {
    setForm({ ...emptyProject, category, order: nextOrder(category) });
    setHighlights("");
    setTools("");
  }

  function changeCategory(category: Project["category"]) {
    setForm((current) => ({
      ...current,
      category,
      order: current.id ? current.order : nextOrder(category),
      type: current.id ? current.type : category === "Mobile" ? "Mobile Application" : "Website",
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("Saving to Neon...");

    const id = form.id || slugify(form.title);
    const project: Project = {
      ...form,
      id,
      slug: form.slug || id,
      highlights: list(highlights),
      tools: list(tools),
      liveUrl: form.liveUrl?.trim() || undefined,
      mediaUrl: form.mediaUrl?.trim() || undefined,
      mediaName: form.mediaName?.trim() || undefined,
    };

    try {
      const response = await fetch("/api/studio/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save project.");
      await loadProjects();
      reset(project.category);
      setNotice(`${project.title} was saved under ${project.category} projects.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Delete ${project.title}?`)) return;
    const response = await fetch("/api/studio/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id }),
    });
    const data = await response.json();
    if (!response.ok) {
      setNotice(data.error || "Unable to delete project.");
      return;
    }
    await loadProjects();
    if (form.id === project.id) reset(project.category);
    setNotice(`${project.title} was deleted.`);
  }

  if (authStatus === "checking") {
    return <main className="grid min-h-screen place-items-center bg-[#08090b] text-[#f4f1ea]">Connecting to Studio...</main>;
  }

  if (authStatus === "locked") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#08090b] px-5 text-[#f4f1ea]">
        <form onSubmit={login} className="w-full max-w-md border border-white/15 bg-white/[0.025] p-7">
          <p className="section-kicker">Private route / Studio</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-.06em]">Project publisher</h1>
          <p className="mt-4 text-sm leading-6 text-[#9b948e]">{notice}</p>
          <label className="mt-7 block">Studio password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="contact-input mt-2" autoFocus /></label>
          <button className="mt-6 border-b border-[#ff7a1a] pb-2 font-bold">Unlock Studio</button>
          <Link href="/" className="mt-7 flex items-center gap-2 text-sm text-[#a99b8f]"><ArrowLeft size={16} /> Back to portfolio</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090b] px-5 py-8 text-[#f4f1ea] lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-white/15 pb-7 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Private route / Neon Studio</p>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-.06em]">Project publisher</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#9b948e]">{notice}</p>
          </div>
          <div className="flex gap-5">
            <Link href="/" className="flex items-center gap-2"><ArrowLeft size={17} /> Public portfolio</Link>
            <button onClick={logout} className="flex items-center gap-2 text-[#a99b8f]"><LogOut size={17} /> Lock</button>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[.95fr_1.05fr]">
          <form onSubmit={submit} className="border border-white/15 p-5 sm:p-7">
            <div className="mb-7 flex items-center justify-between">
              <div><p className="section-kicker">{form.id ? "Editing project" : "New project"}</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-.04em]">Add or edit project</h2></div>
              <button type="button" onClick={() => reset(form.category)}>Clear</button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
              {(["Web", "Mobile"] as Project["category"][]).map((category) => (
                <button key={category} type="button" onClick={() => changeCategory(category)} className={`rounded-xl px-4 py-3 text-sm font-bold transition ${form.category === category ? "bg-[#ff7a1a] text-black" : "text-[#b9afa7] hover:bg-white/5"}`}>
                  {category} project
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label>Work category<select required value={form.category} onChange={(event) => changeCategory(event.target.value as Project["category"])} className="contact-input"><option value="Web">Web</option><option value="Mobile">Mobile</option></select></label>
              <label>Display order<input type="number" min="1" value={form.order} onChange={(event) => setForm({ ...form, order: Number(event.target.value) })} className="contact-input" /></label>
              <label>Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, id: form.id || slugify(event.target.value), slug: form.slug || slugify(event.target.value) })} className="contact-input" /></label>
              <label>Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} className="contact-input" /></label>
              <label>Project type<input required value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} placeholder={form.category === "Mobile" ? "Mobile Application" : "Business Website"} className="contact-input" /></label>
              <label>Industry<input value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} className="contact-input" /></label>
              <label>Year<input value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} className="contact-input" /></label>
              <label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Project["status"] })} className="contact-input"><option>Live</option><option>In Progress</option><option>Concept</option></select></label>
              <label className="sm:col-span-2">Short description<textarea required rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="contact-input resize-none" /></label>
              <label className="sm:col-span-2">Full overview<textarea rows={5} value={form.overview} onChange={(event) => setForm({ ...form, overview: event.target.value })} className="contact-input resize-none" /></label>
              <label className="sm:col-span-2">My role<textarea rows={3} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="contact-input resize-none" /></label>
              <label className="sm:col-span-2">Highlights — comma separated<input value={highlights} onChange={(event) => setHighlights(event.target.value)} className="contact-input" /></label>
              <label className="sm:col-span-2">Technologies — comma separated<input value={tools} onChange={(event) => setTools(event.target.value)} placeholder={form.category === "Mobile" ? "Flutter, Dart, Firebase" : "Next.js, React, TypeScript"} className="contact-input" /></label>
              <label>Live URL<input value={form.liveUrl || ""} onChange={(event) => setForm({ ...form, liveUrl: event.target.value })} className="contact-input" /></label>
              <label>Media type<select value={form.mediaType || "image"} onChange={(event) => setForm({ ...form, mediaType: event.target.value as "image" | "video" })} className="contact-input"><option value="image">Image</option><option value="video">Video</option></select></label>
              <label className="sm:col-span-2">Media URL<input value={form.mediaUrl || ""} onChange={(event) => setForm({ ...form, mediaUrl: event.target.value, mediaName: event.target.value.split("/").pop() || "", mediaType: form.mediaType || "image" })} placeholder={form.category === "Mobile" ? "Use a portrait mobile screenshot URL" : "Use a landscape website screenshot URL"} className="contact-input" /></label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured project</label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Published</label>

              <div className="sm:col-span-2 border border-dashed border-white/20 p-5">
                <label className="flex cursor-pointer items-center gap-3"><UploadCloud size={19} /> Small image upload — maximum 1 MB<input type="file" accept="image/*" onChange={handleSmallImage} className="hidden" /></label>
                <p className="mt-2 text-xs leading-5 text-[#8f8881]">{form.category === "Mobile" ? "Portrait screenshots work best for Mobile cards." : "Landscape screenshots work best for Web cards."} For larger files, paste a hosted URL.</p>
                {form.mediaUrl && <div className={`mt-5 overflow-hidden bg-black/30 ${form.category === "Mobile" ? "mx-auto max-w-[240px] aspect-[9/16]" : "aspect-video"}`}>{form.mediaType === "video" ? <video src={form.mediaUrl} controls muted className="h-full w-full object-contain" /> : <img src={form.mediaUrl} alt="Preview" className="h-full w-full object-contain" />}</div>}
              </div>
            </div>

            <button disabled={saving} className="mt-7 flex items-center gap-2 border-b border-[#ff7a1a] pb-2 text-lg disabled:opacity-50"><Save size={18} /> {saving ? "Saving..." : `Save to ${form.category}`}</button>
          </form>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div><p className="section-kicker">Database content</p><h2 className="mt-2 font-display text-4xl font-semibold tracking-[-.05em]">Current projects</h2></div>
              <span className="text-[#9b948e]">{projects.length} total</span>
            </div>

            <div className="space-y-3">
              {[...projects].sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order).map((project) => (
                <article key={project.id} className="grid gap-4 border border-white/15 p-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                  <div className={`overflow-hidden bg-[#15110d] ${project.category === "Mobile" ? "mx-auto h-[150px] w-[84px]" : "aspect-[4/3] w-full"}`}>{project.mediaUrl ? project.mediaType === "video" ? <video src={project.mediaUrl} muted className="h-full w-full object-contain" /> : <img src={project.mediaUrl} alt="" className="h-full w-full object-contain" /> : <div className="grid h-full place-items-center"><ImageUp size={22} /></div>}</div>
                  <div><p className="section-kicker">{project.category} · {String(project.order).padStart(2, "0")} / {project.type}</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.04em]">{project.title}</h3><p className="mt-2 text-sm text-[#9b948e]">{project.published ? "Published" : "Draft"} · {project.status}</p></div>
                  <div className="flex gap-2"><button onClick={() => edit(project)} className="border border-white/15 p-3" aria-label="Edit"><Plus size={17} /></button><button onClick={() => void deleteProject(project)} className="border border-white/15 p-3" aria-label="Delete"><Trash2 size={17} /></button>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="border border-white/15 p-3"><Eye size={17} /></a>}</div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}