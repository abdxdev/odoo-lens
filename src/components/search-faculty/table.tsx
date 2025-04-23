'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Faculty } from '@/types/faculty';
import { GroupPermissionsData, GroupPermission } from '@/types/permissions';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ClipboardCopy, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusCard } from '@/components/status-card';
import { CombinedTable } from '@/components/shared/table';
import { odooApiRequest } from '@/lib/utils';
import {
  ColumnDef,
} from '@tanstack/react-table';

import resGroupsData from '@/data/res.groups.json';
import {
  PERMISSION_TYPES,
  PERMISSION_LABELS,
  getGroupName,
  calculatePermissionSummary,
  formatPermissionText,
  calculateTotalPermissions
} from '@/lib/permissions';

interface FacultyPermissionsProps {
  faculty: Faculty | null;
}

type TableDataRow = {
  groupId: number;
  groupName: string;
  permissions: GroupPermission[];
  summary: { create: number; read: number; update: number; delete: number };
  isLoading: boolean;
  error: string | null;
  create: number;
  read: number;
  update: number;
  delete: number;
};

export function FacultyPermissions({ faculty }: FacultyPermissionsProps) {
  const router = useRouter();
  const [data, setData] = useState<GroupPermissionsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copyTooltip, setCopyTooltip] = useState<string>("Copy to clipboard");

  useEffect(() => {
    if (!faculty?.res_group_id?.length) {
      setData([]);
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('permissionsLoaded', {
        detail: { permissionsData: [], isLoading: false }
      }));
      return;
    }

    const fetchPermissions = async () => {
      setIsLoading(true);
      window.dispatchEvent(new CustomEvent('permissionsLoaded', {
        detail: { permissionsData: [], isLoading: true }
      }));

      const initialData = faculty.res_group_id?.map((id: number) => ({
        groupId: id,
        groupName: getGroupName(id, resGroupsData),
        permissions: [],
        summary: { create: 0, read: 0, update: 0, delete: 0 },
        isLoading: true,
        error: null
      })) || [];
      setData(initialData);

      const results = await Promise.allSettled(faculty.res_group_id?.map(async (groupId: number) => {
        try {
          const permissions: GroupPermission[] = await odooApiRequest(
            `/api/odoo/review-permissions?group_id=${groupId}`,
            'GET'
          );
          const summary = calculatePermissionSummary(permissions);

          return { groupId, permissions, summary };
        } catch (error) {
          return { groupId, error: error instanceof Error ? error.message : String(error) };
        }
      }) || []);

      const updatedData = initialData.map(group => {
        const result = results.find(r =>
          r.status === 'fulfilled' &&
          'groupId' in r.value &&
          r.value.groupId === group.groupId
        );

        if (result?.status === 'fulfilled') {
          const value = result.value as { groupId: number; permissions?: GroupPermission[]; summary?: { create: number; read: number; update: number; delete: number }; error?: string };
          return value.error
            ? { ...group, isLoading: false, error: value.error }
            : { ...group, permissions: value.permissions || [], summary: value.summary || { create: 0, read: 0, update: 0, delete: 0 }, isLoading: false };
        }
        return { ...group, isLoading: false, error: 'Failed to fetch' };
      });

      setData(updatedData);
      setIsLoading(false);

      const analysisData = updatedData
        .filter(g => !g.isLoading && !g.error)
        .map(({ groupId, groupName, summary }) => ({
          groupId,
          groupName,
          permissionCounts: summary
        }));

      window.dispatchEvent(new CustomEvent('permissionsLoaded', {
        detail: { permissionsData: analysisData, isLoading: false }
      }));
    };

    fetchPermissions();
  }, [faculty]);

  const copyPermissionsToClipboard = () => {
    if (!faculty || !data.length) return;

    const header = `Permissions Summary for ${faculty.name} (${faculty.login || 'Not provided'})\n`;
    const divider = '═'.repeat(70) + '\n';

    const formattedGroups = data.map(group => {
      if (group.isLoading) return `${group.groupName}: Loading...`;
      if (group.error) return `${group.groupName}: Error - ${group.error}`;

      return formatPermissionText(group.groupName, group.summary);
    }).join('\n\n');

    const totalCounts = calculateTotalPermissions(data);

    const totalSummary = `\nTotal Permissions:\n` + formatPermissionText('Total', totalCounts);

    navigator.clipboard.writeText(header + divider + formattedGroups + '\n' + divider + totalSummary)
      .then(() => {
        setCopyTooltip("Copied!");
        setTimeout(() => setCopyTooltip("Copy to clipboard"), 2000);
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        setCopyTooltip("Failed to copy");
        setTimeout(() => setCopyTooltip("Copy to clipboard"), 2000);
      });
  };

  const handleRowClick = (row: TableDataRow) => {
    if (!row.isLoading && !row.error) {
      const groupId = row.groupId;
      const groupName = row.groupName;

      const queryParams = new URLSearchParams({
        groupId: groupId.toString(),
        groupName: groupName
      }).toString();

      router.push(`/review-permissions?${queryParams}`);
    }
  };

  const tableData = useMemo(() =>
    data.map(group => ({
      ...group,
      create: group.summary.create,
      read: group.summary.read,
      update: group.summary.update,
      delete: group.summary.delete
    })),
    [data]);


  const columns = useMemo<ColumnDef<TableDataRow>[]>(() => [
    {
      accessorKey: "groupName",
      header: "Group Name",
      cell: ({ row }) => {
        const group = row.original;
        if (group.isLoading) {
          return <Skeleton className="h-5 w-24" />;
        }
        return (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="font-medium">{group.groupName}</span>
          </div>
        );
      }
    },
    ...PERMISSION_TYPES.map(type => ({
      accessorKey: type,
      header: PERMISSION_LABELS[type],
      cell: ({ row }) => {
        const group = row.original;
        if (group.isLoading) {
          return <Skeleton className="h-5 w-10" />;
        }
        if (group.error) {
          return <span className="text-xs text-destructive">Error</span>;
        }
        const value = row.getValue(type) as number;
        return (
          <div className="text-center font-medium">{value}</div>
        );
      }
    }))
  ], []);

  const defaultColumns: ColumnDef<TableDataRow>[] = [
    {
      accessorKey: "empty",
      header: "No Data",
      cell: () => "No data available"
    }
  ];

  const copyButton = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyPermissionsToClipboard}
            disabled={isLoading || !data.length}
          >
            <ClipboardCopy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>{copyTooltip}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (!faculty) return null;

  if (isLoading && data.every(g => g.isLoading)) {
    return (
      <StatusCard
        title="Permissions Summary"
        description={`Loading permissions for ${faculty.name}...`}
      >
        <Skeleton className="h-40 w-full" />
      </StatusCard>
    );
  }

  if (!data.length && !isLoading) {
    return (
      <StatusCard
        title="Permissions Summary"
        description={`No permissions data available for ${faculty.name}.`}
      >
        <p>No permission groups associated with this faculty.</p>
      </StatusCard>
    );
  }

  return (
    <CombinedTable
      type="faculty-permissions"
      title="Permissions Summary"
      description={`Permissions for ${faculty.name}`}
      data={tableData}
      isLoading={isLoading}
      error={null}
      emptyTitle="No Permissions Data"
      emptyDescription={`No permissions data available for ${faculty.name}.`}
      emptyMessage="No permission groups associated with this faculty."
      processData={(data) => Array.isArray(data) ? data : []}
      columns={columns}
      defaultColumns={defaultColumns}
      pageSize={10}
      onRowClick={handleRowClick}
      customActions={copyButton}
    />
  );
}
