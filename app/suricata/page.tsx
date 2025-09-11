import { redirect } from "next/navigation"
import { verifySession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SuricataMonitor } from "@/components/suricata/suricata-monitor"

export default async function SuricataPage() {
  const session = await verifySession()

  // Only analysts and admins can access Suricata integration
  if (!session || session.role === "viewer") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Suricata Integration</h1>
          <p className="text-muted-foreground">
            Monitor and process Suricata IDS/IPS logs for real-time threat detection
          </p>
        </div>

        <SuricataMonitor />
      </main>
    </div>
  )
}
