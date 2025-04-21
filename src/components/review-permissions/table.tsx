"use client";

import React, { useMemo } from "react";
import { ModelPermissionsReviewProps, ProcessedPermission } from "@/types/permissions";
import { Database, Check, X } from "lucide-react";
import { PERMISSION_LABELS } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { ModelDataReview } from "@/components/data-query/table";

export function ModelPermissionsReview({
  groupName,
  permissions = [],
  isLoading = false,
  error = null
}: ModelPermissionsReviewProps) {
  const router = useRouter();
  const columnHelper = createColumnHelper<ProcessedPermission>();

  // Define the columns for the permissions table
  const columns = useMemo(() => [
    columnHelper.accessor("model_name", {
      header: "Model Name",
      cell: info => (
        <button
          onClick={() => {
            const modelId = Array.isArray(info.row.original.model_id)
              ? info.row.original.model_id[0]
              : info.row.original.model_id;
            const modelName = info.getValue();
            router.push(`/explore-model?modelId=${modelId}&modelName=${modelName}`);
          }}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <Database className="h-4 w-4" />
          <span className="font-medium">{info.getValue()}</span>
        </button>
      ),
    }),
    columnHelper.accessor("perm_create", {
      header: PERMISSION_LABELS.create,
      cell: info => (
        <div className="flex justify-center">
          {info.getValue() ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ),
    }),
    columnHelper.accessor("perm_read", {
      header: PERMISSION_LABELS.read,
      cell: info => (
        <div className="flex justify-center">
          {info.getValue() ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ),
    }),
    columnHelper.accessor("perm_write", {
      header: PERMISSION_LABELS.update,
      cell: info => (
        <div className="flex justify-center">
          {info.getValue() ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ),
    }),
    columnHelper.accessor("perm_unlink", {
      header: PERMISSION_LABELS.delete,
      cell: info => (
        <div className="flex justify-center">
          {info.getValue() ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ),
    }),
  ], [router]);

  // Process function to transform the data
  const processPermissions = (permissionsData: any[]) => {
    return permissionsData.map(perm => ({
      ...perm,
      model_name: Array.isArray(perm.model_id) ?
        perm.model_id[1] as string :
        perm.model_name || 'Unknown Model'
    }));
  };

  // Default empty column
  const defaultColumns: ColumnDef<ProcessedPermission>[] = [{
    id: 'empty',
    header: 'No Data',
    cell: () => 'No data available',
    accessorKey: 'empty',
  }];

  return (
    <ModelDataReview
      title={`Model Permissions ${groupName ? `for ${groupName}` : ''}`}
      description="Detailed view of permission settings by model"
      data={permissions}
      isLoading={isLoading}
      error={error}
      emptyTitle="No Permissions Data"
      emptyDescription={groupName ? `No permissions data available for ${groupName}` : 'Select a group to view permissions'}
      emptyMessage="No permission data available to display."
      processData={processPermissions}
      columns={columns}
      defaultColumns={defaultColumns}
      pageSize={10}
    />
  );
}