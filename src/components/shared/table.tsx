"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusCard } from "@/components/status-card";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

interface CombinedTableProps<TData, TValue> {
  type: "model-fields" | "role-permissions" | "data-query" | "faculty-permissions";
  title: string;
  description?: string;
  data: TData[] | Record<string, any>;
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyMessage?: string;
  processData: (data: TData[] | Record<string, any>) => any[];
  columns: ColumnDef<any, TValue>[];
  defaultColumns?: ColumnDef<any, TValue>[];
  pageSize?: number;
  onRowClick?: (row: any) => void;
  customActions?: React.ReactNode;
}

export function CombinedTable<TData, TValue>({
  type,
  title,
  description,
  data,
  isLoading = false,
  error = null,
  emptyTitle = "No Data Found",
  emptyDescription = "No data was found",
  emptyMessage = "Try selecting different data or check your connection.",
  processData,
  columns,
  defaultColumns,
  pageSize = 10,
  onRowClick,
  customActions,
}: CombinedTableProps<TData, TValue>) {

  const processedData = useMemo(() => processData(data), [data, processData]);

  const finalDefaultColumns = defaultColumns || [{
    id: 'empty',
    header: 'No Data',
    cell: () => 'No data available',
    accessorKey: 'empty',
  }] as ColumnDef<any, TValue>[];

  const tableOptions: any = {
    data: processedData,
    columns: processedData.length > 0 ? columns : finalDefaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  };

  if (onRowClick) {
    tableOptions.onRowClick = onRowClick;
  }

  const table = useReactTable(tableOptions);

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
        title={`Error Loading ${title}`}
        description="There was an error loading the data."
      >
        <div className="text-destructive">{error}</div>
      </StatusCard>
    );
  }

  if (processedData.length === 0 && !isLoading) {
    return (
      <StatusCard
        title={emptyTitle}
        description={emptyDescription}
      >
        <div>{emptyMessage}</div>
      </StatusCard>
    );
  }

  return (
    <StatusCard
      title={title}
      description={description || `Showing ${processedData.length} items`}
      actions={customActions}
    >
      <div className="data-table-container">
        <DataTable table={table} />
      </div>
    </StatusCard>
  );
}