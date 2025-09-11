"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Server, Wifi, WifiOff, Wrench, ExternalLink } from "lucide-react"
import { fetchDevices } from "@/lib/api"
import type { NetworkDevice } from "@/lib/db"

export function DeviceStatus() {
  const [devices, setDevices] = useState<NetworkDevice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDevices = async () => {
      const response = await fetchDevices()
      if (response.data) {
        setDevices(response.data.devices)
      }
      setIsLoading(false)
    }

    loadDevices()
    const interval = setInterval(loadDevices, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Wifi className="h-4 w-4 text-chart-5" />
      case "inactive":
        return <WifiOff className="h-4 w-4 text-destructive" />
      case "maintenance":
        return <Wrench className="h-4 w-4 text-chart-3" />
      default:
        return <Server className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "secondary"
      case "inactive":
        return "destructive"
      case "maintenance":
        return "default"
      default:
        return "outline"
    }
  }

  const getDeviceTypeIcon = (type: string) => {
    // All device types use Server icon for simplicity
    return <Server className="h-4 w-4 text-muted-foreground" />
  }

  const formatLastSeen = (timestamp: string) => {
    const now = new Date()
    const lastSeen = new Date(timestamp)
    const diffMs = now.getTime() - lastSeen.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="h-5 w-5 text-chart-1" />
            Device Status
          </CardTitle>
          <CardDescription>Network device health and connectivity</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Manage
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getDeviceTypeIcon(device.deviceType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{device.deviceName}</span>
                        <Badge variant={getStatusColor(device.status)} className="text-xs">
                          {device.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {device.ipAddress} • {device.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    <span className="text-xs text-muted-foreground">{formatLastSeen(device.lastSeen)}</span>
                  </div>
                </div>
              ))}

              {devices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No devices found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
