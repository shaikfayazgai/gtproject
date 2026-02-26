'use client'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '../../lib/utils'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  pageSize?: number
  enableSorting?: boolean
  enableSelection?: boolean
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  enableSorting = true,
  enableSelection = false,
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const allColumns: ColumnDef<T, unknown>[] = enableSelection
    ? [
        {
          id: 'select',
          header: ({ table }) => (
            <SelectCheckbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          ),
          cell: ({ row }) => (
            <SelectCheckbox
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
          size: 40,
          enableSorting: false,
        },
        ...columns,
      ]
    : columns

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: enableSelection,
    initialState: { pagination: { pageSize } },
  })

  const pageIndex = table.getState().pagination.pageIndex
  const totalPages = table.getPageCount()
  const totalRows = data.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className={cn('rounded-card border border-border overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-bg-dashboard">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-body font-medium text-text-caption uppercase tracking-wider',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:text-text-body transition-colors'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    style={header.column.columnDef.size ? { width: header.column.columnDef.size } : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <ChevronUp className="h-3.5 w-3.5" />}
                      {header.column.getIsSorted() === 'desc' && <ChevronDown className="h-3.5 w-3.5" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-t border-border hover:bg-hover transition-colors',
                  row.getIsSelected() && 'bg-hover'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm font-body text-text-body">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg-dashboard">
        <p className="text-sm font-body text-text-caption">
          Showing {startRow} to {endRow} of {totalRows}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-body text-text-body border border-border rounded-inner hover:bg-hover disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm font-body text-text-caption">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-body text-text-body border border-border rounded-inner hover:bg-hover disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* Styled checkbox for row selection */
function SelectCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: (event: unknown) => void
}) {
  return (
    <button
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      onClick={onChange}
      className={cn(
        'h-4 w-4 rounded-sm border border-border flex items-center justify-center transition-colors',
        (checked || indeterminate) && 'bg-brand-primary border-brand-primary text-white'
      )}
    >
      {checked && <Check className="h-3 w-3" />}
      {indeterminate && !checked && <div className="h-0.5 w-2.5 bg-white rounded-full" />}
    </button>
  )
}
