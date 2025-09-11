// Suricata log monitoring and real-time processing
import { SuricataLogParser, type ParsedAlert } from "./suricata-parser"
import { EventEmitter } from "events"

export interface SuricataConfig {
  logFilePath: string
  pollInterval: number // milliseconds
  enableRealTimeProcessing: boolean
  alertThresholds: {
    critical: number
    high: number
    medium: number
  }
}

export class SuricataMonitor extends EventEmitter {
  private parser: SuricataLogParser
  private config: SuricataConfig
  private isMonitoring = false
  private lastProcessedPosition = 0
  private monitorInterval?: NodeJS.Timeout

  constructor(config: SuricataConfig) {
    super()
    this.parser = new SuricataLogParser()
    this.config = config
  }

  /**
   * Start monitoring Suricata logs
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log("Suricata monitoring is already running")
      return
    }

    console.log("Starting Suricata log monitoring...")
    this.isMonitoring = true

    // In a real implementation, this would monitor actual log files
    // For demo purposes, we'll simulate log processing
    this.monitorInterval = setInterval(() => {
      this.processNewLogs()
    }, this.config.pollInterval)

    this.emit("monitoring-started")
  }

  /**
   * Stop monitoring Suricata logs
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return
    }

    console.log("Stopping Suricata log monitoring...")
    this.isMonitoring = false

    if (this.monitorInterval) {
      clearInterval(this.monitorInterval)
      this.monitorInterval = undefined
    }

    this.emit("monitoring-stopped")
  }

  /**
   * Process new log entries from actual Suricata eve.json file
   */
  private async processNewLogs(): Promise<void> {
    try {
      if (typeof window === "undefined") {
        // Server-side: Read actual Suricata log file
        const fs = await import("fs")
        const path = await import("path")

        if (fs.existsSync(this.config.logFilePath)) {
          const stats = fs.statSync(this.config.logFilePath)
          const currentSize = stats.size

          if (currentSize > this.lastProcessedPosition) {
            // Read only new content since last position
            const stream = fs.createReadStream(this.config.logFilePath, {
              start: this.lastProcessedPosition,
              end: currentSize,
            })

            let buffer = ""
            stream.on("data", (chunk) => {
              buffer += chunk.toString()
            })

            stream.on("end", () => {
              const lines = buffer.split("\n").filter((line) => line.trim())

              for (const line of lines) {
                if (this.parser.isValidSuricataLog(line)) {
                  const alert = this.parser.parseLogLine(line)
                  if (alert) {
                    this.processAlert(alert)
                  }
                }
              }

              this.lastProcessedPosition = currentSize
            })
          }
        }
      } else {
        // Client-side: Use simulated data for demo
        const simulatedLogs = this.generateSimulatedLogs()
        for (const logLine of simulatedLogs) {
          const alert = this.parser.parseLogLine(logLine)
          if (alert) {
            await this.processAlert(alert)
          }
        }
      }
    } catch (error) {
      console.error("Error processing Suricata logs:", error)
      this.emit("error", error)
    }
  }

  /**
   * Process a single alert
   */
  private processAlert(alert: ParsedAlert): void {
    // Emit alert event for real-time processing
    this.emit("new-alert", alert)

    // Check if alert exceeds thresholds
    if (this.shouldTriggerNotification(alert)) {
      this.emit("critical-alert", alert)
    }

    // Extract threat indicators
    const indicators = this.parser.extractThreatIndicators(alert)
    if (indicators.length > 0) {
      this.emit("threat-indicators", indicators)
    }

    console.log(`Processed alert: ${alert.signature} (${alert.severity})`)
  }

  /**
   * Check if alert should trigger notifications
   */
  private shouldTriggerNotification(alert: ParsedAlert): boolean {
    const thresholds = this.config.alertThresholds

    switch (alert.severity) {
      case "critical":
        return true // Always notify for critical
      case "high":
        return Math.random() > 0.7 // 30% chance for demo
      case "medium":
        return Math.random() > 0.9 // 10% chance for demo
      default:
        return false
    }
  }

  /**
   * Generate simulated Suricata logs for demo purposes
   */
  private generateSimulatedLogs(): string[] {
    const sampleLogs = [
      {
        timestamp: new Date().toISOString(),
        flow_id: Math.floor(Math.random() * 1000000),
        in_iface: "eth0",
        event_type: "alert",
        src_ip: "203.0.113.45",
        src_port: Math.floor(Math.random() * 65535),
        dest_ip: "192.168.1.10",
        dest_port: 80,
        proto: "TCP",
        alert: {
          action: "allowed",
          gid: 1,
          signature_id: Math.floor(Math.random() * 10000),
          rev: 1,
          signature: "ET MALWARE Suspicious DNS Query to Known Bad Domain",
          category: "Trojan",
          severity: Math.floor(Math.random() * 3) + 1,
        },
      },
      {
        timestamp: new Date().toISOString(),
        flow_id: Math.floor(Math.random() * 1000000),
        in_iface: "eth0",
        event_type: "alert",
        src_ip: "198.51.100.23",
        src_port: Math.floor(Math.random() * 65535),
        dest_ip: "192.168.1.20",
        dest_port: 22,
        proto: "TCP",
        alert: {
          action: "allowed",
          gid: 1,
          signature_id: Math.floor(Math.random() * 10000),
          rev: 1,
          signature: "ET SCAN Potential SSH Brute Force Attack",
          category: "Attempted-Admin",
          severity: 2,
        },
      },
    ]

    // Randomly return 0-2 logs to simulate varying activity
    const numLogs = Math.floor(Math.random() * 3)
    return sampleLogs.slice(0, numLogs).map((log) => JSON.stringify(log))
  }

  /**
   * Get monitoring status
   */
  getStatus(): {
    isMonitoring: boolean
    lastProcessedPosition: number
    config: SuricataConfig
  } {
    return {
      isMonitoring: this.isMonitoring,
      lastProcessedPosition: this.lastProcessedPosition,
      config: this.config,
    }
  }
}
