import { createStudioSession, isStudioAuthenticated, passwordsMatch, studioCookie } from "@/lib/studio-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ authenticated: await isStudioAuthenticated() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { password?: string };

    if (!body.password || !passwordsMatch(body.password)) {
      return NextResponse.json({ error: "Incorrect Studio password." }, { status: 401 });
    }

    const session = createStudioSession();
    const cookieStore = await cookies();

    cookieStore.set(studioCookie.name, session.value, {
      ...studioCookie.options,
      maxAge: session.maxAge,
    });

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Unable to create Studio session", error);
    return NextResponse.json({ error: "Studio authentication is not configured." }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(studioCookie.name, "", {
    ...studioCookie.options,
    maxAge: 0,
  });

  return NextResponse.json({ authenticated: false });
}
