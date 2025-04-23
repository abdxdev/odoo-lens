"use client";

import React, { useMemo } from "react";
import { Database, Check, X, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createColumnHelper } from '@tanstack/react-table';
import { CombinedTable } from "@/components/shared/table";

interface ModelFields {
  string: string;
  type: string;
  required: boolean;
  readonly: boolean;
  relation?: string;
  selection?: [string, string][];
  company_dependent?: boolean;
  domain?: string[];
  context?: Record<string, unknown>;
}

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
  const columnHelper = createColumnHelper<ProcessedField>();

  // Create a reusable function for boolean cell rendering
  const renderBooleanCell = (value: boolean) => (
    <div className="flex justify-center">
      {value ? (
        <Check className="h-5 w-5 text-success" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );

  // Define the columns for the fields table
  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Field Name",
      cell: info => (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("label", {
      header: "Label",
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: info => (
        <Badge variant="outline" className="lowercase">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("relation", {
      header: "Relation",
      cell: info => {
        const relation = info.getValue();
        return relation ? (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <span>{relation}</span>
          </div>
        ) : (
          <div className="text-muted-foreground">-</div>
        );
      },
    }),
    columnHelper.accessor("required", {
      header: "Required",
      cell: info => renderBooleanCell(info.getValue()),
    }),
    columnHelper.accessor("readonly", {
      header: "Read Only",
      cell: info => renderBooleanCell(info.getValue()),
    }),
  ], [columnHelper]);

  // Process function to transform the data
  const processFields = (fieldsData: Record<string, ModelFields> | null) => {
    if (!fieldsData) return [];

    return Object.entries(fieldsData).map(([fieldName, fieldData]) => ({
      id: fieldName,
      name: fieldName,
      type: fieldData.type || 'unknown',
      label: fieldData.string || fieldName,
      required: fieldData.required || false,
      readonly: fieldData.readonly || false,
      relation: fieldData.relation,
    }));
  };

  return (
    <CombinedTable
      type="model-fields"
      title={`${modelName} Fields`}
      description={`Fields for model ${modelName}`}
      data={fields}
      isLoading={isLoading}
      error={error}
      emptyTitle="No Fields Found"
      emptyDescription="No fields were found for this model."
      emptyMessage="Try selecting a different model or checking your connection."
      processData={processFields}
      columns={columns}
      defaultColumns={[{ id: 'empty', header: 'No Data', cell: () => 'No data available', accessorKey: 'empty' }]}
      pageSize={10}
    />
  );
}