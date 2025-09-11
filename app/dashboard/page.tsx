import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SimplifiedStats } from "@/components/dashboard/simplified-stats"
import { AlertsTable } from "@/components/dashboard/alerts-table"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <SimplifiedStats />

        <AlertsTable />
      </main>
    </div>
  )
}
