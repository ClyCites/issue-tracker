'use server'
interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string
  state: "open" | "closed"
  html_url: string
  created_at: string
  updated_at: string
  labels: Array<{
    id: number
    name: string
    color: string
    description: string | null
  }>
  assignee: {
    login: string
    avatar_url: string
    html_url: string
  } | null
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
  repository?: {
    name: string
    full_name: string
    html_url: string
  }
}

interface IssueFilters {
  state?: "open" | "closed" | "all"
  labels?: string[]
  repo?: string
  search?: string
  assignment?: "assigned" | "unassigned" | "all"
}

interface SearchParams {
  state?: string
  labels?: string
  repos?: string
  search?: string
  assignment?: string
}

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN
const GITHUB_REPOS = process.env.NEXT_PUBLIC_GITHUB_REPOS?.split(",") || []

if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN environment variable is required")
}

if (GITHUB_REPOS.length === 0) {
  throw new Error("GITHUB_REPOS environment variable is required")
}

async function fetchGitHubAPI(url: string): Promise<any> {
  const response = await fetch(`https://api.github.com${url}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unable to read error response")

    if (response.status === 404) {
      throw new Error(
        `Repository not found or not accessible. Check if the repository exists and your token has access to it. URL: ${url}`,
      )
    } else if (response.status === 401) {
      throw new Error(`Authentication failed. Check if your GITHUB_TOKEN is valid and has the required permissions.`)
    } else if (response.status === 403) {
      throw new Error(
        `Access forbidden. Your token may not have permission to access this repository or you've hit rate limits.`,
      )
    } else {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}. Response: ${errorBody}`)
    }
  }

  return response.json()
}

export async function getRepositories(): Promise<string[]> {
  return GITHUB_REPOS
}

export async function getIssuesFromRepo(repoFullName: string, filters: IssueFilters = {}): Promise<GitHubIssue[]> {
  try {
    const [owner, repo] = repoFullName.split("/")

    if (!owner || !repo) {
      console.error(`Invalid repository format: ${repoFullName}. Expected format: owner/repo`)
      return []
    }

    const params = new URLSearchParams({
      state: filters.state === "all" ? "all" : filters.state || "open",
      per_page: "100",
      sort: "updated",
      direction: "desc",
    })

    if (filters.labels && filters.labels.length > 0) {
      params.append("labels", filters.labels.join(","))
    }

    const issues = await fetchGitHubAPI(`/repos/${owner}/${repo}/issues?${params}`)

    // Filter out pull requests (GitHub API includes PRs in issues endpoint)
    const filteredIssues = issues.filter((issue: any) => !issue.pull_request)

    // Add repository information to each issue
    return filteredIssues.map((issue: any) => ({
      ...issue,
      repository: {
        name: repo,
        full_name: repoFullName,
        html_url: `https://github.com/${repoFullName}`,
      },
    }))
  } catch (error) {
    console.error(`Error fetching issues from ${repoFullName}:`, error)
    return []
  }
}

// Refactored to accept the raw searchParams object
export async function getIssuesFromRepos(rawSearchParams: SearchParams): Promise<GitHubIssue[]> {
  // Parse searchParams here, centralizing the logic
  const state = rawSearchParams.state || "open"
  const labels = rawSearchParams.labels?.split(",").filter(Boolean) || []
  const repos = rawSearchParams.repos?.split(",").filter(Boolean) || GITHUB_REPOS
  const search = rawSearchParams.search
  const assignment = rawSearchParams.assignment || "all"

  // Validate repositories format
  const validRepos = repos.filter((repo) => {
    const parts = repo.split("/")
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      console.error(`Invalid repository format: ${repo}. Expected format: owner/repo`)
      return false
    }
    return true
  })

  if (validRepos.length === 0) {
    console.error("No valid repositories found")
    return []
  }

  const issuesPromises = validRepos.map((repo) =>
    getIssuesFromRepo(repo, {
      state,
      labels,
    }),
  )
  const issuesArrays = await Promise.allSettled(issuesPromises)

  // Extract successful results and log failures
  const allIssues: GitHubIssue[] = []
  issuesArrays.forEach((result, index) => {
    if (result.status === "fulfilled") {
      allIssues.push(...result.value)
    } else {
      console.error(`Failed to fetch issues from ${validRepos[index]}:`, result.reason)
    }
  })

  // Sort by updated_at
  let filteredIssues = allIssues.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  // Client-side filtering for search (if not handled by GitHub API directly)
  if (search) {
    const searchTerm = search.toLowerCase()
    filteredIssues = filteredIssues.filter((issue) => {
      const titleMatch = issue.title.toLowerCase().includes(searchTerm)
      const labelMatch = issue.labels.some((label) => label.name.toLowerCase().includes(searchTerm))
      const assigneeMatch = issue.assignee?.login.toLowerCase().includes(searchTerm)
      const userMatch = issue.user.login.toLowerCase().includes(searchTerm)

      return titleMatch || labelMatch || assigneeMatch || userMatch
    })
  }

  // Client-side filtering for assignment
  if (assignment && assignment !== "all") {
    if (assignment === "assigned") {
      filteredIssues = filteredIssues.filter((issue) => issue.assignee !== null)
    } else if (assignment === "unassigned") {
      filteredIssues = filteredIssues.filter((issue) => issue.assignee === null)
    }
  }

  return filteredIssues
}

export async function getLabelsFromRepos(): Promise<Array<{ name: string; color: string }>> {
  const labelsPromises = GITHUB_REPOS.map(async (repoFullName) => {
    const [owner, repo] = repoFullName.split("/")
    try {
      const labels = await fetchGitHubAPI(`/repos/${owner}/${repo}/labels`)
      return labels.map((label: any) => ({
        name: label.name,
        color: label.color,
      }))
    } catch (error) {
      console.error(`Error fetching labels for ${repoFullName}:`, error)
      return []
    }
  })

  const labelsArrays = await Promise.all(labelsPromises)
  const allLabels = labelsArrays.flat()

  // Remove duplicates based on label name
  const uniqueLabels = allLabels.filter((label, index, self) => index === self.findIndex((l) => l.name === label.name))

  return uniqueLabels.sort((a, b) => a.name.localeCompare(b.name))
}
