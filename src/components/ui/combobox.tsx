"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  triggerClassName?: string
  label?: string
  width?: string
  maxHeight?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  emptyText = "No options found.",
  className,
  triggerClassName,
  label,
  width = "auto",
  maxHeight = "300px",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(undefined)

  // Update trigger width when the component mounts or the width prop changes
  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
    
    // Function to handle resize and update the width
    const updateWidth = () => {
      if (triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth)
      }
    }

    // Add resize listener
    window.addEventListener('resize', updateWidth)
    
    // Clean up
    return () => window.removeEventListener('resize', updateWidth)
  }, [width])

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    
    return options.filter((option) => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  return (
    <div className={className} style={{ width }}>
      {label && (
        <label className="text-sm font-medium leading-none mb-2 block">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", triggerClassName)}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0" 
          align="start" 
          sideOffset={4}
          style={{ width: triggerWidth ? `${triggerWidth}px` : width }}
        >
          <Command filter={(value, search) => {
            // This function is crucial for search functionality in Cmdk
            if (value.toLowerCase().includes(search.toLowerCase())) return 1
            return 0
          }}>
            <CommandInput 
              placeholder={placeholder} 
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>{emptyText}</CommandEmpty>
            <ScrollArea className="overflow-auto" style={{ maxHeight }}>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    // Important: Use label here for search, not value
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}