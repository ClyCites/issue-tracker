"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  placeholder = "Search issues by title, labels, or assignee...",
  debounceMs = 300,
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchValue.trim()) {
        params.set("search", searchValue.trim())
      } else {
        params.delete("search")
      }

      router.push(`/issues?${params.toString()}`)
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [searchValue, searchParams, router, debounceMs])

  const clearSearch = () => {
    setSearchValue("")
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}
