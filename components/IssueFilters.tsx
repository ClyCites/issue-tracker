"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, Filter } from "lucide-react"
import { getRepositories, getLabelsFromRepos } from "@/lib/github"

export function IssueFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [repositories, setRepositories] = useState<string[]>([])
  const [availableLabels, setAvailableLabels] = useState<Array<{ name: string; color: string }>>([])
  const [labelSearch, setLabelSearch] = useState("")

  const currentState = searchParams.get("state") || "open"
  const currentRepo = searchParams.get("repo") || ""
  const currentLabels = searchParams.get("labels")?.split(",").filter(Boolean) || []

  useEffect(() => {
    const loadData = async () => {
      try {
        const [repos, labels] = await Promise.all([getRepositories(), getLabelsFromRepos()])
        setRepositories(repos)
        setAvailableLabels(labels)
      } catch (error) {
        console.error("Error loading filter data:", error)
      }
    }
    loadData()
  }, [])

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/issues?${params.toString()}`)
  }

  const toggleLabel = (labelName: string) => {
    const newLabels = currentLabels.includes(labelName)
      ? currentLabels.filter((l) => l !== labelName)
      : [...currentLabels, labelName]

    updateFilters("labels", newLabels.join(","))
  }

  const clearAllFilters = () => {
    router.push("/issues")
  }

  const filteredLabels = availableLabels.filter((label) => label.name.toLowerCase().includes(labelSearch.toLowerCase()))

  const hasActiveFilters = currentState !== "open" || currentRepo || currentLabels.length > 0

  return (
    <div className="space-y-6">
      {/* State Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">State</Label>
        <Select value={currentState} onValueChange={(value) => updateFilters("state", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Repository Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Repository</Label>
        <Select value={currentRepo} onValueChange={(value) => updateFilters("repo", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All repositories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All repositories</SelectItem>
            {repositories.map((repo) => (
              <SelectItem key={repo} value={repo}>
                {repo.split("/")[1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Labels Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Labels</Label>

        {currentLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {currentLabels.map((labelName) => {
              const label = availableLabels.find((l) => l.name === labelName)
              return (
                <Badge
                  key={labelName}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleLabel(labelName)}
                  style={
                    label
                      ? {
                          backgroundColor: `#${label.color}`,
                          color: getContrastColor(label.color),
                        }
                      : undefined
                  }
                >
                  {labelName}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )
            })}
          </div>
        )}

        <Input
          placeholder="Search labels..."
          value={labelSearch}
          onChange={(e) => setLabelSearch(e.target.value)}
          className="text-sm"
        />

        <div className="max-h-32 overflow-y-auto space-y-1">
          {filteredLabels.slice(0, 20).map((label) => (
            <div
              key={label.name}
              className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
              onClick={() => toggleLabel(label.name)}
            >
              <Badge
                variant="outline"
                className="text-xs border-0"
                style={{
                  backgroundColor: `#${label.color}`,
                  color: getContrastColor(label.color),
                }}
              >
                {label.name}
              </Badge>
              {currentLabels.includes(label.name) && <div className="w-2 h-2 bg-primary rounded-full" />}
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="w-full bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </>
      )}
    </div>
  )
}

function getContrastColor(hexColor: string) {
  const r = Number.parseInt(hexColor.substr(0, 2), 16)
  const g = Number.parseInt(hexColor.substr(2, 2), 16)
  const b = Number.parseInt(hexColor.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? "#000000" : "#ffffff"
}
