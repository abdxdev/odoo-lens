import { Faculty } from '@/types/faculty';

/**
 * Function to search faculty by query string
 * Uses the API route we created to handle authentication securely
 */
export async function searchFaculty(query: string = "", limit: number = 10): Promise<Faculty[]> {
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

    const data = await response.json();
    
    // Return the faculty records
    return data;
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    return [];
  }
}