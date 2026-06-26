"use client";

import { usePathname, useRouter } from "next/navigation";
import { isSectionHref, navigateToSection } from "@/lib/hash-navigation";

type SectionAnchorProps = React.ComponentProps<"a"> & {
  href: string;
};

export function SectionAnchor({
  href,
  onClick,
  ...props
}: SectionAnchorProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(event) => {
        if (isSectionHref(href)) {
          event.preventDefault();
          navigateToSection(href, pathname, router);
        }

        onClick?.(event);
      }}
      {...props}
    />
  );
}
