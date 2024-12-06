'use client'
import { SubmissionStats } from '@/lib/actions'
import DataVisualization from './DataVisualization'

export function SubmissionsChartClient({ stats }: { stats: SubmissionStats }) {
  return <DataVisualization stats={stats} />
}
