// app/page.tsx
import { Suspense } from 'react'
import  DataForm  from './_components/data-form'

import { ChartSkeleton, TableSkeleton } from './_components/skeletons'
import  SubmissionsTable  from './_components/data-table'
import  SubmissionsChart  from './_components/data-chart'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Form doesn't need suspense as it's client-side */}
   
      
      {/* Chart with suspense */}
      <Suspense fallback={<ChartSkeleton />}>
        <SubmissionsChart />
      </Suspense>
      
      <DataForm />

      {/* Table with suspense */}
      <Suspense fallback={<TableSkeleton />}>
        <SubmissionsTable />
      </Suspense>
    </div>
  )
}
