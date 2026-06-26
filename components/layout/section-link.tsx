"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isSectionHref, navigateToSection } from "@/lib/hash-navigation";

type SectionLinkProps = React.ComponentProps<typeof Link>;

export function SectionLink({ href, onClick, ...props }: SectionLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hrefString = typeof href === "string" ? href : href.pathname ?? "";

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (isSectionHref(hrefString)) {
          event.preventDefault();
          navigateToSection(hrefString, pathname, router);
        }

        onClick?.(event);
      }}
      {...props}
    />
  );
}
