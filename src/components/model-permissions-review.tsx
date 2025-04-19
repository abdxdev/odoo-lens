"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { ModelPermissionsReviewProps, ProcessedPermission } from "@/types/permissions";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { StatusCard } from "@/components/status-card";
import { Database } from "lucide-react";
import { Check, X } from "lucide-react";

export function ModelPermissionsReview({
  groupName,
  permissions = [],
  isLoading = false,
  error = null
}: ModelPermissionsReviewProps) {
  const processedPermissions = useMemo<ProcessedPermission[]>(() =>
    permissions.map(perm => ({
      ...perm,
      model_name: Array.isArray(perm.model_id) ?
        perm.model_id[1] as string :
        perm.model_name || 'Unknown Model'
    })),
    [permissions]);

  const createPermissionColumn = (
    id: string,
    title: string,
  ): ColumnDef<ProcessedPermission> => ({
    id,
    accessorKey: id,
    header: ({ column }: { column: Column<ProcessedPermission, unknown> }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ cell }) => <div>{cell.getValue<boolean>() ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}</div>,
    meta: {
      label: title,
      placeholder: "Filter...",
      variant: "boolean",
    },
    enableColumnFilter: true,
  });

  const columns = useMemo<ColumnDef<ProcessedPermission>[]>(
    () => [
      {
        id: "model_name",
        accessorFn: (row) => row.model_name,
        header: ({ column }: { column: Column<ProcessedPermission, unknown> }) => (
          <DataTableColumnHeader column={column} title="Model Name" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="font-medium">{row.getValue("model_name")}</span>
          </div>
        ),
        meta: {
          label: "Model Name",
          placeholder: "Search models...",
          variant: "text",
          icon: Database,
        },
        enableColumnFilter: true,
      },
      createPermissionColumn("perm_create", "Create"),
      createPermissionColumn("perm_read", "Read"),
      createPermissionColumn("perm_write", "Update"),
      createPermissionColumn("perm_unlink", "Delete")
    ],
    []
  );

  const { table } = useDataTable({
    data: processedPermissions,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "model_name", desc: false }],
    },
    getRowId: (row) => row.id.toString(),
  });

  if (isLoading) {
    return (
      <StatusCard
        title={<Skeleton className="h-8 w-1/3" />}
        description={<Skeleton className="h-4 w-1/2" />}
      >
        <Skeleton className="h-64 w-full" />
      </StatusCard>
    );
  }

  if (error) {
    return (
      <StatusCard
        title="Error Loading Permissions"
        description="Failed to load permissions data"
      >
        <div className="text-destructive">{error}</div>
      </StatusCard>
    );
  }

  if (!permissions.length) {
    return (
      <StatusCard
        title="No Permissions Data"
        description={groupName ? `No permissions data available for ${groupName}` : 'Select a group to view permissions'}
      >
        <p>No permission data available to display.</p>
      </StatusCard>
    );
  }

  return (
    <StatusCard
      title={`Model Permissions ${groupName ? `for ${groupName}` : ''}`}
      description="Detailed view of permission settings by model"
    >
      <div className="data-table-container">
        <DataTable table={table}>
          <DataTableToolbar table={table} />
        </DataTable>
      </div>
    </StatusCard>
  );
}