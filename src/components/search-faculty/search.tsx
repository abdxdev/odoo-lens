import { AsyncSelect } from '@/components/async-select'
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Faculty } from '@/types/faculty';
import { odooApiRequest } from '@/lib/utils';

async function searchFaculty(query: string = "", limit: number = 10): Promise<Faculty[]> {
  
  if (!query.trim()) {
    return [];
  }

  const now = Date.now();
  const lastSearchTime = (window as any)._lastFacultySearchTime || 0;
  const minSearchInterval = 500; 
  
  if (now - lastSearchTime < minSearchInterval) {
    console.warn("Search throttled - too soon after previous search");
    return [];
  }
  
  (window as any)._lastFacultySearchTime = now;

  try {
    
    const results = await odooApiRequest(
      '/api/odoo/search-faculty',
      'GET',
      { query, limit }
    );
    
    return results;
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

  const wrappedFetcher = async (query: string = ""): Promise<Faculty[]> => {
    const facultyList = await searchFaculty(query);
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

    const selected = facultyDataRef.current[facultyId];
    if (selected) {
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
            width="100%"
            triggerClassName="h-10 text-base"
          />
        </form>
      </CardContent>
    </Card>
  );
}
