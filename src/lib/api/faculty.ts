import { Faculty } from '@/types/faculty';

/**
 * API function to search faculty members
 * @param query - The search query for faculty members
 * @param limit - The maximum number of results to return
 */
export async function searchFaculty(query: string = "", limit: number = 10): Promise<Faculty[]> {
  // Return empty array if query is empty - prevents initial fetching
  if (!query.trim()) {
    return [];
  }

  try {
    // Build URL with query parameters
    const url = new URL('/api/odoo/faculty', window.location.origin);
    url.searchParams.append('query', query);
    url.searchParams.append('limit', limit.toString());

    // Make the API call to our Next.js API route
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return [];
  }
}