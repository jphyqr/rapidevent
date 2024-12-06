
import { Suspense } from 'react'
import  DataForm  from './_components/data-form'

import {  DataTableSkeleton, DataVisualizationSkeleton } from './_components/skeletons'
import  SubmissionsTable  from './_components/data-table'
import  SubmissionsChart  from './_components/data-chart'

export default function Home() {
  return (
    <div className="space-y-8  mb-96">

      
   
      <Suspense fallback={<DataVisualizationSkeleton />}>
        <SubmissionsChart />
      </Suspense>
      
      <DataForm />

     
      <Suspense fallback={<DataTableSkeleton />}>
        <SubmissionsTable />
      </Suspense>
    </div>
  )
}
