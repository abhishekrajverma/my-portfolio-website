import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function isSectionHref(href: string): boolean {
  return href.startsWith("/#");
}

export function getSectionId(href: string): string {
  return href.slice(1);
}

export function getCleanSectionHref(pathname: string, sectionId: string): string {
  if (pathname === "/" && sectionId === "hero") {
    return "/";
  }

  return `/#${sectionId}`;
}

export function sanitizeLocationHash(): string | null {
  const { pathname, hash } = window.location;
  if (!hash) return null;

  const sectionIds = hash.split("#").filter(Boolean);
  if (sectionIds.length === 0) return null;

  const sectionId = sectionIds[sectionIds.length - 1];
  const cleanHash = `#${sectionId}`;
  const cleanHref = getCleanSectionHref(pathname, sectionId);

  if (hash !== cleanHash) {
    window.history.replaceState(null, "", cleanHref);
  }

  return cleanHash;
}

export function scrollToSection(
  sectionId: string,
  behavior: ScrollBehavior = "smooth"
) {
  const element = document.querySelector(sectionId);
  element?.scrollIntoView({ behavior });
}

export function navigateToSection(
  href: string,
  pathname: string,
  router: AppRouterInstance
) {
  if (!isSectionHref(href)) {
    router.push(href);
    return;
  }

  const sectionId = getSectionId(href);

  if (pathname === "/") {
    scrollToSection(sectionId);
    window.history.replaceState(null, "", href);
    return;
  }

  router.push(href);
}
