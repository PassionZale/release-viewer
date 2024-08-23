"use client";

import { IconPencilPlus, IconPlus, IconRestore } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInput from "@/components/SearchInput";
import { DataTableViewOptions } from "./DataTableViewOptions";

export interface FilterColumn {
  accessorKey: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumns?: FilterColumn[];
}

export function DataTableToolbar<TData>({
  table,
  filterColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const renderFilterColumn = (column: FilterColumn) => {
    if (column.options?.length) {
      return (
        <Select
          key={column.accessorKey}
          value={
            (table.getColumn(column.accessorKey)?.getFilterValue() as string) ??
            ""
          }
          onValueChange={(value) => {
            table.getColumn(column.accessorKey)?.setFilterValue(value);
          }}
        >
          <SelectTrigger className="h-8 w-[80px] lg:w-[120px]">
            <SelectValue placeholder={column.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {column.options.map((option) => (
              <SelectItem key={option.value} value={`${option.value}`}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <SearchInput
        key={column.accessorKey}
        placeholder={column.placeholder}
        value={
          (table.getColumn(column.accessorKey)?.getFilterValue() as string) ??
          ""
        }
        onChange={(event) =>
          table
            .getColumn(column.accessorKey)
            ?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] lg:w-[250px]"
      />
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap flex-1 items-center gap-2">
        {filterColumns.length &&
          filterColumns.map((column) => renderFilterColumn(column))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            重置
            <IconRestore className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
