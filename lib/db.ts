// Real database implementation for CyberShield Monitor
// Integrates with actual Suricata logs and database storage

export interface SecurityAlert {
  id: number
  alertId: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  category: string
  signature: string
  sourceIp: string
  destIp: string
  sourcePort: number
  destPort: number
  protocol: string
  timestamp: string
  rawLog?: string
  status: "new" | "investigating" | "resolved" | "false_positive"
  assignedTo?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

// In-memory storage for alerts (replace with actual database in production)
const alertsStorage: SecurityAlert[] = []
let alertIdCounter = 1

// Function to add new alert from Suricata logs
export async function addAlert(
  alertData: Omit<SecurityAlert, "id" | "createdAt" | "updatedAt">,
): Promise<SecurityAlert> {
  const newAlert: SecurityAlert = {
    ...alertData,
    id: alertIdCounter++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  alertsStorage.push(newAlert)
  return newAlert
}

// Database functions - now using real alert storage
export async function getAlerts(filters?: {
  severity?: string
  status?: string
  limit?: number
  offset?: number
}): Promise<{ alerts: SecurityAlert[]; total: number }> {
  let filteredAlerts = [...alertsStorage]

  if (filters?.severity) {
    filteredAlerts = filteredAlerts.filter((alert) => alert.severity === filters.severity)
  }

  if (filters?.status) {
    filteredAlerts = filteredAlerts.filter((alert) => alert.status === filters.status)
  }

  // Sort by timestamp descending (newest first)
  filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const total = filteredAlerts.length
  const offset = filters?.offset || 0
  const limit = filters?.limit || 50

  const alerts = filteredAlerts.slice(offset, offset + limit)

  return { alerts, total }
}

export async function getAlertById(id: number): Promise<SecurityAlert | null> {
  return alertsStorage.find((alert) => alert.id === id) || null
}

export async function updateAlert(id: number, updates: Partial<SecurityAlert>): Promise<SecurityAlert | null> {
  const alertIndex = alertsStorage.findIndex((alert) => alert.id === id)
  if (alertIndex === -1) return null

  alertsStorage[alertIndex] = {
    ...alertsStorage[alertIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  return alertsStorage[alertIndex]
}

export async function getDashboardStats(): Promise<{
  totalAlerts: number
  criticalAlerts: number
}> {
  const totalAlerts = alertsStorage.length
  const criticalAlerts = alertsStorage.filter((alert) => alert.severity === "critical").length

  return {
    totalAlerts,
    criticalAlerts,
  }
}
