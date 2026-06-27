export const desktopNavItemClass =
  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground xl:px-3 xl:text-sm";

export function desktopNavItemStateClass(active: boolean) {
  return active
    ? "bg-muted/60 text-foreground"
    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground";
}
