import { AsyncSelect } from '@/components/async-select'
import { Faculty } from '@/types/faculty'
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Simple client-side API function to search faculty
async function fetchFaculty(query: string = ""): Promise<Faculty[]> {
  // Return empty array if query is empty - prevents initial fetching
  if (!query.trim()) {
    return [];
  }

  try {
    // Build URL with query parameters
    const url = new URL('/api/odoo/faculty', window.location.origin);
    url.searchParams.append('query', query);
    url.searchParams.append('limit', '10');

    console.log("Fetching faculty with query:", query);

    // Make the API call to our Next.js API route
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Received faculty data:", data);

    // Return the faculty records
    return data;
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return [];
  }
}

interface SearchFacultyProps {
  onSelectFaculty?: (faculty: Faculty | null) => void;
}

export function SearchFaculty({ onSelectFaculty }: SearchFacultyProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
  const facultyDataRef = useRef<Record<string, Faculty>>({});

  // Modified fetchFaculty to store the faculty data in our ref for later use
  const wrappedFetcher = async (query: string = ""): Promise<Faculty[]> => {
    const facultyList = await fetchFaculty(query);

    // Store faculty data in ref for lookup
    facultyList.forEach(faculty => {
      facultyDataRef.current[faculty.id.toString()] = faculty;
    });

    return facultyList;
  };

  const handleFacultyChange = (facultyId: string) => {
    setSelectedFacultyId(facultyId);

    if (!facultyId) {
      onSelectFaculty?.(null);
      return;
    }

    // Find the faculty object with the matching ID using our ref
    const selected = facultyDataRef.current[facultyId];

    // Call the callback with the selected faculty object
    if (selected) {
      console.log("Selected faculty:", selected);
      onSelectFaculty?.(selected);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Faculty</CardTitle>
        <CardDescription>
          Please enter the name of the faculty member you are looking for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <AsyncSelect<Faculty>
            fetcher={wrappedFetcher}
            preload={false}
            skipInitialFetch={true}
            filterFn={(faculty, query) => faculty.name.toLowerCase().includes(query.toLowerCase())}
            renderOption={(faculty) => (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="font-medium">{faculty.name}</div>
                  <div className="text-xs text-muted-foreground">{faculty.department_id?.[1] || 'Unknown Department'}</div>
                </div>
              </div>
            )}
            getOptionValue={(faculty) => faculty.id.toString()}
            getDisplayValue={(faculty) => (
              <div className="flex items-center gap-2 text-left">
                <div className="flex flex-col leading-tight">
                  <div className="font-medium">{faculty.name}</div>
                </div>
              </div>
            )}
            notFound={<div className="py-6 text-center text-sm">No faculty members found</div>}
            label="Faculty"
            placeholder="Search faculty..."
            value={selectedFacultyId}
            onChange={handleFacultyChange}
            width="300px"
            triggerClassName="h-10 text-base"
          />
        </form>
      </CardContent>
    </Card>
  );
}
