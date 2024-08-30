"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { debounce } from "radash";

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

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

import { BaseResponse } from "@/types/interface";

import { DataTableToolbar, DataTableToolbarProps } from "./DataTableToolbar";
import { DataTablePaginator } from "./DataTablePaginator";
import DataTableContext from "./context";
import { ApiException } from "@/libs/utils";
import { IconLoader2 } from "@tabler/icons-react";

export type SearchParams = Partial<PaginationState> & Record<string, any>;

export interface DataTableProps<TData> {
  paginated?: boolean;
  columns: ColumnDef<TData>[];
  filterColumns?: DataTableToolbarProps<TData>["filterColumns"];
  request: (searchParams: SearchParams) => Promise<BaseResponse<TData[]>>;
}

export function DataTable<TData>({
  paginated = true,
  columns,
  filterColumns,
  request,
}: DataTableProps<TData>) {
  const { toast } = useToast();
  const [sourceData, setSourceData] = useState<TData[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = useCallback(
    debounce({ delay: 200 }, (searchParams) => {
      let isCancelled = false;

      setLoading(true);

      request(searchParams)
        .then((res) => {
          setSourceData(res.data);
          setPageCount(res.meta?.pagination.pageCount);
          setLoading(false);
        })
        .catch((error) => {
          if (!isCancelled) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: (error as ApiException).message,
            });
            setLoading(false);
          }
        });

      return () => {
        isCancelled = true;
        setLoading(false);
      };
    }),
    [request]
  );

  const getSearchParams = (): SearchParams => {
    const filters: Record<string, any> = {};

    columnFilters.map(({ id, value }) => {
      filters[id] = value;
    });

    const searchParams = paginated
      ? {
          ...pagination,
          ...filters,
        }
      : { ...filters };

    return searchParams;
  };

  useEffect(() => {
    table.setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  useEffect(() => {
    const searchParams = getSearchParams();

    loadData(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  return (
    <DataTableContext.Provider value={{ loadData, getSearchParams }}>
      <div className="space-y-4">
        <DataTableToolbar table={table} filterColumns={filterColumns} />

        {paginated && (
          <div className="flex text-sm items-center justify-between">
            <div>共 {table.getPageCount()} 页</div>

            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageIndex(0);
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize} 条/页
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <ScrollArea className="relative h-[calc(80vh-220px)] rounded-md border">
          <Table className="relative">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="break-keep"
                      >
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
                    {loading ? (
                      <IconLoader2 className={"h-6 w-6 animate-spin mx-auto"} />
                    ) : (
                      "暂无数据"
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DataTablePaginator
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(pageNumber: number) =>
            table.setPageIndex(pageNumber - 1)
          }
          showPreviousNext
        />
      </div>
    </DataTableContext.Provider>
  );
}
