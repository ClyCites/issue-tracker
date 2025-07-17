import { Suspense } from "react"
import { getIssuesFromRepos } from "@/lib/github"
import { IssueFilters } from "@/components/IssueFilters"
import { IssuesList } from "@/components/IssuesList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RepositoryStatus } from "@/components/RepositoryStatus"

interface SearchParams {
  state?: "open" | "closed" | "all"
  repo?: string
  labels?: string
}

interface IssuesPageProps {
  searchParams: SearchParams
}

function IssuesLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
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

async function IssuesContent({ searchParams }: IssuesPageProps) {
  const issues = await getIssuesFromRepos({
    state: searchParams.state || "open",
    labels: searchParams.labels?.split(",").filter(Boolean) || [],
    repo: searchParams.repo,
  })

  return <IssuesList issues={issues} />
}

export default function IssuesPage({ searchParams }: IssuesPageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">GitHub Issues Dashboard</h1>
        <p className="text-muted-foreground text-lg">Track and manage issues across your repositories</p>
      </div>

      {/* <RepositoryStatus /> */}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter issues by state, repository, and labels</CardDescription>
            </CardHeader>
            <CardContent>
              <IssueFilters />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<IssuesLoading />}>
            <IssuesContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
