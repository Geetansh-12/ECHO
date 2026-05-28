"use client";

import Link from "next/link";
import { 
  Database, 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  LogOut,
  Play,
  Copy,
  Brain,
  Network,
  Layers,
  Code
} from "lucide-react";

export default function Explorer() {
  const blueprints = [
    {
      id: "live-stylometry",
      title: "LIVE: Stylometric Fingerprinting",
      icon: <Brain className="text-purple" size={20} />,
      desc: "The smoking gun — cosine similarity between paper embeddings and review embeddings using local HuggingFace models.",
      code: `-- 🔴 LIVE ANALYSIS
-- Embeds paper + reviews with sentence-transformers
SELECT paper.title, review.id,
  cosine_similarity(
    embed(paper.abstract),
    embed(review.text)
  ) AS fingerprint_match,
  CASE WHEN similarity > 0.8 THEN '🚨 SUSPICIOUS'
       ELSE '✅ CLEAN' END AS verdict
FROM openreview.submissions paper
JOIN openreview.reviews review ON paper.id = review.forum
WHERE venue = 'ICLR.cc/2024/Conference'`
    },
    {
      id: "specificity-entropy",
      title: "Specificity Entropy Scanner",
      icon: <Code className="text-cyan" size={20} />,
      desc: "Measures vocabulary diversity and domain-specific word density. AI slop reviews use generic praise without domain grounding.",
      code: `-- REVIEW SUBSTANCE DEPTH ANALYSIS
SELECT review.id,
  entropy(specific_words(review.text)) AS vocab_entropy,
  count(domain_terms) / count(all_words) AS specificity_ratio,
  (specificity_ratio * 10 + vocab_entropy) AS depth_score,
  CASE WHEN depth_score < 6.0 THEN '🤖 LIKELY SLOP'
       ELSE '👨‍🔬 LIKELY HUMAN' END AS verdict
FROM reviews`
    },
    {
      id: "collusion-ring",
      title: "Collusion Ring Detector",
      icon: <Network className="text-red" size={20} />,
      desc: "Builds a directed graph of Author→Paper→Reviewer relationships. Finds suspicious reciprocal review cycles.",
      code: `-- COLLUSION GRAPH ANALYSIS
-- NetworkX cycle detection on reviewer-author graph
SELECT cycle_members, cycle_length,
  CASE WHEN cycle_length <= 3 THEN '🔴 TIGHT RING'
       WHEN cycle_length <= 5 THEN '🟡 LOOSE RING'
       ELSE '⚪ NORMAL' END AS risk_level
FROM graph.simple_cycles(
  authors -> papers -> reviewers
)
WHERE cycle_length <= 4
ORDER BY cycle_length ASC`
    },
    {
      id: "cross-source",
      title: "Cross-Source Paper Intelligence",
      icon: <Layers className="text-green" size={20} />,
      desc: "Joins metadata from OpenReview + arXiv + Semantic Scholar into a unified paper profile.",
      code: `-- CROSS-SOURCE JOIN
SELECT or.title, or.venue,
  ax.published, ax.categories,
  ss.citationCount, ss.referenceCount,
  COUNT(or.reviews) AS review_count
FROM openreview.papers or
LEFT JOIN arxiv.metadata ax ON or.title = ax.title  
LEFT JOIN semantic_scholar.papers ss ON or.title = ss.title`
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
            borderRadius: "8px", background: "rgba(168, 85, 247, 0.1)", color: "var(--text-primary)",
            textDecoration: "none", fontWeight: 500, border: "1px solid rgba(168, 85, 247, 0.2)"
          }}>
            <Database size={20} className="text-purple" /> Explorer
          </Link>
          <Link href="/sources" style={{ 
            display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", 
            borderRadius: "8px", color: "var(--text-secondary)", textDecoration: "none",
            transition: "all 0.2s"
          }} className="hover:text-primary">
            <Activity size={20} /> Sources
          </Link>
        </nav>

        <div style={{ padding: "24px 16px", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-cyan)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "bold" }}>
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
          <h1 style={{ fontSize: "2.5rem", marginBottom: "16px", color: "var(--text-primary)" }}>Analysis Engine</h1>
          <p className="text-secondary" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
            Inspect ECHO&apos;s capabilities—review pre-defined query blueprints, browse detection schemas, or execute the raw cross-source analysis pipeline against OpenReview.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px", paddingBottom: "100px" }}>
          {blueprints.map((bp) => (
            <div key={bp.id} className="glass-panel" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 8px 0", fontSize: "1.2rem", color: "var(--text-primary)" }}>
                  {bp.icon} {bp.title}
                </h3>
                <p className="text-secondary" style={{ margin: 0, fontSize: "0.95rem" }}>{bp.desc}</p>
              </div>
              
              <div style={{ background: "#050505", padding: "24px", position: "relative" }}>
                <pre className="mono" style={{ margin: 0, fontSize: "0.9rem", color: "#e2e8f0", overflowX: "auto" }}>
                  <code style={{ display: "block" }}>
                    {bp.code.split('\n').map((line, i) => {
                      if (line.startsWith('--')) {
                        return <span key={i} style={{ color: "var(--text-muted)", display: "block" }}>{line}</span>;
                      } else if (line.match(/SELECT|FROM|JOIN|WHERE|AS|CASE|WHEN|THEN|ELSE|END/)) {
                        const hl = line.replace(/(SELECT|FROM|LEFT JOIN|JOIN|WHERE|AS|CASE|WHEN|THEN|ELSE|END|ORDER BY)/g, '<span style="color:var(--accent-purple);font-weight:bold;">$1</span>');
                        return <span key={i} dangerouslySetInnerHTML={{ __html: hl }} style={{ display: "block" }} />;
                      }
                      return <span key={i} style={{ display: "block" }}>{line}</span>;
                    })}
                  </code>
                </pre>
                
                <div style={{ display: "flex", gap: "12px", marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
                  <Link href="/dashboard?q=Attention+Is+All+You+Need&auto=1" className="primary-btn" style={{ padding: "8px 16px", fontSize: "0.9rem", textDecoration: "none" }}>
                    <Play size={16} /> Run Analysis
                  </Link>
                  <button className="ghost-btn" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
                    <Copy size={16} /> Copy Query
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
