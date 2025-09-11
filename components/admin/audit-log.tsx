"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Search, Download } from "lucide-react"

interface AuditLogEntry {
  id: number
  timestamp: string
  userId: number
  username: string
  action: string
  resourceType: string
  resourceId?: number
  details: string
  ipAddress: string
}

const mockAuditLog: AuditLogEntry[] = [
  {
    id: 1,
    timestamp: "2024-01-15T10:30:00Z",
    userId: 1,
    username: "admin",
    action: "LOGIN",
    resourceType: "user",
    details: "Successful login",
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    timestamp: "2024-01-15T10:25:00Z",
    userId: 1,
    username: "admin",
    action: "UPDATE_ALERT",
    resourceType: "alert",
    resourceId: 2,
    details: "Changed alert status from 'new' to 'investigating'",
    ipAddress: "192.168.1.100",
  },
  {
    id: 3,
    timestamp: "2024-01-15T09:15:00Z",
    userId: 2,
    username: "analyst1",
    action: "LOGIN",
    resourceType: "user",
    details: "Successful login",
    ipAddress: "192.168.1.101",
  },
  {
    id: 4,
    timestamp: "2024-01-15T09:10:00Z",
    userId: 1,
    username: "admin",
    action: "CREATE_USER",
    resourceType: "user",
    resourceId: 3,
    details: "Created new user account: viewer1",
    ipAddress: "192.168.1.100",
  },
  {
    id: 5,
    timestamp: "2024-01-15T08:45:00Z",
    userId: 1,
    username: "admin",
    action: "UPDATE_CONFIG",
    resourceType: "system",
    details: "Updated alert retention policy to 90 days",
    ipAddress: "192.168.1.100",
  },
]

export function AuditLog() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "secondary"
      case "LOGOUT":
        return "outline"
      case "CREATE_USER":
        return "default"
      case "UPDATE_ALERT":
        return "default"
      case "UPDATE_CONFIG":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "all" || entry.action === actionFilter

    return matchesSearch && matchesAction
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Audit Log
          </CardTitle>
          <CardDescription>Track all user actions and system changes</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="LOGOUT">Logout</SelectItem>
              <SelectItem value="CREATE_USER">Create User</SelectItem>
              <SelectItem value="UPDATE_ALERT">Update Alert</SelectItem>
              <SelectItem value="UPDATE_CONFIG">Update Config</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit Log Table */}
        <ScrollArea className="h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm">{formatTimestamp(entry.timestamp)}</TableCell>
                  <TableCell className="font-medium">{entry.username}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(entry.action)} className="text-xs">
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs truncate">{entry.details}</TableCell>
                  <TableCell className="text-sm font-mono">{entry.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {filteredLog.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No audit log entries found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
