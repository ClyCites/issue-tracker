"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SearchBar } from "./SearchBar"
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown"
import { ActiveFilters } from "@/components/ActiveFilters"
import { getRepositories, getLabelsFromRepos } from "@/lib/github"

export function IssueFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [repositories, setRepositories] = useState<string[]>([])
  const [availableLabels, setAvailableLabels] = useState<Array<{ name: string; color: string }>>([])

  const currentState = searchParams.get("state") || "open"
  const currentRepos = searchParams.get("repos")?.split(",").filter(Boolean) || []
  const currentLabels = searchParams.get("labels")?.split(",").filter(Boolean) || []
  const currentAssignment = searchParams.get("assignment") || "all"

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

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/issues?${params.toString()}`)
  }

  const updateMultiSelectFilter = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString())

    if (values.length > 0) {
      params.set(key, values.join(","))
    } else {
      params.delete(key)
    }

    router.push(`/issues?${params.toString()}`)
  }

  const repositoryOptions = repositories.map((repo) => ({
    value: repo,
    label: repo.split("/")[1] || repo,
  }))

  const labelOptions = availableLabels.map((label) => ({
    value: label.name,
    label: label.name,
    color: label.color,
  }))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Search</Label>
        <SearchBar />
      </div>

      <Separator />

      <ActiveFilters repositories={repositories} availableLabels={availableLabels} />

      <Separator />

      {/* State Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Status</Label>
        <Select value={currentState} onValueChange={(value) => updateFilter("state", value)}>
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
        <Label className="text-sm font-medium">Repositories</Label>
        <MultiSelectDropdown
          options={repositoryOptions}
          selected={currentRepos}
          onSelectionChange={(values) => updateMultiSelectFilter("repos", values)}
          placeholder="All repositories"
          searchPlaceholder="Search repositories..."
        />
      </div>

      <Separator />

      {/* Labels Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Labels</Label>
        <MultiSelectDropdown
          options={labelOptions}
          selected={currentLabels}
          onSelectionChange={(values) => updateMultiSelectFilter("labels", values)}
          placeholder="All labels"
          searchPlaceholder="Search labels..."
          maxDisplay={2}
        />
      </div>

      <Separator />

      {/* Assignment Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Assignment</Label>
        <Select value={currentAssignment} onValueChange={(value) => updateFilter("assignment", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
