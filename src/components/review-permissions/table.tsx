"use client";

import React, { useMemo } from "react";
import { GroupPermissionsData, ProcessedPermission } from "@/types/permissions";
import { Database, Check, X } from "lucide-react";
import { PERMISSION_LABELS } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { createColumnHelper } from '@tanstack/react-table';
import { CombinedTable } from "@/components/shared/table";

export function ModelPermissionsReview({
  groupName,
  permissions = [],
  isLoading = false,
  error = null
}: GroupPermissionsData) {
  const router = useRouter();
  const columnHelper = createColumnHelper<ProcessedPermission>();


  const renderPermissionCell = (value: boolean) => (
    <div className="flex justify-center">
      {value ? (
        <Check className="h-5 w-5 text-success" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );


  const columns = useMemo(() => [
    columnHelper.accessor("model_name", {
      header: "Model Name",
      cell: info => (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    ...Object.entries(PERMISSION_LABELS).map(([key, label]) =>
      columnHelper.accessor(`perm_${key}` as keyof ProcessedPermission, {
        header: label,
        cell: info => renderPermissionCell(info.getValue() as boolean),
      })
    )
  ], [columnHelper]);


  const processPermissions = (permissionsData: ProcessedPermission[] | Record<string, unknown> | null) => {
    if (!Array.isArray(permissionsData) || !permissionsData.length) return [];

    return permissionsData.map(perm => ({
      ...perm,
      model_name: Array.isArray(perm.model_id) ? perm.model_id[1] : perm.model_name || 'Unknown Model'
    }));
  };


  const handleRowClick = (row: { original: ProcessedPermission }) => {
    const modelId = Array.isArray(row.original.model_id) ? row.original.model_id[0] : row.original.model_id;
    router.push(`/explore-model?modelId=${modelId}&modelName=${row.original.model_name}`);
  };

  return (
    <CombinedTable
      type="role-permissions"
      title={`Model Permissions ${groupName ? `for ${groupName}` : ''}`}
      description="Detailed view of permission settings by model"
      data={permissions}
      isLoading={isLoading}
      error={error}
      emptyTitle="No Permissions Data"
      emptyDescription={groupName ? `No permissions for ${groupName}` : 'Select a group to view permissions'}
      processData={processPermissions}
      columns={columns}
      defaultColumns={[{ id: 'empty', header: 'No Data', cell: () => 'No data available', accessorKey: 'empty' }]}
      pageSize={10}
      onRowClick={handleRowClick}
    />
  );
}