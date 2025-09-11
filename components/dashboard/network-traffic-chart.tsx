"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Activity, TrendingUp } from "lucide-react"
import { fetchNetworkTraffic } from "@/lib/api"

interface TrafficData {
  timestamp: string
  bytesIn: number
  bytesOut: number
  packetsIn: number
  packetsOut: number
}

export function NetworkTrafficChart() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(24)

  useEffect(() => {
    const loadTrafficData = async () => {
      setIsLoading(true)
      const response = await fetchNetworkTraffic(undefined, timeRange)
      if (response.data) {
        // Format data for chart
        const formattedData = response.data.traffic.map((item: any) => ({
          timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          bytesIn: Math.round(item.bytesIn / 1024 / 1024), // Convert to MB
          bytesOut: Math.round(item.bytesOut / 1024 / 1024), // Convert to MB
          packetsIn: item.packetsIn,
          packetsOut: item.packetsOut,
        }))
        setTrafficData(formattedData.reverse()) // Show chronological order
      }
      setIsLoading(false)
    }

    loadTrafficData()
    const interval = setInterval(loadTrafficData, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [timeRange])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-chart-1" />
            Network Traffic Monitor
          </CardTitle>
          <CardDescription>Real-time network bandwidth utilization</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant={timeRange === 1 ? "default" : "outline"} size="sm" onClick={() => setTimeRange(1)}>
            1H
          </Button>
          <Button variant={timeRange === 24 ? "default" : "outline"} size="sm" onClick={() => setTimeRange(24)}>
            24H
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading traffic data...</div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis label={{ value: "MB/s", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value, name) => [`${value} MB`, name === "bytesIn" ? "Inbound" : "Outbound"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bytesIn"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Inbound Traffic"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bytesOut"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Outbound Traffic"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-chart-5" />
            <span>Peak: 1.2 GB/s at 14:30</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
            <span>Avg Inbound: 850 MB/s</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
            <span>Avg Outbound: 620 MB/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
