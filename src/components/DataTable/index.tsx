"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BaseResponse } from "@/types/interface";

import { DataTableToolbar } from "./DataTableToolbar";
import DataTablePaginator from "./DataTablePaginator";

type SearchParams = PaginationState & Record<string, any>;

// TODO LOADING

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  request: (searchParams: SearchParams) => Promise<BaseResponse<TData[]>>;
}

export function DataTable<TData>({ columns, request }: DataTableProps<TData>) {
  const [sourceData, setSourceData] = useState<TData[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageCount, setPageCount] = useState<number>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1,
  });

  const table = useReactTable({
    data: sourceData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { pagination, columnFilters },
    manualFiltering: true,
    manualPagination: true,
    autoResetPageIndex: false,
    pageCount: pageCount ?? 0,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    table.setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  useEffect(() => {
    console.log(columnFilters);
    const searchParams = {
      ...pagination,
    };

    request(searchParams).then((res) => {
      setSourceData(res.data);
      setPageCount(res.meta?.pagination.pageCount);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, columnFilters]);

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />

      <div className="flex text-sm items-center justify-between">
        <div>共 {table.getPageCount()} 条数据</div>

        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageIndex(0);
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[100px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[1, 2, 3, 4, 10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize} 条/页
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* <div className="flex justify-end"> */}
      <DataTablePaginator
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        onPageChange={(pageNumber: number) =>
          table.setPageIndex(pageNumber - 1)
        }
        showPreviousNext
      />
      {/* </div> */}
    </div>
  );
}
