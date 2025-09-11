"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Shield } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Title and Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-accent" />
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
              </div>
              <Badge variant="destructive" className="text-xs">
                ADMIN ACCESS
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
