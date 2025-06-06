import { GroupPermission, PermissionSummary } from '@/types/permissions';
import { odooApiRequest } from './utils';

// Permission types and labels
export const PERMISSION_TYPES = ['create', 'read', 'update', 'delete'] as const;

export const PERMISSION_LABELS: Record<string, string> = {
  create: 'Create',
  read: 'Read (View)',
  update: 'Update (Write)',
  delete: 'Delete (Unlink)'
};

/**
 * Get a group name from its ID using the res.groups.json data
 */
export function getGroupName(id: number, groupsData: Record<string, unknown>[]): string {
  const group = groupsData.find(g => (g.id as number) === id);
  return group && typeof group.full_name === 'string' 
    ? group.full_name 
    : `Group ID: ${id}`;
}

/**
 * Calculate permission summary from a list of permissions
 */
export function calculatePermissionSummary(permissions: GroupPermission[]): PermissionSummary {
  return permissions.reduce((acc, p) => ({
    create: acc.create + (p.perm_create ? 1 : 0),
    read: acc.read + (p.perm_read ? 1 : 0),
    update: acc.update + (p.perm_write ? 1 : 0),
    delete: acc.delete + (p.perm_unlink ? 1 : 0),
  }), { create: 0, read: 0, update: 0, delete: 0 });
}

/**
 * Format clipboard text with consistent padding
 */
export function formatPermissionText(name: string, summary: PermissionSummary): string {
  return `${name}:\n` + 
    `  Create: ${summary.create.toString().padEnd(6)} | ` +
    `Read: ${summary.read.toString().padEnd(6)} | ` +
    `Update: ${summary.update.toString().padEnd(6)} | ` +
    `Delete: ${summary.delete}`;
}

/**
 * Calculate total permission counts from multiple groups
 */
export function calculateTotalPermissions(groups: { summary: PermissionSummary, isLoading?: boolean, error?: string | null }[]): PermissionSummary {
  const totalCounts = groups.reduce((acc, group) => {
    if (group.isLoading || group.error) return acc;
    
    Object.entries(group.summary).forEach(([key, value]) => {
      acc[key as keyof PermissionSummary] = (acc[key as keyof PermissionSummary] || 0) + value;
    });
    return acc;
  }, { create: 0, read: 0, update: 0, delete: 0 } as PermissionSummary);
  
  return totalCounts;
}

/**
 * Fetch role permissions data for a specific group
 */
export async function getGroupPermissions(id: number): Promise<GroupPermission[]> {
  // Use odooApiRequest which prioritizes the GUI-set session key
  return await odooApiRequest(
    `/api/odoo/review-permissions`,
    'GET',
    { group_id: id }
  );
}