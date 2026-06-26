export const GITHUB_CONTRIBUTION_COLORS = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
} as const;

const GITHUB_LIGHT_TO_DARK: Record<string, string> = {
  ebedf0: "161b22",
  "9be9a8": "0e4429",
  "40c463": "006d32",
  "30a14e": "26a641",
  "216e39": "39d353",
};

export type GitHubThemeMode = "light" | "dark";

export function getGitHubContributionColor(
  apiColor: string | undefined,
  count: number,
  theme: GitHubThemeMode
): string {
  const palette = GITHUB_CONTRIBUTION_COLORS[theme];

  if (apiColor) {
    const normalized = apiColor.replace("#", "").toLowerCase();

    if (theme === "dark" && GITHUB_LIGHT_TO_DARK[normalized]) {
      return `#${GITHUB_LIGHT_TO_DARK[normalized]}`;
    }

    return apiColor.startsWith("#") ? apiColor : `#${apiColor}`;
  }

  if (count <= 0) return palette[0];
  if (count <= 2) return palette[1];
  if (count <= 5) return palette[2];
  if (count <= 9) return palette[3];
  return palette[4];
}
