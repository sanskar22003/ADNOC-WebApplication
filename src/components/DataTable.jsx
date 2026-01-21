"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableDemo({
  columns,
  data,
  isLoading = false,
  pagination,
  disablePagination = false,
}) {
  const table = useReactTable({
    data,
    columns,
    manualPagination: !disablePagination,
    state: pagination
      ? {
          pagination: {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          },
        }
      : {},
    pageCount: pagination
      ? Math.ceil(pagination.totalCount / pagination.pageSize)
      : -1,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
           <TableSkeleton
    columns={columns.length}
    rows={ 12}
  />
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
              <TableCell colSpan={columns.length} className="text-center h-24">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      {!disablePagination && pagination && (
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-slate-500">
            Page {pagination.pageIndex + 1} of{" "}
            {Math.ceil(pagination.totalCount / pagination.pageSize)}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => pagination.setPageIndex(0)}
              disabled={pagination.pageIndex === 0}
            >
              First
            </Button>
            <Button
              size="sm"
              onClick={() =>
                pagination.setPageIndex((p) => Math.max(p - 1, 0))
              }
              disabled={pagination.pageIndex === 0}
            >
              Prev
            </Button>
            <Button
              size="sm"
              onClick={() =>
                pagination.setPageIndex((p) => p + 1)
              }
              disabled={
                (pagination.pageIndex + 1) *
                  pagination.pageSize >=
                pagination.totalCount
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}



function TableSkeleton({ columns, rows = 10 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
