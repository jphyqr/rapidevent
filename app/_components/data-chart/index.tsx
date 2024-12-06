import {  getSubmissionStats } from '@/lib/actions'
import { SubmissionsChartClient } from './client'

export default async function SubmissionsChart() {
  const stats = await getSubmissionStats()
  
  return <SubmissionsChartClient stats={stats} />
}
