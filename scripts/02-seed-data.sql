-- Seeding initial data for CyberShield Monitor
-- Insert default admin user (password: admin123 - should be changed in production)
INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES
('admin', 'admin@cybershield.com', '$2b$10$rQZ8kHWKQYXyQqGqGqGqGe7KQqGqGqGqGqGqGqGqGqGqGqGqGqGqG', 'admin', 'System', 'Administrator'),
('analyst1', 'analyst1@cybershield.com', '$2b$10$rQZ8kHWKQYXyQqGqGqGqGe7KQqGqGqGqGqGqGqGqGqGqGqGqGqGqG', 'analyst', 'Security', 'Analyst'),
('viewer1', 'viewer1@cybershield.com', '$2b$10$rQZ8kHWKQYXyQqGqGqGqGe7KQqGqGqGqGqGqGqGqGqGqGqGqGqGqG', 'viewer', 'Read', 'Only');

-- Insert sample network devices
INSERT INTO network_devices (device_name, ip_address, device_type, location, status) VALUES
('Main Firewall', '192.168.1.1', 'firewall', 'Data Center A', 'active'),
('Core Switch', '192.168.1.2', 'switch', 'Data Center A', 'active'),
('Web Server 1', '192.168.1.10', 'server', 'DMZ', 'active'),
('Web Server 2', '192.168.1.11', 'server', 'DMZ', 'active'),
('Database Server', '192.168.1.20', 'server', 'Internal Network', 'active'),
('Backup Router', '192.168.1.254', 'router', 'Data Center B', 'maintenance');

-- Insert sample security alerts
INSERT INTO security_alerts (alert_id, severity, category, signature, source_ip, dest_ip, source_port, dest_port, protocol, timestamp, status) VALUES
('ALERT-001', 'critical', 'malware', 'ET MALWARE Suspicious DNS Query', '203.0.113.45', '192.168.1.10', 53421, 53, 'UDP', NOW() - INTERVAL '2 hours', 'investigating'),
('ALERT-002', 'high', 'intrusion', 'ET SCAN Potential SSH Brute Force', '198.51.100.23', '192.168.1.20', 45231, 22, 'TCP', NOW() - INTERVAL '1 hour', 'new'),
('ALERT-003', 'medium', 'policy-violation', 'ET POLICY Suspicious User Agent', '192.168.1.50', '203.0.113.100', 54321, 80, 'TCP', NOW() - INTERVAL '30 minutes', 'new'),
('ALERT-004', 'low', 'info', 'ET INFO Session Traversal Utilities for NAT', '192.168.1.25', '198.51.100.50', 3478, 3478, 'UDP', NOW() - INTERVAL '15 minutes', 'resolved');

-- Insert sample network traffic data
INSERT INTO network_traffic (device_id, timestamp, bytes_in, bytes_out, packets_in, packets_out, connections_active) VALUES
(1, NOW() - INTERVAL '1 hour', 1048576000, 524288000, 750000, 500000, 1250),
(1, NOW() - INTERVAL '30 minutes', 1073741824, 536870912, 800000, 550000, 1300),
(1, NOW(), 1099511627776, 549755813888, 850000, 600000, 1400),
(3, NOW() - INTERVAL '1 hour', 524288000, 1048576000, 400000, 600000, 850),
(3, NOW() - INTERVAL '30 minutes', 536870912, 1073741824, 450000, 650000, 900),
(3, NOW(), 549755813888, 1099511627776, 500000, 700000, 950);

-- Insert sample threat intelligence
INSERT INTO threat_intelligence (indicator_type, indicator_value, threat_type, confidence_level, source, description, first_seen, last_seen) VALUES
('ip', '203.0.113.45', 'malware', 95, 'ThreatFeed Pro', 'Known C2 server for banking trojan', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 hours'),
('domain', 'malicious-site.example', 'phishing', 85, 'PhishTank', 'Phishing site targeting financial institutions', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('hash', 'a1b2c3d4e5f6789012345678901234567890abcd', 'malware', 90, 'VirusTotal', 'Ransomware payload hash', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
('url', 'http://suspicious-download.example/payload.exe', 'malware', 80, 'URLVoid', 'Malware distribution URL', NOW() - INTERVAL '2 days', NOW() - INTERVAL '6 hours');

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description, updated_by) VALUES
('alert_retention_days', '90', 'Number of days to retain security alerts', 1),
('traffic_retention_days', '30', 'Number of days to retain network traffic data', 1),
('auto_resolve_low_alerts', 'true', 'Automatically resolve low severity alerts after 24 hours', 1),
('email_notifications', 'true', 'Enable email notifications for critical alerts', 1),
('dashboard_refresh_interval', '30', 'Dashboard refresh interval in seconds', 1);
