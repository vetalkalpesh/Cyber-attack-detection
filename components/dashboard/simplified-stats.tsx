"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield } from "lucide-react"
import { fetchDashboardStats } from "@/lib/api"

interface SimplifiedStatsData {
  totalAlerts: number
  criticalAlerts: number
}

export function SimplifiedStats() {
  const [stats, setStats] = useState<SimplifiedStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const response = await fetchDashboardStats()
      if (response.data) {
        setStats({
          totalAlerts: response.data.stats.totalAlerts,
          criticalAlerts: response.data.stats.criticalAlerts,
        })
      }
      setIsLoading(false)
    }

    loadStats()
    const interval = setInterval(loadStats, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalAlerts || 0}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          <Shield className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-destructive">{stats?.criticalAlerts || 0}</div>
            {(stats?.criticalAlerts || 0) > 0 && (
              <Badge variant="destructive" className="text-xs">
                URGENT
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Requires immediate attention</p>
        </CardContent>
      </Card>
    </div>
  )
}
