export interface GroupPermission {
  id: number;
  name: string;
  group_id: number;
  model_id: number;
  model_name: string;
  perm_read: boolean;
  perm_write: boolean;
  perm_create: boolean;
  perm_unlink: boolean;
}

export interface PermissionSummary {
  create: number;
  read: number;
  update: number;
  delete: number;
}

export interface GroupPermissionsData {
  groupId: number;
  groupName: string;
  permissions: GroupPermission[];
  summary: PermissionSummary;
  isLoading: boolean;
  error: string | null;
}

export interface ProcessedPermission extends GroupPermission {
  model_name: string;
}

export interface ModelPermissionsReviewProps {
  groupId?: number;
  groupName?: string;
  permissions?: GroupPermission[];
  isLoading?: boolean;
  error?: string | null;
}

export interface StatusCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
}