"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"

interface ActiveFiltersProps {
  repositories: string[]
  availableLabels: Array<{ name: string; color: string }>
}

export function ActiveFilters({ repositories, availableLabels }: ActiveFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentState = searchParams.get("state") || "open"
  const currentRepos = searchParams.get("repos")?.split(",").filter(Boolean) || []
  const currentLabels = searchParams.get("labels")?.split(",").filter(Boolean) || []
  const currentSearch = searchParams.get("search") || ""
  const currentAssignment = searchParams.get("assignment") || "all"

  const removeFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (key === "repos" && value) {
      const repos = currentRepos.filter((repo) => repo !== value)
      if (repos.length > 0) {
        params.set("repos", repos.join(","))
      } else {
        params.delete("repos")
      }
    } else if (key === "labels" && value) {
      const labels = currentLabels.filter((label) => label !== value)
      if (labels.length > 0) {
        params.set("labels", labels.join(","))
      } else {
        params.delete("labels")
      }
    } else {
      if (key === "state") {
        params.set("state", "open") // Reset to default
      } else {
        params.delete(key)
      }
    }

    router.push(`/issues?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push("/issues")
  }

  const getLabelColor = (labelName: string) => {
    const label = availableLabels.find((l) => l.name === labelName)
    return label?.color
  }

  const getContrastColor = (hexColor: string) => {
    const r = Number.parseInt(hexColor.substr(0, 2), 16)
    const g = Number.parseInt(hexColor.substr(2, 2), 16)
    const b = Number.parseInt(hexColor.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? "#000000" : "#ffffff"
  }

  const hasActiveFilters =
    currentState !== "open" ||
    currentRepos.length > 0 ||
    currentLabels.length > 0 ||
    currentSearch ||
    currentAssignment !== "all"

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Active Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
          <Filter className="w-3 h-3 mr-1" />
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-1">
        {/* State Filter */}
        {currentState !== "open" && (
          <Badge variant="secondary" className="text-xs">
            State: {currentState}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFilter("state")}
              className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
            >
              <X className="w-2 h-2" />
            </Button>
          </Badge>
        )}

        {/* Repository Filters */}
        {currentRepos.map((repo) => (
          <Badge key={repo} variant="secondary" className="text-xs">
            Repo: {repo.split("/")[1]}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFilter("repos", repo)}
              className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
            >
              <X className="w-2 h-2" />
            </Button>
          </Badge>
        ))}

        {/* Label Filters */}
        {currentLabels.map((labelName) => {
          const color = getLabelColor(labelName)
          return (
            <Badge
              key={labelName}
              variant="outline"
              className="text-xs border-0"
              style={
                color
                  ? {
                      backgroundColor: `#${color}`,
                      color: getContrastColor(color),
                    }
                  : undefined
              }
            >
              {labelName}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter("labels", labelName)}
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                style={{ color: color ? getContrastColor(color) : undefined }}
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          )
        })}

        {/* Search Filter */}
        {currentSearch && (
          <Badge variant="secondary" className="text-xs">
            Search: "{currentSearch}"
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFilter("search")}
              className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
            >
              <X className="w-2 h-2" />
            </Button>
          </Badge>
        )}

        {/* Assignment Filter */}
        {currentAssignment !== "all" && (
          <Badge variant="secondary" className="text-xs">
            Assignment: {currentAssignment}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFilter("assignment")}
              className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
            >
              <X className="w-2 h-2" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  )
}
