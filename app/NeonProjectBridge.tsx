"use client";

import { initialProjects, type Project } from "@/lib/projects";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function stableProjects(projects: Project[]) {
  return JSON.stringify([...projects].sort((a, b) => a.order - b.order));
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
          const reloadKey = `jb_neon_reload:${nextValue.length}:${projects.map((project) => project.id).join("|")}`;

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
