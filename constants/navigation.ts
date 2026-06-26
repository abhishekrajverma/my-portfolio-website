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

const BLOG_ONLY_LINK_LABELS = new Set(["Articles"]);

export function isBlogRoute(pathname: string): boolean {
  return pathname.startsWith("/blog");
}

export function getSectionLinks(section: NavSection): NavLink[] {
  if (section.href) {
    return [{ href: section.href, label: section.title }];
  }

  return section.links ?? [];
}

export const navSections: NavSection[] = [
  {
    id: "home",
    title: "Home",
    description: "Back to the top",
    href: "/#hero",
  },
  {
    id: "about",
    title: "About",
    description: "Background & experience",
    href: "/#about",
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
    id: "skills",
    title: "Skills",
    description: "Tools & technologies",
    href: "/#skills",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Reach out anytime",
    href: "/#contact",
  },
  {
    id: "blog",
    title: "Blog",
    description: "Articles & writing studio",
    links: [
      { href: "/blog", label: "Articles" },
      { href: "/blog", label: "All Stories" },
      { href: "/admin/blog", label: "Blog Studio" },
    ],
  },
];

export function getNavSections(pathname: string): NavSection[] {
  const showArticles = isBlogRoute(pathname);

  return navSections.map((section) => {
    if (section.id !== "blog" || !section.links) return section;

    return {
      ...section,
      links: section.links.filter(
        (link) => showArticles || !BLOG_ONLY_LINK_LABELS.has(link.label)
      ),
    };
  });
}

export const navLinks: NavLink[] = navSections.flatMap(getSectionLinks);

export function getNavLinks(pathname: string): NavLink[] {
  return getNavSections(pathname).flatMap(getSectionLinks);
}

export const commandMenuLinks = [
  ...navLinks,
  { href: "/projects", label: "All Projects" },
];

export function getCommandMenuLinks(pathname: string): NavLink[] {
  return [
    ...getNavLinks(pathname),
    { href: "/projects", label: "All Projects" },
  ];
}
