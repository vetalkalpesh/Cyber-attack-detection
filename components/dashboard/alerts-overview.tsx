"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ExternalLink } from "lucide-react"

const severityData = [
  { name: "Critical", value: 1, color: "#dc2626" },
  { name: "High", value: 1, color: "#ea580c" },
  { name: "Medium", value: 1, color: "#ca8a04" },
  { name: "Low", value: 1, color: "#16a34a" },
]

const alertTrendData = [
  { time: "00:00", alerts: 12 },
  { time: "04:00", alerts: 8 },
  { time: "08:00", alerts: 15 },
  { time: "12:00", alerts: 23 },
  { time: "16:00", alerts: 18 },
  { time: "20:00", alerts: 14 },
]

export function AlertsOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Alert Severity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alert Severity Distribution</CardTitle>
          <CardDescription>Current alert breakdown by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Alert Trends</CardTitle>
            <CardDescription>Alerts over the last 24 hours</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alerts" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
