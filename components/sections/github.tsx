import { githubProfile } from "@/data/github-profile";
import { fetchGitHubProfileData } from "@/lib/github/stats";
import { GitHubSectionClient } from "@/components/sections/github-section-client";

export async function GitHubSection() {
  const githubData = await fetchGitHubProfileData(githubProfile.username);

  return <GitHubSectionClient githubData={githubData} />;
}
