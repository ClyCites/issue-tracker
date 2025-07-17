"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface RepoStatus {
  name: string
  status: "loading" | "success" | "error"
  error?: string
  issueCount?: number
}

export function RepositoryStatus() {
  const [repoStatuses, setRepoStatuses] = useState<RepoStatus[]>([])

  useEffect(() => {
    const checkRepositories = async () => {
      const repos = process.env.NEXT_PUBLIC_GITHUB_REPOS?.split(",") || []

      setRepoStatuses(repos.map((repo) => ({ name: repo, status: "loading" })))

      for (const repo of repos) {
        try {
          const response = await fetch(`/api/validate-repo?repo=${encodeURIComponent(repo)}`)
          const data = await response.json()

          setRepoStatuses((prev) =>
            prev.map((r) =>
              r.name === repo
                ? {
                    name: repo,
                    status: data.success ? "success" : "error",
                    error: data.error,
                    issueCount: data.issueCount,
                  }
                : r,
            ),
          )
        } catch (error) {
          setRepoStatuses((prev) =>
            prev.map((r) =>
              r.name === repo ? { name: repo, status: "error", error: "Failed to validate repository" } : r,
            ),
          )
        }
      }
    }

    checkRepositories()
  }, [])

  if (repoStatuses.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Repository Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {repoStatuses.map((repo) => (
            <div key={repo.name} className="flex items-center justify-between p-2 rounded border">
              <span className="font-mono text-sm">{repo.name}</span>
              <div className="flex items-center gap-2">
                {repo.status === "loading" && <Badge variant="secondary">Loading...</Badge>}
                {repo.status === "success" && (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {repo.issueCount} issues
                    </Badge>
                  </>
                )}
                {repo.status === "error" && (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error: {repo.error}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
