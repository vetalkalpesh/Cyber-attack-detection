import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"
import { getAlertById, updateAlert } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const alertId = Number.parseInt(params.id)
    const alert = await getAlertById(alertId)

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    return NextResponse.json({ alert })
  } catch (error) {
    console.error("Error fetching alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only analysts and admins can update alerts
    if (session.role === "viewer") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const alertId = Number.parseInt(params.id)
    const updates = await request.json()

    // Validate allowed fields
    const allowedFields = ["status", "assignedTo", "notes"]
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    const updatedAlert = await updateAlert(alertId, filteredUpdates)

    if (!updatedAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    return NextResponse.json({ alert: updatedAlert })
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
