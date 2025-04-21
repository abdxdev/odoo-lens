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
  'review-permissions': 'Review Permissions',
  // Add other special cases as needed
}

/**
 * Format a route segment for display in breadcrumbs
 */
export function formatRouteSegment(segment: string): string {
  // Check for special cases in the map
  if (routeSegmentMap[segment]) return routeSegmentMap[segment];
  
  // Default formatting: capitalize each word and join with spaces
  return segment.split('-').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
