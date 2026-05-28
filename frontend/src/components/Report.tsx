"use client";

import Graph from "./Graph";

interface ReportProps {
  data: {
    status: string;
    message?: string;
    paper?: {
      title?: string;
      abstract?: string;
    };
    results?: {
      stylometry: {
        suspicious_matches: number;
        overall_suspicion_level: string;
        details?: { review_id: string; is_suspicious: boolean; similarity_score: number }[];
      };
      specificity: {
        slop_ratio: number;
      };
      collusion: {
        ring_count: number;
        nodes: { id: string; type: string; title?: string }[];
        links: { source: string; target: string; relation: string }[];
      };
    };
    risk_assessment?: {
      risk_score: number;
      verdict: string;
      components?: {
        stylometry: number;
        specificity: number;
        collusion: number;
      };
      top_findings?: string[];
      recommendations?: string[];
    };
  };
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
  const risk = data.risk_assessment;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `echo-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
      <div className="glass-panel" style={{ borderTop: "4px solid var(--accent-cyan)" }}>
        <div className="flex-between" style={{ gap: "12px", marginBottom: "12px" }}>
          <h2 style={{ marginBottom: "0" }}>ECHO Report: {data.paper.title}</h2>
          <button className="ghost-btn" onClick={handleExport}>Export JSON</button>
        </div>
        <p className="text-secondary" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
          {data.paper.abstract.substring(0, 300)}...
        </p>
      </div>

      {risk && (
        <div className="glass-panel" style={{ borderTop: "4px solid var(--accent-amber)" }}>
          <div className="flex-between" style={{ marginBottom: "10px" }}>
            <h3>Forensic Risk Verdict</h3>
            <strong className="mono" style={{ color: "var(--text-primary)" }}>{risk.risk_score}/100</strong>
          </div>
          <p style={{ marginBottom: "10px" }} className="text-secondary">
            Overall verdict: <strong>{risk.verdict}</strong>
          </p>
          <p className="text-secondary" style={{ marginBottom: "12px" }}>
            Components - Stylometry: {risk.components?.stylometry}, Specificity: {risk.components?.specificity}, Collusion: {risk.components?.collusion}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            <div>
              <h4 style={{ marginBottom: "6px", fontSize: "0.95rem" }}>Top Findings</h4>
              <ul style={{ margin: 0, paddingLeft: "16px", color: "var(--text-secondary)" }}>
                {(risk.top_findings || []).map((finding: string) => <li key={finding}>{finding}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: "6px", fontSize: "0.95rem" }}>Recommended Actions</h4>
              <ul style={{ margin: 0, paddingLeft: "16px", color: "var(--text-secondary)" }}>
                {(risk.recommendations || []).map((rec: string) => <li key={rec}>{rec}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

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
              <strong className={stylometry.overall_suspicion_level === "High" ? "text-red" : "text-green"}>{stylometry.overall_suspicion_level}</strong>
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
            Measures specificity entropy. Generic &quot;slop&quot; reviews score low on domain density.
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

      <div className="glass-panel">
        <h3 style={{ marginBottom: "12px" }}>Flagged Review Evidence</h3>
        {stylometry.details?.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {stylometry.details.map((detail) => (
              <div key={detail.review_id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
                <span className="mono">{detail.review_id}</span>
                <span className={detail.is_suspicious ? "text-red" : "text-green"}>
                  Similarity {detail.similarity_score}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary">No review-level stylometric data available.</p>
        )}
      </div>
    </div>
  );
}
