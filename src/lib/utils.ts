import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Route segment naming map for breadcrumb display
 */
const routeSegmentMap: Record<string, string> = {
  '': 'Odoo Lens',
}

/**
 * Format a route segment for display in breadcrumbs
 */
export function formatRouteSegment(segment: string): string {
  if (routeSegmentMap[segment]) return routeSegmentMap[segment];
  
  return segment.split('-').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Dispatch a session error event
 */
function dispatchSessionError(error: string) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('odoo-api-error', {
      detail: { error }
    });
    window.dispatchEvent(event);
  }
}

/**
 * Function to make authenticated Odoo API requests that always prioritize the client-set session key
 */
export async function odooApiRequest(
  endpoint: string,
  method: 'GET' | 'POST',
  params?: Record<string, any>
) {
  let sessionKey: string | null = null;
  if (typeof window !== 'undefined') {
    sessionKey = localStorage.getItem('odoo-session-key');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (sessionKey) {
    headers['x-odoo-session-key'] = sessionKey;
  }
  
  if (method === 'GET') {
    const url = new URL(endpoint, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      await handleApiErrorResponse(response);
    }
    
    return response.json();
  } 
  else if (method === 'POST') {
    const body = {
      ...params,
      sessionKey: sessionKey || undefined
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      await handleApiErrorResponse(response);
    }
    
    return response.json();
  }
  
  throw new Error(`Unsupported HTTP method: ${method}`);
}

/**
 * Helper function to handle API error responses and dispatch session errors
 */
async function handleApiErrorResponse(response: Response) {
  try {
    const data = await response.json();
    if (data.error) {
      if (
        data.error.includes("Session ID not configured") ||
        data.error.includes("Session Expired") ||
        data.error.includes("session_id") ||
        data.error.includes("Session Invalid")
      ) {
        dispatchSessionError(data.error);
      }
      throw new Error(data.error);
    }
  } catch (e) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  
  throw new Error(`Error: ${response.status} ${response.statusText}`);
}
