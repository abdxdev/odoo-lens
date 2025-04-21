import { useState, useEffect, useCallback, useRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface AsyncSelectProps<T> {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Preload all data ahead of time */
  preload?: boolean;
  /** Skip initial data fetch on mount */
  skipInitialFetch?: boolean;
  /** Function to filter options */
  filterFn?: (option: T, query: string) => boolean;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** Function to get the display value for the selected option */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom width for the popover */
  width?: string | number;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  clearable?: boolean;
}

export function AsyncSelect<T>({
  fetcher,
  preload,
  skipInitialFetch = false,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = "Select...",
  value,
  onChange,
  disabled = false,
  width = "200px",
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
}: AsyncSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, preload ? 0 : 1000);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const initialFetchRef = useRef(false);
  const searchFetchRef = useRef(false);

  useEffect(() => {
    if (open && triggerRef.current) {
      const buttonWidth = triggerRef.current.getBoundingClientRect().width;
      setTriggerWidth(buttonWidth);
    }
  }, [open]);

  useEffect(() => {
    if (skipInitialFetch) {
      initialFetchRef.current = true;
      return;
    }

    const fetchInitialData = async () => {
      if (initialFetchRef.current) return;

      try {
        initialFetchRef.current = true;
        setLoading(true);
        const data = await fetcher("");
        setOptions(data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch options');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetcher, skipInitialFetch]);

  useEffect(() => {
    if (!options.length) return;

    if (value) {
      const option = options.find(opt => getOptionValue(opt) === value);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options, getOptionValue]);

  useEffect(() => {
    if (loading && !searchFetchRef.current) return;

    const fetchFilteredOptions = async () => {
      if (preload) {
        if (debouncedSearchTerm && options.length > 0) {
          const filteredOptions = options.filter((option) =>
            filterFn ? filterFn(option, debouncedSearchTerm) : true
          );
          setOptions(filteredOptions);
        } else if (!debouncedSearchTerm && initialFetchRef.current) {
          const data = await fetcher("");
          setOptions(data);
        }
        return;
      }

      if (debouncedSearchTerm !== undefined) {
        try {
          searchFetchRef.current = true;
          setLoading(true);
          setError(null);
          const data = await fetcher(debouncedSearchTerm);
          setOptions(data);
        } catch (err) {
          console.error("Error searching:", err);
          setError(err instanceof Error ? err.message : 'Failed to fetch options');
        } finally {
          setLoading(false);
          searchFetchRef.current = false;
        }
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredOptions();
    }, 0);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, fetcher, preload, filterFn, options.length]);

  const handleSelect = useCallback((currentValue: string) => {
    const newValue = clearable && currentValue === value ? "" : currentValue;
    onChange(newValue);
    setOpen(false);
  }, [value, onChange, clearable]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between",
            disabled && "opacity-50 cursor-not-allowed",
            triggerClassName
          )}
          style={{ width: width }}
          disabled={disabled}
        >
          {selectedOption ? (
            getDisplayValue(selectedOption)
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="opacity-50" size={10} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{
          width: triggerWidth ? `${triggerWidth}px` : width,
          minWidth: triggerWidth ? `${triggerWidth}px` : width
        }}
        className={cn("p-0", className)}
      >
        <Command shouldFilter={false}>
          <div className="relative border-b w-full">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            {loading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-destructive text-center">
                {error}
              </div>
            )}
            {loading && options.length === 0 && (
              loadingSkeleton || <DefaultLoadingSkeleton />
            )}
            {!loading && !error && options.length === 0 && (
              notFound || <CommandEmpty>{noResultsMessage ?? `No ${label.toLowerCase()} found.`}</CommandEmpty>
            )}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                  onSelect={handleSelect}
                >
                  {renderOption(option)}
                  <Check
                    className={cn(
                      "ml-auto h-3 w-3",
                      value === getOptionValue(option) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex items-center gap-2 w-full">
            <div className="h-6 w-6 rounded-full animate-pulse bg-muted" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="h-4 w-24 animate-pulse bg-muted rounded" />
              <div className="h-3 w-16 animate-pulse bg-muted rounded" />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}