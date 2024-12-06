// app/_components/data-table/index.tsx
import { getSubmissions } from '@/lib/actions'
import  DataTableClient  from './client'

export default async function SubmissionsTable() {
  //simulate a delay

 
  const data = await getSubmissions()
  return <DataTableClient initialData={data} />
}