"use client";

import { initialProjects, type Project } from "@/lib/projects";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function stableProjects(projects: Project[]) {
  return JSON.stringify([...projects].sort((a, b) => a.order - b.order));
}

function contentHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export default function NeonProjectBridge() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/studio")) return;

    let cancelled = false;

    async function syncProjects() {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) return;

        const projects = await response.json() as Project[];
        if (cancelled || !Array.isArray(projects)) return;

        const stored = window.localStorage.getItem("jb_projects");
        let current = initialProjects;

        if (stored) {
          try {
            current = JSON.parse(stored) as Project[];
          } catch {
            current = initialProjects;
          }
        }

        const nextValue = stableProjects(projects);
        const currentValue = stableProjects(current);
        window.localStorage.setItem("jb_projects", nextValue);

        if (pathname === "/" && currentValue !== nextValue) {
          const reloadKey = `jb_neon_reload:${contentHash(nextValue)}`;

          if (window.sessionStorage.getItem("jb_neon_reload") !== reloadKey) {
            window.sessionStorage.setItem("jb_neon_reload", reloadKey);
            window.location.reload();
          }
        }
      } catch {
        // Keep the built-in project list available if Neon is temporarily unreachable.
      }
    }

    void syncProjects();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
