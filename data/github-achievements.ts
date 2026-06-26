export type GitHubEarnedAchievement = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export const githubEarnedAchievements: GitHubEarnedAchievement[] = [
  {
    id: "yolo",
    name: "YOLO",
    description: "Merged a pull request without code review.",
    imageUrl:
      "https://github.githubassets.com/images/modules/profile/achievements/yolo-default.png",
  },
  {
    id: "pull-shark",
    name: "Pull Shark",
    description: "Opened pull requests that have been merged.",
    imageUrl:
      "https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png",
  },
  {
    id: "quickdraw",
    name: "Quickdraw",
    description: "Closed an issue or pull request within 5 minutes of opening.",
    imageUrl:
      "https://github.githubassets.com/images/modules/profile/achievements/quickdraw-default.png",
  },
];
