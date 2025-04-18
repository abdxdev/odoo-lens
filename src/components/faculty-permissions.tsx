'use client';

import { useState, useEffect } from 'react';
import { Faculty } from '@/types/faculty';
import { GroupPermissionsData, GroupPermission } from '@/types/permissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import resGroupsData from '@/data/res.groups.json';

interface FacultyPermissionsProps {
  faculty: Faculty | null;
}

interface PermissionSummary {
  create: number;
  read: number;
  update: number;
  delete: number;
}

// Function to get group name from ID
const getGroupName = (groupId: number): string => {
  const group = resGroupsData.find(g => g.id === groupId);
  return group ? group.full_name : `Group ID: ${groupId}`;
};

export function FacultyPermissions({ faculty }: FacultyPermissionsProps) {
  const [groupPermissionsData, setGroupPermissionsData] = useState<GroupPermissionsData[]>([]);
  const [isLoadingOverall, setIsLoadingOverall] = useState<boolean>(false);

  useEffect(() => {
    if (!faculty || !faculty.res_group_id || faculty.res_group_id.length === 0) {
      setGroupPermissionsData([]);
      setIsLoadingOverall(false);
      // Emit event to update the AI analysis sidebar
      const event = new CustomEvent('permissionsLoaded', {
        detail: { permissionsData: [], isLoading: false }
      });
      window.dispatchEvent(event);
      return;
    }

    const fetchPermissionsForGroups = async () => {
      setIsLoadingOverall(true);
      // Emit event to update the AI analysis sidebar - loading state
      const loadingEvent = new CustomEvent('permissionsLoaded', {
        detail: { permissionsData: [], isLoading: true }
      });
      window.dispatchEvent(loadingEvent);

      const initialGroupData: GroupPermissionsData[] = (faculty.res_group_id || []).map((id: number) => ({
        groupId: id,
        groupName: getGroupName(id),
        permissions: [],
        summary: { create: 0, read: 0, update: 0, delete: 0 },
        isLoading: true,
        error: null,
      }));
      setGroupPermissionsData(initialGroupData);

      const promises = (faculty.res_group_id || []).map(async (groupId: number) => {
        try {
          const response = await fetch(`/api/odoo/permissions?group_id=${groupId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch permissions for group ${groupId}: ${response.statusText}`);
          }
          const permissions: GroupPermission[] = await response.json();

          const summary: PermissionSummary = permissions.reduce(
            (acc, perm) => {
              acc.create += perm.perm_create ? 1 : 0;
              acc.read += perm.perm_read ? 1 : 0;
              acc.update += perm.perm_write ? 1 : 0;
              acc.delete += perm.perm_unlink ? 1 : 0;
              return acc;
            },
            { create: 0, read: 0, update: 0, delete: 0 }
          );

          setGroupPermissionsData(prevData =>
            prevData.map(data =>
              data.groupId === groupId
                ? { ...data, permissions, summary, isLoading: false, error: null }
                : data
            )
          );
        } catch (error) {
          console.error(`Error fetching permissions for group ${groupId}:`, error);
          setGroupPermissionsData(prevData =>
            prevData.map(data =>
              data.groupId === groupId
                ? { ...data, isLoading: false, error: error instanceof Error ? error.message : String(error) }
                : data
            )
          );
        }
      });

      await Promise.allSettled(promises);
      setIsLoadingOverall(false);

      // We'll let the other useEffect handle the final event dispatch
    };

    fetchPermissionsForGroups();
  }, [faculty]); // Removed groupPermissionsData from dependencies

  // When permissions data changes, send it to the AI analysis component
  useEffect(() => {
    // Only emit the event when not in loading state and we have data
    if (!isLoadingOverall) {
      // Prepare data for AI analysis and emit event - only send summary numbers
      const analysisData = groupPermissionsData
        .filter(group => !group.isLoading && !group.error)
        .map(({ groupId, groupName, summary }) => ({
          groupId,
          groupName,
          permissionCounts: summary  // Only send the summary numbers, not individual models
        }));
      
      // Only dispatch if we have valid data to send
      if (analysisData.length > 0 || groupPermissionsData.length === 0) {
        const dataEvent = new CustomEvent('permissionsLoaded', {
          detail: { permissionsData: analysisData, isLoading: false }
        });
        window.dispatchEvent(dataEvent);
      }
    }
  }, [groupPermissionsData, isLoadingOverall]);

  if (!faculty) {
    return null;
  }

  // Initial loading state before any group data is potentially available
  if (isLoadingOverall && groupPermissionsData.every(g => g.isLoading)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissions Summary by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (groupPermissionsData.length === 0 && !isLoadingOverall) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissions Summary by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No permission groups associated with this faculty.</p>
        </CardContent>
      </Card>
    );
  }

  // Define permission types for columns
  const permissionTypes: (keyof PermissionSummary)[] = ['create', 'read', 'update', 'delete'];
  const permissionLabels: Record<keyof PermissionSummary, string> = {
    create: 'Create',
    read: 'Read (View)',
    update: 'Update (Write)',
    delete: 'Delete (Unlink)',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions Summary by Group</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              {permissionTypes.map((type) => (
                <TableHead key={type} className="text-right">
                  {permissionLabels[type]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupPermissionsData.map(({ groupId, groupName, summary, isLoading, error }) => (
              <TableRow key={groupId}>
                <TableCell>
                  {isLoading ? <Skeleton className="h-5 w-24 inline-block" /> : groupName}
                </TableCell>
                {permissionTypes.map((type) => (
                  <TableCell key={`${groupId}-${type}`} className="text-right">
                    {isLoading ? (
                      <Skeleton className="h-5 w-10 inline-block" />
                    ) : error ? (
                      <span className="text-red-500 text-xs">Error</span>
                    ) : (
                      summary[type]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Display specific errors below the table if needed */}
        {groupPermissionsData.some(g => g.error) && (
          <div className="mt-4 space-y-1 text-sm text-red-600">
            {groupPermissionsData.filter(g => g.error).map(g => (
              <p key={g.groupId}>Error loading {g.groupName}: {g.error}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
