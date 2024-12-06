
import { getSubmissions } from '@/lib/actions'
import  DataTableClient  from './client'

export default async function SubmissionsTable() {
 
  const data = await getSubmissions()
  return <DataTableClient initialData={data} />
}