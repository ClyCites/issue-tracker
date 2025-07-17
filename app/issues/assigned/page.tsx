import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"
import { getIssuesFromRepos } from "@/lib/github"
import { IssuesList } from "@/components/IssuesList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { User, GitBranch, Clock } from "lucide-react"

// Updated SearchParams interface to correctly handle string | string[]
interface SearchParams {
  state?: "open" | "closed" | "all" | string | string[]
  repo?: string | string[]
  labels?: string | string[]
  search?: string | string[]
  assignment?: "assigned" | "unassigned" | "all" | string | string[]
}

interface AssignedIssuesPageProps {
  searchParams: SearchParams
}

function AssignedIssuesLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function AssignedIssuesContent({ searchParams, username }: AssignedIssuesPageProps & { username: string }) {
  const allIssues = await getIssuesFromRepos(searchParams)

  const assignedIssues = allIssues.filter((issue) => issue.assignee?.login === username)

  const openCount = assignedIssues.filter((issue) => issue.state === "open").length
  const repoCount = new Set(assignedIssues.map((i) => i.repository?.full_name)).size

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedIssues.length}</div>
            <p className="text-xs text-muted-foreground">Issues assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCount}</div>
            <p className="text-xs text-muted-foreground">Currently open</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repositories</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repoCount}</div>
            <p className="text-xs text-muted-foreground">Across repositories</p>
          </CardContent>
        </Card>
      </div>

      <IssuesList issues={assignedIssues} />
    </div>
  )
}

export default async function AssignedIssuesPage({ searchParams }: AssignedIssuesPageProps) {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const username = (session.user as any)?.username

  if (!username) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold tracking-tight">My Assigned Issues</h1>
          <Badge variant="secondary" className="text-sm">
            @{username}
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">Issues assigned to you across all repositories</p>
      </div>

      <Suspense fallback={<AssignedIssuesLoading />}>
        <AssignedIssuesContent searchParams={searchParams} username={username} />
      </Suspense>
    </div>
  )
}
