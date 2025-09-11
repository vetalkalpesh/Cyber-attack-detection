import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock user data - replace with actual database query
    const users = [
      {
        id: 1,
        username: "admin",
        email: "admin@cybershield.com",
        role: "admin",
        firstName: "System",
        lastName: "Administrator",
        isActive: true,
        lastLogin: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        username: "analyst1",
        email: "analyst1@cybershield.com",
        role: "analyst",
        firstName: "Security",
        lastName: "Analyst",
        isActive: true,
        lastLogin: "2024-01-15T09:15:00Z",
      },
    ]

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await request.json()

    // In a real app, validate and create user in database
    const newUser = {
      id: Date.now(), // Mock ID
      ...userData,
      isActive: true,
      lastLogin: null,
    }

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
