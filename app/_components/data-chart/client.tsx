// app/_components/data-chart/client.tsx
'use client'
import DataVisualization from './DataVisualization'
import type { Submission } from '@/lib/types/customField'

export function SubmissionsChartClient({ data }: { data: Submission[] }) {
  return <DataVisualization data={data} />
}
