// app/_components/data-table/columns.tsx
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Submission } from '@/lib/types/customField'
import { formatDistance } from 'date-fns'
import { cn } from '@/lib/utils'


interface ColumnOptions {
    onEdit: (submission: Submission) => void
   }
   export const getColumns = ({ onEdit }: ColumnOptions): ColumnDef<Submission>[] => [
    {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={cn(
            "flex items-center gap-1",
            isSorted && "text-primary font-medium"
          )}
        >
          Name
          {isSorted ? (
            isSorted === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={cn(
            "flex items-center gap-1",
            isSorted && "text-primary font-medium"
          )}
        >
          Email
          {isSorted ? (
            isSorted === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    }
  },
  {
    accessorKey: 'age',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={cn(
            "flex items-center gap-1",
            isSorted && "text-primary font-medium"
          )}
        >
          Age
          {isSorted ? (
            isSorted === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    }
  },
  {
    accessorKey: 'customFields',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={cn(
            "flex items-center gap-1",
            isSorted && "text-primary font-medium"
          )}
        >
          Custom Fields
          {isSorted ? (
            isSorted === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const fields = row.original.customFields
      if (!fields.length) return <span className="text-muted-foreground">None</span>
      return (
        <div className="max-w-[500px] space-y-1">
          {fields.map(field => (
            <div key={field.id} className="text-sm">
              <span className="font-medium">{field.label}:</span> {field.value}
            </div>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={cn(
            "flex items-center gap-1",
            isSorted && "text-primary font-medium"
          )}
        >
          Last Updated
          {isSorted ? (
            isSorted === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt)
      return (
        <span className="text-muted-foreground text-sm">
          {formatDistance(date, new Date(), { addSuffix: true })}
        </span>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(row.original)}
        >
          Edit
        </Button>
      )
    }
  }
]