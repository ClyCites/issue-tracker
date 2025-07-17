import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExternalLink, GitBranch, Clock, User } from "lucide-react"
import Link from "next/link"

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

interface IssueCardProps {
  issue: GitHubIssue
}

export function IssueCard({ issue }: IssueCardProps) {
  const getStateColor = (state: string) => {
    return state === "open"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-purple-100 text-purple-800 border-purple-200"
  }

  const getLabelStyle = (color: string) => ({
    backgroundColor: `#${color}`,
    color: getContrastColor(color),
  })

  const getContrastColor = (hexColor: string) => {
    const r = Number.parseInt(hexColor.substr(0, 2), 16)
    const g = Number.parseInt(hexColor.substr(2, 2), 16)
    const b = Number.parseInt(hexColor.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? "#000000" : "#ffffff"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={getStateColor(issue.state)}>
                {issue.state}
              </Badge>
              {issue.repository && (
                <Badge variant="secondary" className="text-xs">
                  <GitBranch className="w-3 h-3 mr-1" />
                  {issue.repository.name}
                </Badge>
              )}
            </div>
            <Link href={issue.html_url} target="_blank" rel="noopener noreferrer" className="group">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {issue.title}
                <ExternalLink className="inline w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </Link>
          </div>
          {issue.assignee && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={issue.assignee.avatar_url || "/placeholder.svg"} alt={issue.assignee.login} />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {issue.labels.map((label) => (
              <Badge key={label.id} variant="outline" className="text-xs border-0" style={getLabelStyle(label.color)}>
                {label.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {issue.user.login}
            </span>
          </div>
          <span className="font-mono text-xs">#{issue.number}</span>
        </div>
      </CardContent>
    </Card>
  )
}
