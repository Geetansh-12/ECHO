"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  Database, 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  LogOut,
  Globe,
  FileText,
  Network
} from "lucide-react";

type SourceHealth = {
  status: "connected" | "degraded" | "disconnected";
  http_code?: number;
  reason?: string;
};

export default function Sources() {
  const [health, setHealth] = useState<Record<string, SourceHealth>>({});
  const [checkedAt, setCheckedAt] = useState("Checking...");

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await axios.get<{ sources: Record<string, SourceHealth> }>("/api/sources/health");
        setHealth(response.data.sources || {});
        setCheckedAt(new Date().toLocaleTimeString());
      } catch {
        setCheckedAt("Unavailable");
      }
    };

    const timeoutId = window.setTimeout(() => void loadHealth(), 0);
    const timer = window.setInterval(() => void loadHealth(), 20000);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(timer);
    };
  }, []);

  const sources = [
    {
      id: "openreview",
      name: "OpenReview API",
      icon: <Globe className="text-cyan" size={24} />,
      desc: "Live access to paper metadata, abstract submissions, and anonymous peer reviews.",
      lastSync: checkedAt,
      metrics: "15.2M records"
    },
    {
      id: "arxiv",
      name: "arXiv Metadata Repository",
      icon: <FileText className="text-purple" size={24} />,
      desc: "Used for cross-referencing author histories, prior publications, and domain categorization.",
      lastSync: checkedAt,
      metrics: "2.4M preprints"
    },
    {
      id: "semantic_scholar",
      name: "Semantic Scholar Graph",
      icon: <Network className="text-red" size={24} />,
      desc: "Fetches citation graphs, h-indexes, and influential paper linking for author profiling.",
      lastSync: checkedAt,
      metrics: "215M papers"
    }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "260px", 
        borderRight: "1px solid var(--border-color)", 
        background: "rgba(10, 10, 15, 0.95)",
        display: "flex", 
        flexDirection: "column",
        position: "fixed",
        top: 0, bottom: 0, left: 0,
        zIndex: 10
      }}>
        <Link href="/" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)", textDecoration: "none" }}>
          <ShieldAlert className="text-cyan" size={28} />
          <h2 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "0.1em" }} className="text-gradient">ECHO</h2>
        </Link>
        
        <nav style={{ padding: "24px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link href="/dashboard" style={{ 
            display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", 
            borderRadius: "8px", color: "var(--text-secondary)", textDecoration: "none",
            transition: "all 0.2s"
          }} className="hover:text-primary">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/explorer" style={{ 
            display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", 
            borderRadius: "8px", color: "var(--text-secondary)", textDecoration: "none",
            transition: "all 0.2s"
          }} className="hover:text-primary">
            <Database size={20} /> Explorer
          </Link>
          <Link href="/sources" style={{ 
            display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", 
            borderRadius: "8px", background: "rgba(244, 63, 94, 0.1)", color: "var(--text-primary)",
            textDecoration: "none", fontWeight: 500, border: "1px solid rgba(244, 63, 94, 0.2)"
          }}>
            <Activity size={20} className="text-red" /> Sources
          </Link>
        </nav>

        <div style={{ padding: "24px 16px", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-red)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>
              A
            </div>
            <span>Admin</span>
            <LogOut size={16} style={{ marginLeft: "auto" }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: "260px", flex: 1, padding: "40px", background: "var(--bg-dark)" }}>
        
        <header style={{ marginBottom: "40px", maxWidth: "900px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "16px", color: "var(--text-primary)" }}>Data Operations</h1>
          <p className="text-secondary" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
            Live health checks for ECHO&apos;s cross-source data ingestion pipelines. Connected means the API responded, Rate limited means the provider is reachable but temporarily throttling requests, and Offline means the probe could not reach it.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", maxWidth: "1200px" }}>
          {sources.map((source) => {
            const itemHealth = health[source.id];
            const status = itemHealth?.status || "degraded";
            const statusLabel =
              status === "connected"
                ? "Connected"
                : status === "degraded"
                  ? itemHealth?.reason === "Rate limited" ? "Rate limited" : "Limited"
                  : "Offline";
            const statusColor =
              status === "connected"
                ? "var(--accent-green)"
                : status === "degraded"
                  ? "#f59e0b"
                  : "var(--accent-red)";
            const chipBackground =
              status === "connected"
                ? "rgba(34, 197, 94, 0.1)"
                : status === "degraded"
                  ? "rgba(245, 158, 11, 0.1)"
                  : "rgba(239, 68, 68, 0.1)";
            const chipBorder =
              status === "connected"
                ? "1px solid rgba(34, 197, 94, 0.2)"
                : status === "degraded"
                  ? "1px solid rgba(245, 158, 11, 0.2)"
                  : "1px solid rgba(239, 68, 68, 0.2)";
            const healthLabel =
              itemHealth?.reason === "Rate limited"
                ? "Provider throttled requests"
                : itemHealth?.reason === "API reachable"
                  ? itemHealth.http_code === 400
                    ? "Reachable probe"
                    : "Reachable"
                  : itemHealth?.reason || "Checking source";

            return (
            <div key={source.id} className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", borderTop: "2px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {source.icon}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: chipBackground, padding: "4px 12px", borderRadius: "16px", border: chipBorder }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusColor, boxShadow: `0 0 10px ${statusColor}` }}></div>
                  <span className="mono" style={{ fontSize: "0.8rem", color: statusColor, fontWeight: "600" }}>{statusLabel}</span>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", color: "var(--text-primary)" }}>{source.name}</h3>
                <p className="text-secondary" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{source.desc}</p>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <div>
                  <span className="text-muted">Last Sync:</span> <span className="text-primary">{source.lastSync}</span>
                </div>
                <div>
                  <span className="text-muted">Health:</span>{" "}
                  <span className="mono">
                    {itemHealth?.http_code ? `${healthLabel} (HTTP ${itemHealth.http_code})` : healthLabel}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
