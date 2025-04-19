"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { ModelFieldsReviewProps, ProcessedField } from "@/types/fields";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { StatusCard } from "@/components/status-card";
import { Database, Check, X } from "lucide-react";
import { FIELD_LABELS } from "@/lib/fields";
import { useRouter } from "next/navigation";

export function ModelFieldsReview({
  modelName,
  fields = [],
  isLoading = false,
  error = null
}: ModelFieldsReviewProps) {
  const router = useRouter();

  const processedFields = useMemo<ProcessedField[]>(() =>
    fields.map(perm => ({
      ...perm,
      model_name: Array.isArray(perm.model_id) ?
        perm.model_id[1] as string :
        perm.model_name || 'Unknown Model'
    })),
    [fields]);

  const createFieldColumn = (
    id: string,
    title: string,
  ): ColumnDef<ProcessedField> => ({
    id,
    accessorKey: id,
    header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center">
        {cell.getValue<boolean>() ? (
          <Check className="h-5 w-5 text-success" />
        ) : (
          <X className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    ),
    meta: {
      label: title,
      placeholder: "Filter...",
      variant: "boolean",
    },
    enableColumnFilter: true,
  });

  const columns = useMemo<ColumnDef<ProcessedField>[]>(
    () => [
      {
        id: "model_name",
        accessorFn: (row) => row.model_name,
        header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
          <DataTableColumnHeader column={column} title="Model Name" />
        ),
        cell: ({ row }) => (
          <button
            onClick={() => {
              const modelName = Array.isArray(row.original.model_id) 
                ? row.original.model_id[0] 
                : row.original.model_name;
              router.push(`/explore-model?model=${modelName}`);
            }}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Database className="h-4 w-4" />
            <span className="font-medium">{row.getValue("model_name")}</span>
          </button>
        ),
        meta: {
          label: "Model Name",
          placeholder: "Search models...",
          variant: "text",
          icon: Database,
        },
        enableColumnFilter: true,
      },
      createFieldColumn("perm_create", FIELD_LABELS.create),
      createFieldColumn("perm_read", FIELD_LABELS.read),
      createFieldColumn("perm_write", FIELD_LABELS.update),
      createFieldColumn("perm_unlink", FIELD_LABELS.delete)
    ],
    [router]
  );

  const handleRowClick = (model: ProcessedField) => {
    const queryParams = new URLSearchParams({
      modelId: model.model_id.toString(),
      modelName: model.model_name
    }).toString();

    router.push(`/explore-model?${queryParams}`);
  };

  const { table } = useDataTable({
    data: processedFields,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "model_name", desc: false }],
    },
    getRowId: (row) => row.id.toString(),
    onRowClick: (row) => {
      handleRowClick(row.original);
    },
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
        title="Error Loading Fields"
        description="Failed to load fields data"
      >
        <div className="text-destructive">{error}</div>
      </StatusCard>
    );
  }

  if (!fields.length) {
    return (
      <StatusCard
        title="No Fields Data"
        description={modelName ? `No fields data available for ${modelName}` : 'Select a model to view fields'}
      >
        <p>No field data available to display.</p>
      </StatusCard>
    );
  }

  return (
    <StatusCard
      title={`Model Fields ${modelName ? `for ${modelName}` : ''}`}
      description="Detailed view of field settings by model"
    >
      <div className="data-table-container">
        <DataTable table={table}>
          <DataTableToolbar table={table} />
        </DataTable>
      </div>
    </StatusCard>
  );
}