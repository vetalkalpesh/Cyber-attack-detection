import { redirect } from "next/navigation"
import { verifySession } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminStats } from "@/components/admin/admin-stats"
import { UserManagement } from "@/components/admin/user-management"
import { SystemConfig } from "@/components/admin/system-config"
import { AuditLog } from "@/components/admin/audit-log"

export default async function AdminPage() {
  const session = await verifySession()

  // Only admins can access this page
  if (!session || session.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Admin Statistics */}
        <AdminStats />

        {/* Admin Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <UserManagement />

          {/* System Configuration */}
          <SystemConfig />
        </div>

        {/* Audit Log */}
        <AuditLog />
      </main>
    </div>
  )
}
