// app/_components/data-table/client.tsx
'use client'

import {  useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {

  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getColumns } from './columns'
import { type Submission } from '@/lib/types/customField'
import { useReactTable } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

import { useSubmission } from '@/app/providers/SubmissionProvider'
import { EditDialog } from './dialogs/edit-dialog'
import { updateSubmission } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'

interface DataTableProps {
  initialData: Submission[],

}







export default function DataTableClient({ initialData }: DataTableProps) {
    const [data, setData] = useState(initialData)
  const [sorting, setSorting] = useState<SortingState>([])
  const { newSubmissionId, setNewSubmissionId } = useSubmission()
  const [editingRow, setEditingRow] = useState<Submission | null>(null)

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
 const {toast} = useToast()

 const handleEdit = async (updatedData: Submission) => {
console.log('handle edit clicked', updatedData)
    try {
      await updateSubmission(updatedData)
      setData(prev => prev.map(item => 
        item.id === updatedData.id 
          ? { ...updatedData, updatedAt: new Date() } 
          : item
      ))
      setNewSubmissionId(updatedData.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update entry",
        variant: "destructive"
      })
    }
  }

  const columns = useMemo(
    () => getColumns({ onEdit: setEditingRow }), 
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => setSorting(typeof updater === 'function' ? updater(sorting) : updater),
    onColumnFiltersChange: (updater) => setColumnFilters(typeof updater === 'function' ? updater(columnFilters) : updater),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })
// After successful form submission


useEffect(() => {
    if (newSubmissionId) {
      const timer = setTimeout(() => {
        setNewSubmissionId(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [newSubmissionId, setNewSubmissionId])
  return (
    <div className="space-y-4">
        {editingRow && (
  <EditDialog
    open={!!editingRow}
    onOpenChange={(open) => !open && setEditingRow(null)} 
    submission={editingRow}
    onSubmit={handleEdit}
  />
)}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter records..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
  {table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => {
      const isNewRow = row.original.id === newSubmissionId;

      return (
        <motion.tr
          key={row.id}
          initial={isNewRow ? {
            backgroundColor: "rgba(37, 99, 235, 0.15)", // Using RGB values
            scale: 1.01,
          } : false} // false is important here
          animate={isNewRow ? {
            backgroundColor: ["rgba(37, 99, 235, 0.15)", "rgba(37, 99, 235, 0)"],
            scale: 1,
          } : {}}
          transition={{ 
            duration: 3,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{ 
            position: 'relative',
            transformOrigin: 'center'
          }}
          className={cn(
            "border-b",
            isNewRow ? "relative" : "",
            "hover:bg-muted/50"
          )}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </TableCell>
          ))}
        </motion.tr>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {data.length} records
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}