"use client";
 
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table-toolbar";
 
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
 
import type { Column, ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, User, Phone, Calendar, Tags } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
 
interface Faculty {
  id: number;
  name: string;
  res_group_id: Array<string>;
  contact_number1: string;
  login: string;
  joining_date: string;
}
 
const data: Faculty[] = [
  {
    id: 1,
    name: "John Doe",
    res_group_id: ["Teacher", "HOD"],
    contact_number1: "+92 300 1234567",
    login: "john.doe",
    joining_date: "2024-01-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    res_group_id: ["Teacher"],
    contact_number1: "+92 300 7654321",
    login: "jane.smith",
    joining_date: "2024-02-15",
  },
];
 
export function DataTableDemo() {
  const [name] = useQueryState("name", parseAsString.withDefault(""));
  const [login] = useQueryState(
    "login",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
 
  const filteredData = React.useMemo(() => {
    return data.filter((faculty) => {
      const matchesName =
        name === "" ||
        faculty.name.toLowerCase().includes(name.toLowerCase());
      const matchesLogin =
        login.length === 0 || login.includes(faculty.login);
 
      return matchesName && matchesLogin;
    });
  }, [name, login]);
 
  const columns = React.useMemo<ColumnDef<Faculty>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }: { column: Column<Faculty, unknown> }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {cell.getValue<Faculty["name"]>()}
          </div>
        ),
        meta: {
          label: "Name",
          placeholder: "Search names...",
          variant: "text",
          icon: User,
        },
        enableColumnFilter: true,
      },
      {
        id: "res_group_id",
        accessorKey: "res_group_id",
        header: ({ column }: { column: Column<Faculty, unknown> }) => (
          <DataTableColumnHeader column={column} title="Groups" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            <div className="flex gap-1 flex-wrap">
              {cell.getValue<Faculty["res_group_id"]>().map((group, index) => (
                <Badge key={index} variant="secondary">
                  {group}
                </Badge>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "contact",
        accessorKey: "contact_number1",
        header: ({ column }: { column: Column<Faculty, unknown> }) => (
          <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {cell.getValue<Faculty["contact_number1"]>()}
          </div>
        ),
      },
      {
        id: "login",
        accessorKey: "login",
        header: ({ column }: { column: Column<Faculty, unknown> }) => (
          <DataTableColumnHeader column={column} title="Login" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Faculty["login"]>()}</div>,
      },
      {
        id: "joining_date",
        accessorKey: "joining_date",
        header: ({ column }: { column: Column<Faculty, unknown> }) => (
          <DataTableColumnHeader column={column} title="Joining Date" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(cell.getValue<Faculty["joining_date"]>()).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: "actions",
        cell: function Cell() {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    [],
  );
 
  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id.toString(),
  });
 
  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}