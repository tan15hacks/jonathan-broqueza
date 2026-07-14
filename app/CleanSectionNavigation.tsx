"use client";

import { useEffect } from "react";

const sectionIds = ["start", "work", "services", "about", "contact"] as const;
type SectionId = (typeof sectionIds)[number];

function isSectionId(value: string): value is SectionId {
  return sectionIds.includes(value as SectionId);
}

function sectionPath(section: SectionId) {
  return section === "start" ? "/" : `/${section}`;
}

function sectionFromPath(pathname: string): SectionId | null {
  if (pathname === "/") return "start";

  const segment = pathname.replace(/^\/+|\/+$/g, "");
  return isSectionId(segment) ? segment : null;
}

export default function CleanSectionNavigation() {
  useEffect(() => {
    const scrollToSection = (section: SectionId, behavior: ScrollBehavior) => {
      const target = document.getElementById(section);
      if (!target) return;

      target.scrollIntoView({ behavior, block: "start" });
    };

    const updateSectionLinks = () => {
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
        const section = decodeURIComponent(anchor.getAttribute("href")?.slice(1) || "");
        if (!isSectionId(section)) return;

        anchor.dataset.sectionTarget = section;
        anchor.setAttribute("href", sectionPath(section));
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[data-section-target]");
      if (!anchor) return;

      const section = anchor.dataset.sectionTarget || "";
      if (!isSectionId(section)) return;

      event.preventDefault();

      const nextPath = sectionPath(section);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ section }, "", nextPath);
      }

      scrollToSection(section, "smooth");
    };

    const handlePopState = () => {
      const section = sectionFromPath(window.location.pathname);
      if (section) scrollToSection(section, "smooth");
    };

    updateSectionLinks();

    const legacyHash = decodeURIComponent(window.location.hash.slice(1));
    const initialSection = isSectionId(legacyHash)
      ? legacyHash
      : sectionFromPath(window.location.pathname);

    if (initialSection) {
      if (window.location.hash) {
        window.history.replaceState(
          { section: initialSection },
          "",
          sectionPath(initialSection),
        );
      }

      window.requestAnimationFrame(() => {
        window.setTimeout(
          () => scrollToSection(initialSection, initialSection === "start" ? "auto" : "smooth"),
          80,
        );
      });
    }

    const observer = new MutationObserver(updateSectionLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
