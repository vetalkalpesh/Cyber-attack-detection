import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"
import { getAlerts } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get("severity") || undefined
    const status = searchParams.get("status") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get alerts with filters
    const { alerts, total } = await getAlerts({
      severity,
      status,
      limit,
      offset,
    })

    return NextResponse.json({
      alerts,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
