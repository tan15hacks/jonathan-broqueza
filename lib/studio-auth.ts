import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "jb_studio_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.STUDIO_PASSWORD;

  if (!secret) {
    throw new Error("STUDIO_PASSWORD is not configured.");
  }

  return secret;
}

function sign(expiresAt: number) {
  return createHmac("sha256", getSecret())
    .update(`jonathan-studio:${expiresAt}`)
    .digest("hex");
}

export function passwordsMatch(value: string) {
  const expected = Buffer.from(getSecret());
  const supplied = Buffer.from(value);

  if (expected.length !== supplied.length) return false;
  return timingSafeEqual(expected, supplied);
}

export function createStudioSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return {
    value: `${expiresAt}.${sign(expiresAt)}`,
    maxAge: SESSION_SECONDS,
  };
}

export async function isStudioAuthenticated() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const [expiresValue, signature] = raw.split(".");
  const expiresAt = Number(expiresValue);

  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000) || !signature) {
    return false;
  }

  const expected = Buffer.from(sign(expiresAt));
  const supplied = Buffer.from(signature);

  if (expected.length !== supplied.length) return false;
  return timingSafeEqual(expected, supplied);
}

export const studioCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
};
