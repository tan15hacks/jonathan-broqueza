import { getAllProjects, removeProject, saveProject } from "@/lib/project-db";
import { type Project } from "@/lib/projects";
import { isStudioAuthenticated } from "@/lib/studio-auth";
import { NextResponse } from "next/server";

const allowedStatuses: Project["status"][] = ["Live", "Concept", "In Progress"];

function projectFromBody(value: unknown): Project | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Partial<Project>;

  if (
    !body.id ||
    !body.slug ||
    !body.title ||
    !body.type ||
    !body.description ||
    !body.status ||
    !allowedStatuses.includes(body.status)
  ) {
    return null;
  }

  return {
    id: String(body.id),
    slug: String(body.slug),
    order: Number(body.order || 0),
    title: String(body.title),
    type: String(body.type),
    industry: String(body.industry || ""),
    year: String(body.year || ""),
    description: String(body.description),
    overview: String(body.overview || ""),
    role: String(body.role || ""),
    highlights: Array.isArray(body.highlights) ? body.highlights.map(String).filter(Boolean) : [],
    tools: Array.isArray(body.tools) ? body.tools.map(String).filter(Boolean) : [],
    liveUrl: body.liveUrl ? String(body.liveUrl) : undefined,
    mediaUrl: body.mediaUrl ? String(body.mediaUrl) : undefined,
    mediaType: body.mediaType === "video" ? "video" : body.mediaType === "image" ? "image" : undefined,
    mediaName: body.mediaName ? String(body.mediaName) : undefined,
    status: body.status,
    featured: Boolean(body.featured),
    published: Boolean(body.published),
  };
}

async function unauthorized() {
  return NextResponse.json({ error: "Studio login required." }, { status: 401 });
}

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isStudioAuthenticated())) return unauthorized();

  try {
    return NextResponse.json(await getAllProjects());
  } catch (error) {
    console.error("Unable to load Studio projects", error);
    return NextResponse.json({ error: "Could not connect to Neon." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isStudioAuthenticated())) return unauthorized();

  const project = projectFromBody(await request.json());
  if (!project) {
    return NextResponse.json({ error: "Complete the required project fields." }, { status: 400 });
  }

  try {
    await saveProject(project);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Unable to save Studio project", error);
    return NextResponse.json({ error: "Could not save the project to Neon." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isStudioAuthenticated())) return unauthorized();

  const body = await request.json() as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
  }

  try {
    await removeProject(body.id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Unable to delete Studio project", error);
    return NextResponse.json({ error: "Could not delete the project from Neon." }, { status: 500 });
  }
}
