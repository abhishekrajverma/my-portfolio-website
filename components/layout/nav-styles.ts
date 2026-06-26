export const desktopNavItemClass =
  "hidden items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground lg:inline-flex xl:px-3 xl:text-sm";

export function desktopNavItemStateClass(active: boolean) {
  return active
    ? "bg-muted/60 text-foreground"
    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground";
}
