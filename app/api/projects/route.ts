import { getPublishedProjects } from "@/lib/project-db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getPublishedProjects();

    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Unable to load Neon projects", error);
    return NextResponse.json({ error: "Projects are temporarily unavailable." }, { status: 503 });
  }
}
