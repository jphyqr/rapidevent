import { Skeleton } from "@/components/ui/skeleton"

// app/_components/skeletons.tsx
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
  