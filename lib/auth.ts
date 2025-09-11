import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const key = new TextEncoder().encode(secretKey)

export interface User {
  id: number
  username: string
  email: string
  role: "admin" | "analyst" | "viewer"
  firstName: string
  lastName: string
  isActive: boolean
}

export interface SessionPayload {
  userId: number
  username: string
  role: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    })
    return payload as SessionPayload
  } catch (error) {
    console.log("Failed to verify session")
    return null
  }
}

export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function verifySession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("session")?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return null
  }

  return {
    userId: session.userId,
    username: session.username,
    role: session.role,
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Mock database functions (replace with actual database calls)
export async function getUserByEmail(email: string): Promise<User | null> {
  // This would typically query your database
  // For now, returning mock data
  const mockUsers: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@cybershield.com",
      role: "admin",
      firstName: "System",
      lastName: "Administrator",
      isActive: true,
    },
    {
      id: 2,
      username: "analyst1",
      email: "analyst1@cybershield.com",
      role: "analyst",
      firstName: "Security",
      lastName: "Analyst",
      isActive: true,
    },
  ]

  return mockUsers.find((user) => user.email === email) || null
}

export async function getUserById(id: number): Promise<User | null> {
  // This would typically query your database
  const mockUsers: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@cybershield.com",
      role: "admin",
      firstName: "System",
      lastName: "Administrator",
      isActive: true,
    },
    {
      id: 2,
      username: "analyst1",
      email: "analyst1@cybershield.com",
      role: "analyst",
      firstName: "Security",
      lastName: "Analyst",
      isActive: true,
    },
  ]

  return mockUsers.find((user) => user.id === id) || null
}
