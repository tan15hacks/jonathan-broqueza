import { getAllProjects, removeProject, saveProject } from "@/lib/project-db";
import { type Project } from "@/lib/projects";
import { isStudioAuthenticated } from "@/lib/studio-auth";
import { NextResponse } from "next/server";

const allowedStatuses: Project["status"][] = ["Live", "Concept", "In Progress"];
const allowedCategories: Project["category"][] = ["Web", "Mobile"];

type DatabaseError = Error & {
  code?: string;
  constraint?: string;
};

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
    !body.category ||
    !allowedStatuses.includes(body.status) ||
    !allowedCategories.includes(body.category)
  ) {
    return null;
  }

  return {
    id: String(body.id),
    slug: String(body.slug),
    order: Number(body.order || 0),
    category: body.category,
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

function databaseError(error: unknown, action: "load" | "save" | "delete") {
  const value = error as DatabaseError;
  const message = value?.message || "";

  if (message.includes("DATABASE_URL is not configured")) {
    return NextResponse.json(
      {
        error: "DATABASE_URL is missing. Add your Neon pooled connection string to this Vercel project's Environment Variables, then redeploy.",
        code: "DATABASE_URL_MISSING",
      },
      { status: 503 },
    );
  }

  if (value?.code === "23505") {
    const duplicateField = value.constraint?.includes("slug") ? "slug" : "project ID";
    return NextResponse.json(
      {
        error: `That ${duplicateField} is already being used. Change the project slug and save again.`,
        code: "PROJECT_DUPLICATE",
      },
      { status: 409 },
    );
  }

  if (
    /password authentication failed|connection string|invalid url|fetch failed|connect|ENOTFOUND|ECONNREFUSED|timeout/i.test(message)
  ) {
    return NextResponse.json(
      {
        error: "Neon rejected the database connection. Copy a fresh pooled connection string into DATABASE_URL, then redeploy the site.",
        code: "DATABASE_CONNECTION_FAILED",
      },
      { status: 503 },
    );
  }

  const labels = {
    load: "load projects from",
    save: "save the project to",
    delete: "delete the project from",
  } as const;

  return NextResponse.json(
    {
      error: `Could not ${labels[action]} Neon. Check the Vercel function logs for the exact database error.`,
      code: "DATABASE_OPERATION_FAILED",
    },
    { status: 500 },
  );
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
    return databaseError(error, "load");
  }
}

export async function POST(request: Request) {
  if (!(await isStudioAuthenticated())) return unauthorized();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The project request could not be read. Try a smaller image or use a hosted media URL." },
      { status: 400 },
    );
  }

  const project = projectFromBody(body);
  if (!project) {
    return NextResponse.json(
      { error: "Complete the required project fields, including Web or Mobile category." },
      { status: 400 },
    );
  }

  try {
    await saveProject(project);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Unable to save Studio project", error);
    return databaseError(error, "save");
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
    return databaseError(error, "delete");
  }
}
