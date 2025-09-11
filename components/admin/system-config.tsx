"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SystemSettings {
  alertRetentionDays: number
  trafficRetentionDays: number
  autoResolveLowAlerts: boolean
  emailNotifications: boolean
  dashboardRefreshInterval: number
  maxLoginAttempts: number
  sessionTimeout: number
}

export function SystemConfig() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SystemSettings>({
    alertRetentionDays: 90,
    trafficRetentionDays: 30,
    autoResolveLowAlerts: true,
    emailNotifications: true,
    dashboardRefreshInterval: 30,
    maxLoginAttempts: 5,
    sessionTimeout: 480, // 8 hours in minutes
  })

  const handleSave = () => {
    // In a real app, this would make an API call
    toast({
      title: "Settings saved",
      description: "System configuration has been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          System Configuration
        </CardTitle>
        <CardDescription>Configure system-wide settings and policies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Retention */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Data Retention</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alertRetention">Alert Retention (days)</Label>
              <Input
                id="alertRetention"
                type="number"
                value={settings.alertRetentionDays}
                onChange={(e) =>
                  setSettings({ ...settings, alertRetentionDays: Number.parseInt(e.target.value) || 90 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trafficRetention">Traffic Retention (days)</Label>
              <Input
                id="trafficRetention"
                type="number"
                value={settings.trafficRetentionDays}
                onChange={(e) =>
                  setSettings({ ...settings, trafficRetentionDays: Number.parseInt(e.target.value) || 30 })
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Alert Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Alert Settings</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-resolve Low Alerts</Label>
              <p className="text-sm text-muted-foreground">Automatically resolve low severity alerts after 24 hours</p>
            </div>
            <Switch
              checked={settings.autoResolveLowAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, autoResolveLowAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email alerts for critical security events</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
        </div>

        <Separator />

        {/* Performance Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Performance Settings</h4>
          <div className="space-y-2">
            <Label htmlFor="refreshInterval">Dashboard Refresh Interval (seconds)</Label>
            <Input
              id="refreshInterval"
              type="number"
              value={settings.dashboardRefreshInterval}
              onChange={(e) =>
                setSettings({ ...settings, dashboardRefreshInterval: Number.parseInt(e.target.value) || 30 })
              }
            />
          </div>
        </div>

        <Separator />

        {/* Security Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Security Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number.parseInt(e.target.value) || 5 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) || 480 })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
