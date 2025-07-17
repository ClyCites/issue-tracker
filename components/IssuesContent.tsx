// Do NOT put 'use client'
import { getIssuesFromRepos } from "@/lib/github"
import { IssuesList } from "@/components/IssuesList"

interface SearchParams {
  state?: "open" | "closed" | "all"
  repos?: string
  labels?: string
  search?: string
  assignment?: "assigned" | "unassigned" | "all"
}

interface IssuesPageProps {
  searchParams: SearchParams
}

export async function IssuesContent({ searchParams }: IssuesPageProps) {
  const issues = await getIssuesFromRepos({
    state: searchParams.state || "open",
    labels: searchParams.labels?.split(",").filter(Boolean) || [],
    repo: searchParams.repos,
    search: searchParams.search,
    assignment: searchParams.assignment || "all",
  })

  return <IssuesList issues={issues} />
}
