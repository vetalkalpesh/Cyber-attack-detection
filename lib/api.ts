// API client functions for CyberShield Monitor

export interface ApiResponse<T> {
  data?: T
  error?: string
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || "An error occurred" }
    }

    return { data }
  } catch (error) {
    return { error: "Network error" }
  }
}

// Alert API functions
export async function fetchAlerts(filters?: {
  severity?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const params = new URLSearchParams()
  if (filters?.severity) params.append("severity", filters.severity)
  if (filters?.status) params.append("status", filters.status)
  if (filters?.limit) params.append("limit", filters.limit.toString())
  if (filters?.offset) params.append("offset", filters.offset.toString())

  return apiRequest(`/api/alerts?${params.toString()}`)
}

export async function fetchAlert(id: number) {
  return apiRequest(`/api/alerts/${id}`)
}

export async function updateAlert(id: number, updates: any) {
  return apiRequest(`/api/alerts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  })
}

// Device API functions
export async function fetchDevices() {
  return apiRequest("/api/devices")
}

export async function fetchDevice(id: number) {
  return apiRequest(`/api/devices/${id}`)
}

// Traffic API functions
export async function fetchNetworkTraffic(deviceId?: number, hours?: number) {
  const params = new URLSearchParams()
  if (deviceId) params.append("deviceId", deviceId.toString())
  if (hours) params.append("hours", hours.toString())

  return apiRequest(`/api/traffic?${params.toString()}`)
}

// Dashboard API functions
export async function fetchDashboardStats() {
  return apiRequest("/api/dashboard/stats")
}
