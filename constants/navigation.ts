export type NavLink = {
  href: string;
  label: string;
};

export type NavSection = {
  id: string;
  title: string;
  description: string;
  href?: string;
  links?: NavLink[];
};

export function getSectionLinks(section: NavSection): NavLink[] {
  if (section.href) {
    return [{ href: section.href, label: section.title }];
  }

  return section.links ?? [];
}

/** Order matches homepage scroll order in `app/page.tsx`. */
export const navSections: NavSection[] = [
  {
    id: "about",
    title: "About",
    description: "Background & experience",
    href: "/#about",
  },
  {
    id: "skills",
    title: "Skills",
    description: "Tools & technologies",
    href: "/#skills",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Case studies & builds",
    href: "/#projects",
  },
  {
    id: "certifications",
    title: "Certifications",
    description: "Credentials & awards",
    href: "/#certifications",
  },
  {
    id: "github",
    title: "GitHub",
    description: "Stats & contributions",
    href: "/#github",
  },
  {
    id: "blog",
    title: "Blog",
    description: "Articles & tutorials",
    href: "/blog",
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "Peer feedback",
    href: "/#testimonials",
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Common questions",
    href: "/#faq",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Reach out anytime",
    href: "/#contact",
  },
];

/** Shown directly in the desktop/laptop nav bar. */
export const PRIMARY_NAV_IDS = [
  "about",
  "skills",
  "projects",
  "blog",
  "contact",
] as const;

export function getNavSections(pathname: string): NavSection[] {
  void pathname;
  return navSections;
}

export function getPrimaryNavSections(pathname: string): NavSection[] {
  const primary = new Set<string>(PRIMARY_NAV_IDS);
  return getNavSections(pathname).filter((section) => primary.has(section.id));
}

export function getSecondaryNavSections(pathname: string): NavSection[] {
  const primary = new Set<string>(PRIMARY_NAV_IDS);
  return getNavSections(pathname).filter((section) => !primary.has(section.id));
}

export const navLinks: NavLink[] = navSections.flatMap(getSectionLinks);

export function getNavLinks(pathname: string): NavLink[] {
  return getNavSections(pathname).flatMap(getSectionLinks);
}

export function getCommandMenuLinks(pathname: string): NavLink[] {
  return [
    ...getNavLinks(pathname),
    { href: "/projects", label: "All Projects" },
  ];
}
