// app/_components/data-chart/index.tsx
import { getSubmissions } from '@/lib/actions'
import { SubmissionsChartClient } from './client'

export default async function SubmissionsChart() {
  const data = await getSubmissions()
  
  return <SubmissionsChartClient data={data} />
}
