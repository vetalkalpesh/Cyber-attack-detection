import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"
import { realTimeProcessor } from "@/lib/real-time-processor"

// Global monitor instance (in production, use proper state management)
const monitorStatus = {
  isRunning: false,
  lastUpdate: new Date().toISOString(),
  alertsProcessed: 0,
  errors: 0,
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      status: monitorStatus,
      config: {
        logFilePath: process.env.SURICATA_LOG_PATH || "/var/log/suricata/eve.json",
        pollInterval: 2000, // Check every 2 seconds for real-time detection
        enableRealTimeProcessing: true,
        alertThresholds: {
          critical: 1,
          high: 3,
          medium: 5,
        },
      },
    })
  } catch (error) {
    console.error("Error getting Suricata monitor status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || (session.role !== "admin" && session.role !== "analyst")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { action } = await request.json()

    if (action === "start") {
      realTimeProcessor.startProcessing()
      monitorStatus.isRunning = true
      monitorStatus.lastUpdate = new Date().toISOString()
      console.log("[v0] Real Suricata monitoring started by:", session.username)
    } else if (action === "stop") {
      realTimeProcessor.stopProcessing()
      monitorStatus.isRunning = false
      monitorStatus.lastUpdate = new Date().toISOString()
      console.log("[v0] Real Suricata monitoring stopped by:", session.username)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      message: `Suricata monitoring ${action}ed successfully`,
      status: monitorStatus,
    })
  } catch (error) {
    console.error("Error controlling Suricata monitor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
