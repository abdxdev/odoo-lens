"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { ModelFields } from "@/types/fields";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { StatusCard } from "@/components/status-card";
import { Database, Check, X, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModelFieldsReviewProps {
  modelId: number;
  modelName: string;
  fields: Record<string, ModelFields>;
  isLoading: boolean;
  error: string | null;
}

interface ProcessedField {
  id: string;
  name: string;
  type: string;
  label: string;
  required: boolean;
  readonly: boolean;
  relation?: string;
}

export function ModelFieldsReview({
  modelName,
  fields = {},
  isLoading = false,
  error = null
}: ModelFieldsReviewProps) {
  const processedFields = useMemo<ProcessedField[]>(() => {
    return Object.entries(fields).map(([fieldName, fieldData]) => ({
      id: fieldName,
      name: fieldName,
      type: fieldData.type || 'unknown',
      label: fieldData.string || fieldName,
      required: fieldData.required || false,
      readonly: fieldData.readonly || false,
      relation: fieldData.relation,
    }));
  }, [fields]);

  const columns = useMemo<ColumnDef<ProcessedField>[]>(() => [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
        <DataTableColumnHeader column={column} title="Field Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
      meta: {
        label: "Field Name",
        placeholder: "Search fields...",
        variant: "text",
        icon: Database,
      },
      enableColumnFilter: true,
    },
    {
      id: "label",
      accessorKey: "label",
      header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
        <DataTableColumnHeader column={column} title="Label" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.getValue("label")}</span>
        </div>
      ),
      enableColumnFilter: false,
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="lowercase">
            {row.getValue("type")}
          </Badge>
        </div>
      ),
      enableColumnFilter: false,
    },
    {
      id: "relation",
      accessorKey: "relation",
      header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
        <DataTableColumnHeader column={column} title="Relation" />
      ),
      cell: ({ row }) => {
        const relation = row.original.relation;
        return relation ? (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <span>{relation}</span>
          </div>
        ) : (
          <div className="text-muted-foreground">-</div>
        );
      },
      enableColumnFilter: false,
    },
    {
      id: "required",
      accessorKey: "required",
      header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
        <DataTableColumnHeader column={column} title="Required" />
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
      enableColumnFilter: false,
    },
    {
      id: "readonly",
      accessorKey: "readonly",
      header: ({ column }: { column: Column<ProcessedField, unknown> }) => (
        <DataTableColumnHeader column={column} title="Read Only" />
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
      enableColumnFilter: false,
    },
  ], []);

  const { table } = useDataTable({
    data: processedFields,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "name", desc: false }],
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
        title="Error Loading Fields"
        description="There was an error loading the model fields."
      >
        <div className="text-destructive">{error}</div>
      </StatusCard>
    );
  }

  if (processedFields.length === 0 && !isLoading) {
    return (
      <StatusCard
        title="No Fields Found"
        description="No fields were found for this model."
      >
        <div>Try selecting a different model or checking your connection.</div>
      </StatusCard>
    );
  }

  return (
    <StatusCard
      title={`${modelName} Fields`}
      description={`Showing ${processedFields.length} fields for model ${modelName}`}
    >
      <div className="data-table-container">
        <DataTable table={table}>
          <DataTableToolbar table={table} />
        </DataTable>
      </div>
    </StatusCard>
  );
}