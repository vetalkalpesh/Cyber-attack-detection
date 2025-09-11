import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"
import { SuricataLogParser } from "@/lib/suricata-parser"

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || (session.role !== "admin" && session.role !== "analyst")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { logContent } = await request.json()

    if (!logContent) {
      return NextResponse.json({ error: "Log content is required" }, { status: 400 })
    }

    const parser = new SuricataLogParser()
    const alerts = parser.parseLogFile(logContent)

    // In a real implementation, save alerts to database here
    console.log(`Processed ${alerts.length} alerts from uploaded logs`)

    return NextResponse.json({
      message: `Successfully processed ${alerts.length} alerts`,
      alerts: alerts.slice(0, 10), // Return first 10 for preview
      totalProcessed: alerts.length,
    })
  } catch (error) {
    console.error("Error processing Suricata logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
