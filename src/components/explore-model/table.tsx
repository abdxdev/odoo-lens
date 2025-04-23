"use client";

import React, { useMemo } from "react";
import { Database, Check, X, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from '@tanstack/react-table';
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
  modelId?: number;
  modelName?: string; 
  fields?: Record<string, ModelFields>; // Made fields optional to match TableComponentProps interface
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
  [key: string]: string | boolean | undefined;
}

// Define a union type to handle both string and boolean values
type CellValue = string | boolean | undefined;

export function ModelFieldsReview({
  modelName = "", 
  fields = {},
  isLoading = false,
  error = null
}: ModelFieldsReviewProps) {
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

  // Define the columns for the fields table directly with the correct type
  const columns = useMemo<ColumnDef<ProcessedField, CellValue>[]>(() => [
    {
      accessorKey: "name",
      header: "Field Name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{info.getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "label",
      header: "Label",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => (
        <Badge variant="outline" className="lowercase">
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: "relation",
      header: "Relation",
      cell: (info) => {
        const relation = info.getValue() as string | undefined;
        return relation ? (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <span>{relation}</span>
          </div>
        ) : (
          <div className="text-muted-foreground">-</div>
        );
      },
    },
    {
      accessorKey: "required",
      header: "Required",
      cell: (info) => renderBooleanCell(info.getValue() as boolean),
    },
    {
      accessorKey: "readonly",
      header: "Read Only",
      cell: (info) => renderBooleanCell(info.getValue() as boolean),
    },
  ], []);

  // Process function to transform the data
  const processFields = (data: Record<string, unknown> | Record<string, ModelFields> | unknown[]) => {
    if (!data || Array.isArray(data) || Object.keys(data).length === 0) return [];

    return Object.entries(data).map(([fieldName, fieldData]) => {
      const field = fieldData as unknown as ModelFields;
      return {
        id: fieldName,
        name: fieldName,
        type: field.type || 'unknown',
        label: field.string || fieldName,
        required: field.required || false,
        readonly: field.readonly || false,
        relation: field.relation,
      };
    });
  };

  return (
    <CombinedTable<ProcessedField, CellValue>
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