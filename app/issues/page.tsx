import { getIssuesFromRepos } from "@/lib/github"
import { IssueFilters } from "@/components/IssueFilters"
import { IssuesList } from "@/components/IssuesList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RepositoryStatus } from "@/components/RepositoryStatus"

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

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: any
}) {
  // Await searchParams if it’s a Promise (async dynamic API)
  const resolvedSearchParams =
    typeof searchParams?.then === "function" ? await searchParams : searchParams

  // Convert to URLSearchParams to safely iterate keys and values
  const urlSearchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v))
    } else if (value !== undefined) {
      urlSearchParams.append(key, value)
    }
  }

  const normalizedParams: Record<string, string> = {}

  for (const [key, value] of urlSearchParams.entries()) {
    normalizedParams[key] = value
  }

  const issues = await getIssuesFromRepos(normalizedParams)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">GitHub Issues Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Track and manage issues across your repositories
        </p>
      </div>


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
          <IssuesList issues={issues} />
        </div>
      </div>
    </div>
  )
}
