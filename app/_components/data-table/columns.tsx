// app/_components/data-table/columns.tsx
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Submission } from '@/lib/types/customField'
import { formatDistance } from 'date-fns'


interface ColumnOptions {
    onEdit: (submission: Submission) => void
   }
   export const getColumns = ({ onEdit }: ColumnOptions): ColumnDef<Submission>[] => [
    {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'age',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'customFields',
    header: 'Custom Fields',
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
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return formatDistance(new Date(row.original.updatedAt), new Date(), { addSuffix: true })
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