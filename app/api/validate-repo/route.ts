import { type NextRequest, NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const repo = searchParams.get("repo")

  if (!repo) {
    return NextResponse.json({ success: false, error: "Repository parameter is required" })
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ success: false, error: "GITHUB_TOKEN not configured" })
  }

  try {
    const [owner, repoName] = repo.split("/")

    if (!owner || !repoName) {
      return NextResponse.json({ success: false, error: "Invalid repository format. Expected: owner/repo" })
    }

    // First check if repository exists
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return NextResponse.json({ success: false, error: "Repository not found" })
      } else if (repoResponse.status === 401) {
        return NextResponse.json({ success: false, error: "Invalid token" })
      } else {
        return NextResponse.json({ success: false, error: `HTTP ${repoResponse.status}` })
      }
    }

    // Then check issues
    const issuesResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/issues?per_page=1`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!issuesResponse.ok) {
      return NextResponse.json({ success: false, error: `Cannot access issues: HTTP ${issuesResponse.status}` })
    }

    const issues = await issuesResponse.json()

    return NextResponse.json({
      success: true,
      issueCount: Array.isArray(issues) ? issues.length : 0,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
