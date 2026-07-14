import { initialProjects, type Project } from "@/lib/projects";
import { getSql } from "@/lib/neon";

type ProjectRow = {
  id: string;
  slug: string;
  display_order: number;
  category: Project["category"];
  title: string;
  type: string;
  industry: string;
  year: string;
  description: string;
  overview: string;
  role: string;
  highlights: unknown;
  tools: unknown;
  live_url: string | null;
  media_url: string | null;
  media_type: "image" | "video" | null;
  media_name: string | null;
  status: Project["status"];
  featured: boolean;
  published: boolean;
};

let setupPromise: Promise<void> | null = null;

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return [];
    }
  }
  return [];
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    order: Number(row.display_order),
    category: row.category === "Mobile" ? "Mobile" : "Web",
    title: row.title,
    type: row.type,
    industry: row.industry,
    year: row.year,
    description: row.description,
    overview: row.overview,
    role: row.role,
    highlights: stringList(row.highlights),
    tools: stringList(row.tools),
    liveUrl: row.live_url || undefined,
    mediaUrl: row.media_url || undefined,
    mediaType: row.media_type || undefined,
    mediaName: row.media_name || undefined,
    status: row.status,
    featured: Boolean(row.featured),
    published: Boolean(row.published),
  };
}

async function insertProject(project: Project) {
  const sql = getSql();
  await sql`
    INSERT INTO portfolio_projects (
      id, slug, display_order, category, title, type, industry, year,
      description, overview, role, highlights, tools, live_url,
      media_url, media_type, media_name, status, featured, published
    ) VALUES (
      ${project.id}, ${project.slug}, ${project.order}, ${project.category}, ${project.title},
      ${project.type}, ${project.industry}, ${project.year},
      ${project.description}, ${project.overview}, ${project.role},
      ${JSON.stringify(project.highlights)}::jsonb,
      ${JSON.stringify(project.tools)}::jsonb,
      ${project.liveUrl || null}, ${project.mediaUrl || null},
      ${project.mediaType || null}, ${project.mediaName || null},
      ${project.status}, ${project.featured}, ${project.published}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function ensureProjectDatabase() {
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    const sql = getSql();

    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        category TEXT NOT NULL DEFAULT 'Web' CHECK (category IN ('Web', 'Mobile')),
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        industry TEXT NOT NULL DEFAULT '',
        year TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        overview TEXT NOT NULL DEFAULT '',
        role TEXT NOT NULL DEFAULT '',
        highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
        tools JSONB NOT NULL DEFAULT '[]'::jsonb,
        live_url TEXT,
        media_url TEXT,
        media_type TEXT CHECK (media_type IN ('image', 'video')),
        media_name TEXT,
        status TEXT NOT NULL CHECK (status IN ('Live', 'Concept', 'In Progress')),
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        published BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'portfolio_projects' AND column_name = 'category'
        ) THEN
          ALTER TABLE portfolio_projects ADD COLUMN category TEXT NOT NULL DEFAULT 'Web';
          UPDATE portfolio_projects SET category = 'Mobile' WHERE id IN ('certibatch', 'tipid-grocery-list');
        END IF;
      END
      $$
    `;

    const countRows = await sql`SELECT COUNT(*)::int AS count FROM portfolio_projects` as { count: number }[];
    if (Number(countRows[0]?.count || 0) === 0) {
      for (const project of initialProjects) await insertProject(project);
    }
  })().catch((error) => {
    setupPromise = null;
    throw error;
  });

  return setupPromise;
}

export async function getPublishedProjects() {
  await ensureProjectDatabase();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM portfolio_projects
    WHERE published = TRUE
    ORDER BY category ASC, display_order ASC, created_at ASC
  ` as ProjectRow[];
  return rows.map(rowToProject);
}

export async function getAllProjects() {
  await ensureProjectDatabase();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM portfolio_projects
    ORDER BY category ASC, display_order ASC, created_at ASC
  ` as ProjectRow[];
  return rows.map(rowToProject);
}

export async function saveProject(project: Project) {
  await ensureProjectDatabase();
  const sql = getSql();

  await sql`
    INSERT INTO portfolio_projects (
      id, slug, display_order, category, title, type, industry, year,
      description, overview, role, highlights, tools, live_url,
      media_url, media_type, media_name, status, featured, published
    ) VALUES (
      ${project.id}, ${project.slug}, ${project.order}, ${project.category}, ${project.title},
      ${project.type}, ${project.industry}, ${project.year},
      ${project.description}, ${project.overview}, ${project.role},
      ${JSON.stringify(project.highlights)}::jsonb,
      ${JSON.stringify(project.tools)}::jsonb,
      ${project.liveUrl || null}, ${project.mediaUrl || null},
      ${project.mediaType || null}, ${project.mediaName || null},
      ${project.status}, ${project.featured}, ${project.published}
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      display_order = EXCLUDED.display_order,
      category = EXCLUDED.category,
      title = EXCLUDED.title,
      type = EXCLUDED.type,
      industry = EXCLUDED.industry,
      year = EXCLUDED.year,
      description = EXCLUDED.description,
      overview = EXCLUDED.overview,
      role = EXCLUDED.role,
      highlights = EXCLUDED.highlights,
      tools = EXCLUDED.tools,
      live_url = EXCLUDED.live_url,
      media_url = EXCLUDED.media_url,
      media_type = EXCLUDED.media_type,
      media_name = EXCLUDED.media_name,
      status = EXCLUDED.status,
      featured = EXCLUDED.featured,
      published = EXCLUDED.published,
      updated_at = NOW()
  `;

  return project;
}

export async function removeProject(id: string) {
  await ensureProjectDatabase();
  const sql = getSql();
  await sql`DELETE FROM portfolio_projects WHERE id = ${id}`;
}