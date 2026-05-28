"use client";

import Graph from "./Graph";

interface ReportProps {
  data: any;
}

export default function Report({ data }: ReportProps) {
  if (!data) return null;

  if (data.status === "partial" || !data.results) {
    return (
      <div className="animate-fade-in glass-panel" style={{ borderTop: "4px solid var(--accent-amber)", marginTop: "24px" }}>
        <h2 style={{ marginBottom: "12px", color: "var(--accent-amber)" }}>Partial Match: {data.paper?.title}</h2>
        <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
          {data.message || "This paper was found on arXiv, but it doesn't have any public peer reviews on OpenReview. ECHO requires peer review text to run its full stylometric, entropy, and collusion ring analysis."}
        </p>
      </div>
    );
  }

  const { stylometry, specificity, collusion } = data.results;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
      <div className="glass-panel" style={{ borderTop: "4px solid var(--accent-cyan)" }}>
        <h2 style={{ marginBottom: "12px" }}>ECHO Report: {data.paper.title}</h2>
        <p className="text-secondary" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
          {data.paper.abstract.substring(0, 300)}...
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        
        {/* Stylometry Card */}
        <div className="glass-panel" style={{ borderLeft: stylometry.suspicious_matches > 0 ? "4px solid var(--accent-red)" : "4px solid var(--accent-green)" }}>
          <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            Stylometry Analysis
            {stylometry.suspicious_matches > 0 && <span className="animate-pulse text-red" style={{ fontSize: "0.8rem", background: "rgba(239, 68, 68, 0.1)", padding: "4px 8px", borderRadius: "12px" }}>High Risk</span>}
          </h3>
          <p style={{ marginBottom: "16px" }} className="text-secondary">
            Compares the latent stylistic fingerprint between the paper and its reviews.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="flex-between">
              <span>Overall Suspicion:</span>
              <strong className={stylometry.suspicion_level === "High" ? "text-red" : "text-green"}>{stylometry.overall_suspicion_level}</strong>
            </div>
            <div className="flex-between">
              <span>Suspicious Matches:</span>
              <strong className="mono">{stylometry.suspicious_matches}</strong>
            </div>
          </div>
        </div>

        {/* Specificity Card */}
        <div className="glass-panel" style={{ borderLeft: specificity.slop_ratio > 0.5 ? "4px solid var(--accent-red)" : "4px solid var(--accent-green)" }}>
          <h3 style={{ marginBottom: "16px" }}>Review Substance</h3>
          <p style={{ marginBottom: "16px" }} className="text-secondary">
            Measures specificity entropy. Generic "slop" reviews score low on domain density.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="flex-between">
              <span>Likely AI Slop Ratio:</span>
              <strong className={specificity.slop_ratio > 0.5 ? "text-red" : "text-purple"}>{(specificity.slop_ratio * 100).toFixed(0)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Collusion Graph */}
      <div className="glass-panel" style={{ borderTop: "4px solid var(--accent-purple)" }}>
        <div className="flex-between" style={{ marginBottom: "16px" }}>
          <h3>Collusion Graph</h3>
          <span className="text-secondary" style={{ fontSize: "0.9rem" }}>Detected Rings: <strong className="text-red">{collusion.ring_count}</strong></span>
        </div>
        <p style={{ marginBottom: "24px" }} className="text-secondary">
          Visualizing reviewer-author relationships. Suspicious reciprocal rings are flagged.
        </p>
        <Graph data={collusion} />
      </div>
    </div>
  );
}
