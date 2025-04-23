"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DataQueryForm } from "@/components/data-query/form";
import { DataTable } from "@/components/data-table";
import { DataQueryParams, DataQueryResult } from "@/types/data-query";
import { executeDataQuery } from "@/lib/data-query";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DataQueryPage() {
  const [queryResults, setQueryResults] = useState<DataQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<Array<{ id: string; header: string; accessorKey?: string; cell?: () => string }>>([]);

  const defaultColumns = [{
    id: 'empty',
    header: 'No Data',
    cell: () => 'No data available',
    accessorKey: 'empty',
  }];

  const table = useReactTable({
    data: queryResults?.records || [],
    columns: columns.length > 0 ? columns : defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleSubmitQuery = async (queryParams: DataQueryParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await executeDataQuery(queryParams);
      setQueryResults(results);

      if (results.records && results.records.length > 0) {
        const columnHelper = createColumnHelper<Record<string, unknown>>();
        const dynamicColumns = Object.keys(results.records[0]).map(key => {
          return columnHelper.accessor(key, {
            header: key,
            cell: info => {
              const value = info.getValue();

              if (value === null || value === undefined) return "—";
              if (Array.isArray(value)) {
                if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'string') {
                  return value[1];
                }
                return JSON.stringify(value);
              }
              if (typeof value === 'object') return JSON.stringify(value);
              return String(value);
            }
          });
        });
        setColumns(dynamicColumns);
      } else {
        setColumns([]);
      }
    } catch (err) {
      console.error("Error executing data query:", err);
      setError(err instanceof Error ? err.message : "An error occurred while fetching data");
      setQueryResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex-col space-y-6"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 w-full"
      >
        <motion.div variants={item} className="w-full">
          <DataQueryForm onSubmitQuery={handleSubmitQuery} />
        </motion.div>

        {isLoading && (
          <motion.div variants={item} className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Loading Results...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div variants={item} className="w-full">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {queryResults && queryResults.records && queryResults.records.length > 0 && !isLoading && (
          <motion.div variants={item} className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Query Results ({queryResults.records.length} records)</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable table={table} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {queryResults && (!queryResults.records || queryResults.records.length === 0) && !isLoading && !error && (
          <motion.div variants={item} className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>No Results Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your query returned no results. Try adjusting your filter criteria.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}