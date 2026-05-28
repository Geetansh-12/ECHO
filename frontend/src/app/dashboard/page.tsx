"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  Search, 
  Activity, 
  ShieldAlert, 
  Loader2, 
  LayoutDashboard, 
  Database, 
  LogOut,
  Brain,
  Network,
  FileWarning,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye
} from "lucide-react";

import Report from "../../components/Report";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setReportData(null);

    try {
      const response = await axios.post("http://localhost:8000/api/analyze", {
        query: query
      });
      setReportData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred connecting to the ECHO backend.");
    } finally {
      setLoading(false);
    }
  };

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
            borderRadius: "8px", background: "rgba(6, 182, 212, 0.1)", color: "var(--text-primary)",
            textDecoration: "none", fontWeight: 500, border: "1px solid rgba(6, 182, 212, 0.2)"
          }}>
            <LayoutDashboard size={20} className="text-cyan" /> Dashboard
          </Link>
          <Link href="/explorer" style={{ 
            display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", 
            borderRadius: "8px", color: "var(--text-secondary)", textDecoration: "none",
            transition: "all 0.2s"
          }} className="hover:text-primary">
            <Database size={20} /> Explorer
          </Link>
          <Link href="#" style={{ 
            display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", 
            borderRadius: "8px", color: "var(--text-secondary)", textDecoration: "none",
            transition: "all 0.2s"
          }} className="hover:text-primary">
            <Activity size={20} /> Sources
          </Link>
        </nav>

        <div style={{ padding: "24px 16px", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>
              A
            </div>
            <span>Admin</span>
            <LogOut size={16} style={{ marginLeft: "auto" }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: "260px", flex: 1, padding: "40px", background: "var(--bg-dark)" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "8px", color: "var(--text-primary)" }}>Know what&apos;s real.</h1>
            <p className="text-secondary" style={{ fontSize: "1.1rem" }}>Inspect peer reviews across OpenReview, arXiv, and Semantic Scholar.</p>
          </div>
        </header>

        {/* Search Bar */}
        <section style={{ marginBottom: "40px" }}>
          <form onSubmit={handleSearch} style={{ position: "relative", maxWidth: "800px" }}>
            <div style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: "52px", paddingRight: "160px", width: "100%", background: "var(--bg-card)" }}
              placeholder="Enter Paper Title or ArXiv ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)" }}>
              <button type="submit" className="primary-btn" disabled={loading || !query} style={{ padding: "10px 24px" }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
                Analyze
              </button>
            </div>
          </form>
          {error && <div style={{ marginTop: "16px", color: "var(--accent-red)" }}>{error}</div>}
        </section>

        {/* Analysis Results */}
        {loading && (
          <div className="flex-center" style={{ flexDirection: "column", gap: "16px", padding: "60px 0", color: "var(--text-secondary)" }}>
            <div className="animate-pulse">
              <Loader2 size={48} className="text-purple animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <p>Running stylometric fingerprinting and collusion detection...</p>
          </div>
        )}

        {!loading && reportData && (
          <div style={{ marginBottom: "60px" }}>
             <Report data={reportData} />
          </div>
        )}

        {/* Stat Cards */}
        {!reportData && !loading && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "48px" }}>
              {[
                { title: "Papers Analyzed", value: "1,204", icon: FileWarning, color: "var(--accent-cyan)" },
                { title: "Slop Reviews", value: "342", icon: Brain, color: "var(--accent-red)" },
                { title: "Collusion Rings", value: "14", icon: Network, color: "var(--accent-purple)" },
                { title: "Avg Specificity", value: "6.8/10", icon: TrendingUp, color: "var(--accent-green)" }
              ].map((stat, i) => (
                <div key={i} className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", borderTop: `3px solid ${stat.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="text-secondary" style={{ fontSize: "0.9rem" }}>{stat.title}</span>
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                  <strong className="mono" style={{ fontSize: "2rem", color: "var(--text-primary)" }}>{stat.value}</strong>
                </div>
              ))}
            </div>

            {/* Risk Lanes */}
            <div>
              <h2 style={{ marginBottom: "24px", fontSize: "1.5rem" }}>Daily Autopsy Queue</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                
                {/* High Risk */}
                <div>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-red)", marginBottom: "16px", fontSize: "1rem" }}>
                    <AlertTriangle size={18} /> High Risk (Action Required)
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="glass-panel" style={{ padding: "16px", borderLeft: "4px solid var(--accent-red)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span className="mono text-red" style={{ fontSize: "0.8rem", background: "rgba(239, 68, 68, 0.1)", padding: "2px 8px", borderRadius: "12px" }}>Match: 94%</span>
                        <span className="text-secondary" style={{ fontSize: "0.8rem" }}>ICLR 2024</span>
                      </div>
                      <h4 style={{ fontSize: "0.95rem", marginBottom: "8px" }}>Attention Is All You Need</h4>
                      <p className="text-secondary" style={{ fontSize: "0.85rem", marginBottom: "12px" }}>Stylometric fingerprint match detected between Author 2 and Reviewer 4.</p>
                      <button className="ghost-btn" style={{ width: "100%", padding: "8px", fontSize: "0.85rem" }}><Eye size={14}/> Inspect Graph</button>
                    </div>
                  </div>
                </div>

                {/* Medium Risk */}
                <div>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", marginBottom: "16px", fontSize: "1rem" }}>
                    <Activity size={18} /> Medium Risk (Monitor)
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="glass-panel" style={{ padding: "16px", borderLeft: "4px solid #f59e0b" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span className="mono" style={{ color: "#f59e0b", fontSize: "0.8rem", background: "rgba(245, 158, 11, 0.1)", padding: "2px 8px", borderRadius: "12px" }}>Low Entropy</span>
                        <span className="text-secondary" style={{ fontSize: "0.8rem" }}>CVPR 2024</span>
                      </div>
                      <h4 style={{ fontSize: "0.95rem", marginBottom: "8px" }}>Denoising Diffusion Probabilistic Models</h4>
                      <p className="text-secondary" style={{ fontSize: "0.85rem", marginBottom: "12px" }}>Review 2 shows generic phrasing with low specificity entropy (4.2).</p>
                      <button className="ghost-btn" style={{ width: "100%", padding: "8px", fontSize: "0.85rem" }}><Eye size={14}/> Inspect Report</button>
                    </div>
                  </div>
                </div>

                {/* Low Risk */}
                <div>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-green)", marginBottom: "16px", fontSize: "1rem" }}>
                    <CheckCircle size={18} /> Low Risk (Clean)
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="glass-panel" style={{ padding: "16px", borderLeft: "4px solid var(--accent-green)", opacity: 0.7 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span className="mono text-green" style={{ fontSize: "0.8rem", background: "rgba(34, 197, 94, 0.1)", padding: "2px 8px", borderRadius: "12px" }}>Verified</span>
                        <span className="text-secondary" style={{ fontSize: "0.8rem" }}>NeurIPS 2023</span>
                      </div>
                      <h4 style={{ fontSize: "0.95rem", marginBottom: "8px" }}>BERT: Pre-training of Deep Bidirectional Transformers</h4>
                      <p className="text-secondary" style={{ fontSize: "0.85rem", marginBottom: "12px" }}>No anomalies detected. High specificity and distinct stylometry.</p>
                      <button className="ghost-btn" style={{ width: "100%", padding: "8px", fontSize: "0.85rem" }}><Eye size={14}/> View Logs</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
