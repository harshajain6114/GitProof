export interface GitHubStats {
  username: string
  totalCommits: number
  totalRepos: number
  totalStars: number
  languages: string[]
  recentActivity: any[]
}

export async function fetchGitHubData(username: string): Promise<GitHubStats> {
  try {
    // Fetch public events
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`)
    const events = await eventsRes.json()

    // Fetch repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    const repos = await reposRes.json()

    // Calculate stats
    const totalCommits = events.filter((e: any) => e.type === "PushEvent").length
    const totalRepos = repos.length
    const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0)

    // ✅ This version works in all strict setups
    const rawLanguages = repos.map((r: any) => r.language).filter(Boolean)
    const languages: string[] = Array.from(new Set(rawLanguages as string[]))

    return {
      username,
      totalCommits,
      totalRepos,
      totalStars,
      languages,
      recentActivity: events.slice(0, 10),
    }
  } catch (error) {
    console.error("GitHub API error:", error)
    throw new Error("Failed to fetch GitHub data")
  }
}
