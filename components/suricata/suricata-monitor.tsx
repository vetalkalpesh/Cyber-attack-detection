"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Play, Square, Upload, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MonitorStatus {
  isRunning: boolean
  lastUpdate: string
  alertsProcessed: number
  errors: number
}

export function SuricataMonitor() {
  const { toast } = useToast()
  const [status, setStatus] = useState<MonitorStatus>({
    isRunning: false,
    lastUpdate: new Date().toISOString(),
    alertsProcessed: 0,
    errors: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [logContent, setLogContent] = useState("")
  const [uploadResult, setUploadResult] = useState<any>(null)

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 10000) // Check status every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/suricata/monitor")
      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
      }
    } catch (error) {
      console.error("Failed to fetch monitor status:", error)
    }
  }

  const toggleMonitoring = async () => {
    setIsLoading(true)
    try {
      const action = status.isRunning ? "stop" : "start"
      const response = await fetch("/api/suricata/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to control monitoring",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const uploadLogs = async () => {
    if (!logContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter log content to process",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/suricata/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logContent }),
      })

      if (response.ok) {
        const data = await response.json()
        setUploadResult(data)
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process logs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatLastUpdate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Monitor Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Suricata Monitor Status
          </CardTitle>
          <CardDescription>Real-time monitoring of Suricata IDS/IPS logs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {status.isRunning ? (
                  <CheckCircle className="h-5 w-5 text-chart-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="font-medium">
                  Status:
                  <Badge variant={status.isRunning ? "secondary" : "outline"} className="ml-2">
                    {status.isRunning ? "Running" : "Stopped"}
                  </Badge>
                </span>
              </div>
            </div>
            <Button
              onClick={toggleMonitoring}
              disabled={isLoading}
              variant={status.isRunning ? "destructive" : "default"}
            >
              {status.isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Last Update:</span>
              <div className="font-medium">{formatLastUpdate(status.lastUpdate)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Alerts Processed:</span>
              <div className="font-medium">{status.alertsProcessed}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Errors:</span>
              <div className="font-medium text-destructive">{status.errors}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" />
            Manual Log Processing
          </CardTitle>
          <CardDescription>Upload and process Suricata EVE JSON logs manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logContent">Suricata EVE JSON Logs</Label>
            <Textarea
              id="logContent"
              placeholder="Paste Suricata EVE JSON logs here (one JSON object per line)..."
              value={logContent}
              onChange={(e) => setLogContent(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={uploadLogs} disabled={isLoading || !logContent.trim()}>
            <Upload className="h-4 w-4 mr-2" />
            Process Logs
          </Button>

          {uploadResult && (
            <>
              <Separator />
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully processed {uploadResult.totalProcessed} alerts from uploaded logs.
                  {uploadResult.alerts?.length > 0 && (
                    <span> Preview of first {uploadResult.alerts.length} alerts available in the dashboard.</span>
                  )}
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Configuration</CardTitle>
          <CardDescription>Current Suricata integration settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Log File Path:</span>
              <div className="font-mono">/var/log/suricata/eve.json</div>
            </div>
            <div>
              <span className="text-muted-foreground">Poll Interval:</span>
              <div>5 seconds</div>
            </div>
            <div>
              <span className="text-muted-foreground">Real-time Processing:</span>
              <div>Enabled</div>
            </div>
            <div>
              <span className="text-muted-foreground">Alert Format:</span>
              <div>EVE JSON</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
