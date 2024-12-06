import { 
    BarChart, 
    Bar, 
    LineChart,
    Line,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,

  } from 'recharts'
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {type  SubmissionStats } from '@/lib/actions'

  interface DataVisualizationProps {
    stats: SubmissionStats
  }

  // Use our themed chart colors
const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ]
  
  export default function DataVisualization({ stats }: DataVisualizationProps) {

   
 
    return (
        <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Submissions Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    
      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="count" fill="hsl(var(--primary))" />
                <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="hsl(var(--muted-foreground))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Submissions</dt>
              <dd className="text-2xl font-bold">{stats.totals.totalSubmissions}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Average Age</dt>
              <dd className="text-2xl font-bold">{stats.totals.averageAge}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Last 30 Days</dt>
              <dd className="text-2xl font-bold">{stats.totals.lastMonthSubmissions}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
        </div>
      )
  }