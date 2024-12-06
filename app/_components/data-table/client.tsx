// app/_components/data-table/client.tsx
'use client'

import {  useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {

  flexRender,
  getCoreRowModel,
  type SortingState,
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
import { getSubmissions, updateSubmission } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'
import { useDebounce } from '@/hooks/use-debounce'
import { Badge } from '@/components/ui/badge'

interface DataTableProps {
  initialData: {
    items: Submission[]
    metadata: {
      currentPage: number
      pageSize: number
      totalItems: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}






export default function DataTableClient({ initialData }: DataTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [data, setData] = useState(initialData.items)
  const [isRefetching, setIsRefetching] = useState(false)

  const [metadata, setMetadata] = useState(initialData.metadata)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updatedAt', desc: true } // Default sort
  ])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500) // 500ms delay

  const { newSubmissionId, setNewSubmissionId } = useSubmission()
  const [editingRow, setEditingRow] = useState<Submission | null>(null)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Fetch data when page, pageSize, or search changes
  const fetchData = async () => {
    try {
      setIsRefetching(true)
      const { items, metadata } = await getSubmissions({
        page,
        pageSize,
        search,
        // Default to updatedAt desc if no sort specified
        sortBy: sorting[0]?.id || 'updatedAt',
        sortDirection: sorting[0]?.desc ?? true ? 'desc' : 'asc'
      })
      setData(items)
      setMetadata(metadata)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      })
    } finally {
      setIsRefetching(false)
    }
  }

  useEffect(() => {
    if (!newSubmissionId) { // Only fetch if not handling a new submission
      fetchData()
    }
  }, [page, pageSize, debouncedSearch, sorting])
  useEffect(() => {
    if (newSubmissionId) {
      const submission = initialData.items.find(
        item => item.id === newSubmissionId
      )
      
      if (submission) {
        // Force sort to updatedAt desc if not already
        if (!sorting.some(s => s.id === 'updatedAt' && s.desc)) {
          setSorting([{ id: 'updatedAt', desc: true }])
        }
        
        setData(currentData => {
          const filtered = currentData.filter(
            item => item.id !== newSubmissionId
          )
          return [submission, ...filtered].slice(0, pageSize)
        })
  
        const timer = setTimeout(() => {
          setNewSubmissionId(null)
          // Remove this fetchData call since we want to maintain the sort
          // fetchData() 
        }, 3000)
  
        return () => clearTimeout(timer)
      }
    }
  }, [newSubmissionId, initialData.items, pageSize, sorting])
  useEffect(() => {
    fetchData()
  }, [page, pageSize, sorting, debouncedSearch])

  // Handle edit submission
  const handleEdit = async (updatedData: Submission) => {
    try {
      // Optimistically update the UI first
      setData(currentData => 
        currentData.map(item => 
          item.id === updatedData.id ? updatedData : item
        )
      )

      const response = await updateSubmission(updatedData)
    
      console.log(response)
      if (response.success) {
        setNewSubmissionId(updatedData.id)
        setSorting([{ id: 'updatedAt', desc: true }])

      } else {

        fetchData()

      }
      return response
    } catch (error) {
      console.log(error)
      // If error, revert the optimistic update by refetching
      fetchData()
      return { 
        success: false, 
        error: "Failed to update entry" 
      }
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
    pageCount: metadata.totalPages,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
  })

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
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={cn(
  "rounded-md border relative",
  isRefetching && "after:absolute after:inset-0 after:bg-white/50 after:backdrop-blur-sm"
)}>
    {isRefetching && (
    <div className="absolute top-2 right-2 z-10">
      <Badge variant="secondary">
        Syncing...
      </Badge>
    </div>
  )}
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
            {isLoading ? (
  Array.from({ length: pageSize }).map((_, index) => (
    <TableRow key={index} className="animate-pulse">
      {columns.map((column, cellIndex) => (
        <TableCell key={cellIndex} className="p-4">
          <div className="h-4 w-full bg-muted rounded" />
        </TableCell>
      ))}
    </TableRow>
  ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isNewRow = row.original.id === newSubmissionId;
                return (
                  <motion.tr
                    key={row.id}
                    initial={isNewRow ? {
                      backgroundColor: "rgba(37, 99, 235, 0.15)",
                      scale: 1.01,
                    } : false}
                    animate={isNewRow ? {
                      backgroundColor: ["rgba(37, 99, 235, 0.15)", "rgba(37, 99, 235, 0)"],
                      scale: 1,
                    } : {}}
                    transition={{ duration: 3 }}
                    className={cn(
                      "border-b",
                      isNewRow && "relative",
                      "hover:bg-muted/50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          Showing {metadata.totalItems > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(page * pageSize, metadata.totalItems)} of {metadata.totalItems} records
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={!metadata.hasPreviousPage || isLoading}
          >
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {metadata.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={!metadata.hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}