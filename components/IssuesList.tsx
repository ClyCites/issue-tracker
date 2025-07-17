import { IssueCard } from "./IssueCard"
import { Card, CardContent } from "@/components/ui/card"
import { FileX } from "lucide-react"

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

interface IssuesListProps {
  issues: GitHubIssue[]
}

export function IssuesList({ issues }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileX className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No issues found</h3>
          <p className="text-muted-foreground text-center">
            Try adjusting your filters or check back later for new issues.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Issues ({issues.length})</h2>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  )
}
