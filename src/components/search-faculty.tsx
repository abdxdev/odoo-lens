import { AsyncSelect } from '@/components/async-select'
import { Faculty } from '@/types/faculty'
import { useState } from 'react'

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

export function SearchFaculty() {
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");

    const handleFacultyChange = (facultyId: string) => {
        setSelectedFacultyId(facultyId);
    };

    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Search Faculty</h2>
                    <p className="mt-4">Please enter the name of the faculty member you are looking for.</p>

                    <form action="" className="mx-auto mt-10 max-w-sm lg:mt-12">
                        <AsyncSelect<Faculty>
                            fetcher={fetchFaculty}
                            preload={false}
                            skipInitialFetch={true} // Add this prop to skip initial fetch
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
                                        {/* <div className="text-xs text-muted-foreground">{faculty.department_id?.[1]}</div> */}
                                    </div>
                                </div>
                            )}
                            notFound={<div className="py-6 text-center text-sm">No faculty members found</div>}
                            label="Faculty"
                            placeholder="Search faculty..."
                            value={selectedFacultyId}
                            onChange={handleFacultyChange}
                            width="375px"
                        />
                    </form>
                </div>
            </div>
        </section>
    );
}
