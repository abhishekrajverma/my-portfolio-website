export type GitHubUserStats = {
  username: string;
  name: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalCommits: number;
};

export type GitHubCommitActivity = {
  id: string;
  repo: string;
  message: string;
  date: string;
  url: string;
};

export type GitHubYearlyCommits = {
  year: number;
  commits: number;
};

export const GITHUB_DATA_REVALIDATE_SECONDS = 3600;
export const RECENT_COMMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export type GitHubProfileData = {
  stats: GitHubUserStats | null;
  recentCommits: GitHubCommitActivity[];
  yearlyCommits: GitHubYearlyCommits[];
  totalCommits: number;
  contributionChartUrl: string;
  fetchedAt: string;
  cacheRevalidateSeconds: number;
};

type GitHubUserResponse = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

type GitHubRepoResponse = {
  stargazers_count: number;
};

type GitHubPushPayload = {
  head?: string;
  commits?: Array<{
    sha: string;
    message: string;
  }>;
};

type GitHubEventResponse = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: GitHubPushPayload;
};

type GitHubCommitResponse = {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
  author?: { login: string } | null;
};

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "abhishekrajverma-portfolio",
};

function getGitHubHeaders(): HeadersInit {
  const headers: Record<string, string> = { ...GITHUB_HEADERS };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getFetchOptions(): RequestInit {
  return {
    next: { revalidate: GITHUB_DATA_REVALIDATE_SECONDS },
    headers: getGitHubHeaders(),
  };
}

export async function fetchGitHubUserStats(
  username: string
): Promise<GitHubUserStats | null> {
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`, getFetchOptions());

    if (!userResponse.ok) return null;

    const user = (await userResponse.json()) as GitHubUserResponse;

    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      getFetchOptions()
    );

    let totalStars = 0;

    if (reposResponse.ok) {
      const repos = (await reposResponse.json()) as GitHubRepoResponse[];
      totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
    }

    return {
      username: user.login,
      name: user.name,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalCommits: 0,
    };
  } catch {
    return null;
  }
}

function isWithinRecentCommitWindow(date: string): boolean {
  const commitTime = new Date(date).getTime();
  if (Number.isNaN(commitTime)) return false;

  return Date.now() - commitTime <= RECENT_COMMIT_WINDOW_MS;
}

function getRecentCommitSinceIso(): string {
  return new Date(Date.now() - RECENT_COMMIT_WINDOW_MS).toISOString();
}

function normalizeCommitMessage(message: string): string | null {
  const normalized = message.split("\n")[0]?.trim();
  if (!normalized || normalized.toLowerCase().startsWith("merge ")) {
    return null;
  }

  return normalized;
}

function buildCommitActivity(
  username: string,
  repoFullName: string,
  sha: string,
  message: string,
  date: string
): GitHubCommitActivity {
  return {
    id: `${sha}-${repoFullName}`,
    repo: repoFullName.replace(`${username}/`, ""),
    message,
    date,
    url: `https://github.com/${repoFullName}/commit/${sha}`,
  };
}

async function fetchCommitDetails(
  repoFullName: string,
  sha: string
): Promise<GitHubCommitResponse | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits/${sha}`,
      getFetchOptions()
    );

    if (!response.ok) return null;

    return (await response.json()) as GitHubCommitResponse;
  } catch {
    return null;
  }
}

async function resolvePushEventCommit(
  username: string,
  event: GitHubEventResponse
): Promise<GitHubCommitActivity | null> {
  const repoFullName = event.repo.name;
  const { payload } = event;

  if (payload.commits?.length) {
    for (const commit of payload.commits) {
      const message = normalizeCommitMessage(commit.message);
      if (!message) continue;

      return buildCommitActivity(
        username,
        repoFullName,
        commit.sha,
        message,
        event.created_at
      );
    }
  }

  if (!payload.head) return null;

  const commitDetails = await fetchCommitDetails(repoFullName, payload.head);
  if (!commitDetails) return null;

  if (
    commitDetails.author?.login &&
    commitDetails.author.login.toLowerCase() !== username.toLowerCase()
  ) {
    return null;
  }

  const message = normalizeCommitMessage(commitDetails.commit.message);
  if (!message) return null;

  const commitDate = commitDetails.commit.author.date;

  return buildCommitActivity(
    username,
    repoFullName,
    commitDetails.sha,
    message,
    commitDate
  );
}

async function fetchRecentCommitsFromRepos(
  username: string,
  limit: number
): Promise<GitHubCommitActivity[]> {
  try {
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=10&sort=pushed`,
      getFetchOptions()
    );

    if (!reposResponse.ok) return [];

    const repos = (await reposResponse.json()) as Array<{ name: string }>;
    const commits: GitHubCommitActivity[] = [];
    const seen = new Set<string>();

    const since = getRecentCommitSinceIso();

    for (const repo of repos) {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&since=${encodeURIComponent(since)}&per_page=10`,
        getFetchOptions()
      );

      if (!response.ok) continue;

      const repoCommits = (await response.json()) as GitHubCommitResponse[];

      for (const commit of repoCommits) {
        const message = normalizeCommitMessage(commit.commit.message);
        if (!message) continue;

        const activity = buildCommitActivity(
          username,
          `${username}/${repo.name}`,
          commit.sha,
          message,
          commit.commit.author.date
        );

        if (!isWithinRecentCommitWindow(activity.date)) continue;

        if (seen.has(activity.id)) continue;
        seen.add(activity.id);
        commits.push(activity);
      }
    }

    return commits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function fetchRecentCommits(
  username: string,
  limit = 8
): Promise<GitHubCommitActivity[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      getFetchOptions()
    );

    if (!response.ok) return [];

    const events = (await response.json()) as GitHubEventResponse[];
    const commits: GitHubCommitActivity[] = [];
    const seen = new Set<string>();

    for (const event of events) {
      if (event.type !== "PushEvent") continue;

      if (!isWithinRecentCommitWindow(event.created_at)) break;

      const commit = await resolvePushEventCommit(username, event);
      if (!commit || seen.has(commit.id) || !isWithinRecentCommitWindow(commit.date)) {
        continue;
      }

      seen.add(commit.id);
      commits.push(commit);

      if (commits.length >= limit) return commits;
    }

    if (commits.length > 0) return commits;

    return fetchRecentCommitsFromRepos(username, limit);
  } catch {
    return [];
  }
}


const ACCOUNT_START_YEAR = 2019;

async function fetchYearCommitsGraphQL(username: string, year: number): Promise<number> {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) return 0;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      next: { revalidate: GITHUB_DATA_REVALIDATE_SECONDS },
      headers: {
        ...(getGitHubHeaders() as Record<string, string>),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                totalCommitContributions
              }
            }
          }
        `,
        variables: {
          login: username,
          from: `${year}-01-01T00:00:00Z`,
          to: `${year}-12-31T23:59:59Z`,
        },
      }),
    });

    if (!response.ok) return 0;

    const data = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            totalCommitContributions?: number;
          };
        };
      };
    };

    return data.data?.user?.contributionsCollection?.totalCommitContributions ?? 0;
  } catch {
    return 0;
  }
}

export async function fetchYearWiseCommits(username: string): Promise<GitHubYearlyCommits[]> {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - ACCOUNT_START_YEAR + 1 },
    (_, index) => ACCOUNT_START_YEAR + index
  );

  const yearlyCommits: GitHubYearlyCommits[] = [];

  for (const year of years) {
    try {
      const query = `author:${username} committer-date:${year}-01-01..${year}-12-31`;
      const response = await fetch(
        `https://api.github.com/search/commits?q=${encodeURIComponent(query)}&per_page=1`,
        getFetchOptions()
      );

      if (!response.ok) {
        const fallback = await fetchYearCommitsGraphQL(username, year);
        if (fallback > 0) {
          yearlyCommits.push({ year, commits: fallback });
        }
        continue;
      }

      const data = (await response.json()) as { total_count?: number };
      const commits = data.total_count ?? 0;

      if (commits > 0) {
        yearlyCommits.push({ year, commits });
      }
    } catch {
      continue;
    }
  }

  return yearlyCommits.sort((a, b) => b.year - a.year);
}

export async function fetchGitHubProfileData(username: string): Promise<GitHubProfileData> {
  const yearlyCommits = await fetchYearWiseCommits(username);
  const totalCommits = yearlyCommits.reduce((sum, entry) => sum + entry.commits, 0);

  const [stats, recentCommits] = await Promise.all([
    fetchGitHubUserStats(username),
    fetchRecentCommits(username),
  ]);

  return {
    stats: stats ? { ...stats, totalCommits } : null,
    recentCommits,
    yearlyCommits,
    totalCommits,
    contributionChartUrl: `https://ghchart.rshah.org/${username}?color=6366f1&font=Inter`,
    fetchedAt: new Date().toISOString(),
    cacheRevalidateSeconds: GITHUB_DATA_REVALIDATE_SECONDS,
  };
}
