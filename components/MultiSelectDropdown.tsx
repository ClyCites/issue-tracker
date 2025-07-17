"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
  color?: string
}

interface MultiSelectDropdownProps {
  options: Option[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder: string
  searchPlaceholder?: string
  maxDisplay?: number
}

export function MultiSelectDropdown({
  options,
  selected,
  onSelectionChange,
  placeholder,
  searchPlaceholder = "Search...",
  maxDisplay = 3,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    onSelectionChange(newSelected)
  }

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder
    if (selected.length <= maxDisplay) {
      return selected.join(", ")
    }
    return `${selected.slice(0, maxDisplay).join(", ")} +${selected.length - maxDisplay} more`
  }

  const getLabelStyle = (option: Option) => {
    if (!option.color) return {}
    return {
      backgroundColor: `#${option.color}`,
      color: getContrastColor(option.color),
    }
  }

  const getContrastColor = (hexColor: string) => {
    const r = Number.parseInt(hexColor.substr(0, 2), 16)
    const g = Number.parseInt(hexColor.substr(2, 2), 16)
    const b = Number.parseInt(hexColor.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? "#000000" : "#ffffff"
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-left font-normal bg-transparent"
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.value} onSelect={() => toggleOption(option.value)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {option.color ? (
                      <Badge variant="outline" className="text-xs border-0" style={getLabelStyle(option)}>
                        {option.label}
                      </Badge>
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
