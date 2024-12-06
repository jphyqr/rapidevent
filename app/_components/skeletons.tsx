import { Skeleton } from "@/components/ui/skeleton"


export function ChartSkeleton() {
    return (
      <div className="rounded-lg border bg-card p-4">
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }
  
  export function TableSkeleton() {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="mb-2 h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }
  

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


  export function DataTableSkeleton() {
    return (
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[70px]" />
          </div>
        </div>
  
  
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-6 w-[120px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-[120px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-[120px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-6 w-[120px]" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[120px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
    
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
      </div>
    )
  }
  

  export function DataVisualizationSkeleton() {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        
      
        <div className="rounded-lg border bg-card p-4 md:col-span-2">
          <Skeleton className="h-[350px] w-full" />
        </div>
  
  
        <div className="rounded-lg border bg-card p-4">
          <Skeleton className="h-[350px] w-full" />
        </div>
  
    
        <div className="rounded-lg border bg-card p-4">
          <Skeleton className="h-[350px] w-full" />
        </div>
  
      </div>
    )
  }