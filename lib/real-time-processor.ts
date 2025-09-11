import { SuricataMonitor } from "./suricata-monitor"
import type { ParsedAlert } from "./suricata-parser"
import { addAlert } from "./db"

export class RealTimeAlertProcessor {
  private monitor: SuricataMonitor
  private alertQueue: ParsedAlert[] = []
  private subscribers: ((alerts: ParsedAlert[]) => void)[] = []

  constructor(logFilePath = process.env.SURICATA_LOG_PATH || "/var/log/suricata/eve.json") {
    this.monitor = new SuricataMonitor({
      logFilePath,
      pollInterval: 2000,
      enableRealTimeProcessing: true,
      alertThresholds: {
        critical: 1,
        high: 3,
        medium: 5,
      },
    })

    // Set up event listeners
    this.monitor.on("new-alert", async (alert: ParsedAlert) => {
      try {
        await addAlert({
          alertId: alert.alertId,
          severity: alert.severity,
          category: alert.category,
          signature: alert.signature,
          sourceIp: alert.sourceIp,
          destIp: alert.destIp,
          sourcePort: alert.sourcePort,
          destPort: alert.destPort,
          protocol: alert.protocol,
          timestamp: alert.timestamp,
          rawLog: alert.rawLog,
          status: "new",
        })

        this.alertQueue.push(alert)
        this.notifySubscribers()
        console.log(`[v0] Real alert stored: ${alert.signature} from ${alert.sourceIp}`)
      } catch (error) {
        console.error("[v0] Error storing alert:", error)
      }
    })

    this.monitor.on("critical-alert", async (alert: ParsedAlert) => {
      console.log(`[CRITICAL ALERT] ${alert.signature} from ${alert.sourceIp}`)
      try {
        await addAlert({
          alertId: alert.alertId,
          severity: alert.severity,
          category: alert.category,
          signature: alert.signature,
          sourceIp: alert.sourceIp,
          destIp: alert.destIp,
          sourcePort: alert.sourcePort,
          destPort: alert.destPort,
          protocol: alert.protocol,
          timestamp: alert.timestamp,
          rawLog: alert.rawLog,
          status: "new",
        })
      } catch (error) {
        console.error("[v0] Error storing critical alert:", error)
      }

      // Immediate notification for critical alerts
      this.notifySubscribers([alert])
    })
  }

  startProcessing(): void {
    this.monitor.startMonitoring()
  }

  stopProcessing(): void {
    this.monitor.stopMonitoring()
  }

  subscribe(callback: (alerts: ParsedAlert[]) => void): () => void {
    this.subscribers.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  private notifySubscribers(alerts?: ParsedAlert[]): void {
    const alertsToSend = alerts || [...this.alertQueue]
    if (alertsToSend.length > 0) {
      this.subscribers.forEach((callback) => callback(alertsToSend))
      if (!alerts) {
        this.alertQueue = [] // Clear queue after sending
      }
    }
  }

  getRecentAlerts(limit = 50): ParsedAlert[] {
    return this.alertQueue.slice(-limit)
  }
}

// Global instance for the application
export const realTimeProcessor = new RealTimeAlertProcessor()
