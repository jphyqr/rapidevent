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
    PieChart,
    Pie,
    Cell
  } from 'recharts'
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { type Submission } from '@/lib/types/customField'
import { Label } from '@/components/ui/label'
  
  interface DataVisualizationProps {
    data: Submission[]
  }

  // Use our themed chart colors
const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ]
  
  export default function DataVisualization({ data }: DataVisualizationProps) {
    // Process age distribution data
    const ageRanges = data.reduce((acc, curr) => {
      const range = Math.floor(curr.age / 10) * 10
      const key = `${range}-${range + 9}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  
    const ageData = Object.entries(ageRanges).map(([range, count]) => ({
      range,
      count
    }))
  
    // Process submissions over time
    const submissionsByDate = data.reduce((acc, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  
    const timelineData = Object.entries(submissionsByDate)
      .map(([date, count]) => ({
        date,
        submissions: count
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
    // Process custom field usage
    const fieldTypes = data.flatMap(d => d.customFields).reduce((acc, curr) => {
      if (!curr) return acc
      acc[curr.label] = (acc[curr.label] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  
    const fieldData = Object.entries(fieldTypes)
      .map(([label, count]) => ({
        label,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 most used fields
  
   
 
    return (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader className='flex w-full justify-between '>
              <CardTitle>{`Submissions Over Time: ${data.length}`}</CardTitle>

            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                  <CartesianGrid 
  strokeDasharray="1 1" 
  stroke="hsl(var(--muted-foreground))"
/>
<XAxis 
  dataKey="date" 
  stroke="hsl(var(--muted-foreground))"
  tick={{ fill: 'hsl(var(--muted-foreground))' }}
/>
<YAxis 
  stroke="hsl(var(--muted-foreground))"
  tick={{ fill: 'hsl(var(--muted-foreground))' }}
/>
                    <Tooltip 
  contentStyle={{
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--foreground))',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid'
  }}
  labelStyle={{
    color: 'hsl(var(--foreground))'
  }}
  cursor={{ stroke: 'hsl(var(--muted))' }}
/>
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke={CHART_COLORS[0]}
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
                  <BarChart data={ageData}>
                  <CartesianGrid 
  strokeDasharray="2 2" 
  stroke="hsl(var(--muted-foreground))"
/>
<XAxis 
  dataKey="date" 
  stroke="hsl(var(--muted-foreground))"
  tick={{ fill: 'hsl(var(--muted-foreground))' }}
/>
<YAxis 
  stroke="hsl(var(--muted-foreground))"
  tick={{ fill: 'hsl(var(--muted-foreground))' }}
/>
                    <Tooltip 
  contentStyle={{
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--foreground))',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid'
  }}
  labelStyle={{
    color: 'hsl(var(--foreground))'
  }}
  cursor={{ stroke: 'hsl(var(--muted))' }}
/>
                    <Bar 
                      dataKey="count" 
                      fill={CHART_COLORS[1]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
    
          <Card>
            <CardHeader>
              <CardTitle>Most Used Custom Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fieldData}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {fieldData.map((entry, index) => (
                        <Cell 
                          key={entry.label} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
  contentStyle={{
    backgroundColor: 'hsl(var(--background))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--foreground))',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid'
  }}
  labelStyle={{
    color: 'hsl(var(--foreground))'
  }}
  cursor={{ stroke: 'hsl(var(--muted))' }}
/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )
  }