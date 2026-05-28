"use client";

import Link from "next/link";
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

export default function Sources() {
  const sources = [
    {
      id: "openreview",
      name: "OpenReview API",
      status: "Connected",
      statusColor: "var(--accent-green)",
      icon: <Globe className="text-cyan" size={24} />,
      desc: "Live access to paper metadata, abstract submissions, and anonymous peer reviews.",
      lastSync: "Just now",
      metrics: "15.2M records"
    },
    {
      id: "arxiv",
      name: "arXiv Metadata Repository",
      status: "Connected",
      statusColor: "var(--accent-green)",
      icon: <FileText className="text-purple" size={24} />,
      desc: "Used for cross-referencing author histories, prior publications, and domain categorization.",
      lastSync: "2 mins ago",
      metrics: "2.4M preprints"
    },
    {
      id: "semanticscholar",
      name: "Semantic Scholar Graph",
      status: "Connected",
      statusColor: "var(--accent-green)",
      icon: <Network className="text-red" size={24} />,
      desc: "Fetches citation graphs, h-indexes, and influential paper linking for author profiling.",
      lastSync: "5 mins ago",
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
        <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)" }}>
          <ShieldAlert className="text-cyan" size={28} />
          <h2 style={{ margin: 0, fontSize: "1.5rem", letterSpacing: "0.1em" }} className="text-gradient">ECHO</h2>
        </div>
        
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
            Monitor the status of ECHO&apos;s cross-source data ingestion pipelines.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", maxWidth: "1200px" }}>
          {sources.map((source) => (
            <div key={source.id} className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", borderTop: "2px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {source.icon}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(34, 197, 94, 0.1)", padding: "4px 12px", borderRadius: "16px", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: source.statusColor, boxShadow: `0 0 10px ${source.statusColor}` }}></div>
                  <span className="mono" style={{ fontSize: "0.8rem", color: source.statusColor, fontWeight: "600" }}>{source.status}</span>
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
                  <span className="text-muted">Volume:</span> <span className="mono">{source.metrics}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
