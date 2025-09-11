// Suricata log parser for CyberShield Monitor
// Parses EVE JSON format logs from Suricata IDS/IPS

export interface SuricataAlert {
  timestamp: string
  flowId: number
  inIface: string
  eventType: string
  srcIp: string
  srcPort: number
  destIp: string
  destPort: number
  proto: string
  alert: {
    action: string
    gid: number
    signatureId: number
    rev: number
    signature: string
    category: string
    severity: number
  }
  payload?: string
  payloadPrintable?: string
  stream?: number
  packetInfo?: {
    linktype: number
  }
}

export interface ParsedAlert {
  alertId: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  category: string
  signature: string
  sourceIp: string
  destIp: string
  sourcePort: number
  destPort: number
  protocol: string
  timestamp: string
  rawLog: string
  status: "new"
}

export class SuricataLogParser {
  private severityMap: Record<number, "critical" | "high" | "medium" | "low" | "info"> = {
    1: "critical",
    2: "high",
    3: "medium",
    4: "low",
    5: "info",
  }

  /**
   * Parse a single Suricata EVE JSON log line
   */
  parseLogLine(logLine: string): ParsedAlert | null {
    try {
      const log: SuricataAlert = JSON.parse(logLine)

      // Only process alert events
      if (log.eventType !== "alert" || !log.alert) {
        return null
      }

      // Generate unique alert ID
      const alertId = `SURICATA-${log.alert.gid}-${log.alert.signatureId}-${Date.now()}`

      // Map Suricata severity to our severity levels
      const severity = this.severityMap[log.alert.severity] || "info"

      return {
        alertId,
        severity,
        category: log.alert.category || "unknown",
        signature: log.alert.signature,
        sourceIp: log.srcIp,
        destIp: log.destIp,
        sourcePort: log.srcPort,
        destPort: log.destPort,
        protocol: log.proto.toUpperCase(),
        timestamp: log.timestamp,
        rawLog: logLine,
        status: "new",
      }
    } catch (error) {
      console.error("Failed to parse Suricata log line:", error)
      return null
    }
  }

  /**
   * Parse multiple log lines from a log file or stream
   */
  parseLogFile(logContent: string): ParsedAlert[] {
    const lines = logContent.split("\n").filter((line) => line.trim())
    const alerts: ParsedAlert[] = []

    for (const line of lines) {
      const alert = this.parseLogLine(line)
      if (alert) {
        alerts.push(alert)
      }
    }

    return alerts
  }

  /**
   * Validate if a log line is valid Suricata EVE JSON format
   */
  isValidSuricataLog(logLine: string): boolean {
    try {
      const log = JSON.parse(logLine)
      return log.eventType && log.timestamp && (log.eventType === "alert" || log.eventType === "flow")
    } catch {
      return false
    }
  }

  /**
   * Extract threat indicators from alert for threat intelligence
   */
  extractThreatIndicators(alert: ParsedAlert): Array<{
    type: "ip" | "domain" | "hash" | "url"
    value: string
    context: string
  }> {
    const indicators: Array<{
      type: "ip" | "domain" | "hash" | "url"
      value: string
      context: string
    }> = []

    // Add source IP as indicator if it's external
    if (!this.isPrivateIP(alert.sourceIp)) {
      indicators.push({
        type: "ip",
        value: alert.sourceIp,
        context: `Source IP from alert: ${alert.signature}`,
      })
    }

    // Add destination IP as indicator if it's external
    if (!this.isPrivateIP(alert.destIp)) {
      indicators.push({
        type: "ip",
        value: alert.destIp,
        context: `Destination IP from alert: ${alert.signature}`,
      })
    }

    return indicators
  }

  /**
   * Check if an IP address is in private ranges
   */
  private isPrivateIP(ip: string): boolean {
    const privateRanges = [/^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./, /^127\./, /^169\.254\./]

    return privateRanges.some((range) => range.test(ip))
  }
}
