import Link from "next/link";
import {
  Radar,
  Database,
  BrainCircuit,
  Trophy,
  ArrowRight,
  Fingerprint,
  Network,
  FileSearch,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* ─── Ambient background orbs ─── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            top: "-10%",
            left: "-5%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            bottom: "5%",
            right: "-5%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            top: "40%",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ─── Hero Section ─── */}
        <section
          className="animate-fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "100px 24px 60px",
            minHeight: "80vh",
          }}
        >
          {/* Badge */}
          <div
            className="glass-panel"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "99px",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginBottom: "40px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            <Radar size={14} style={{ color: "var(--accent-cyan)" }} />
            Academic Integrity Forensics
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(4rem, 12vw, 9rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              marginBottom: "24px",
            }}
          >
            <span className="text-gradient">ECHO</span>
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "20px",
              letterSpacing: "-0.01em",
            }}
          >
            Peer Review Manipulation Detector
          </h2>

          {/* Tagline */}
          <p
            style={{
              maxWidth: "640px",
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              marginBottom: "48px",
            }}
          >
            Cross-document stylometric fingerprinting meets graph analysis.
            Exposing AI-generated slop and collusion rings in academic
            publishing.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="/dashboard"
              className="primary-btn"
              style={{
                textDecoration: "none",
                fontSize: "1.05rem",
                padding: "16px 36px",
              }}
            >
              Open Command Center
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/explorer"
              className="ghost-btn"
              style={{ textDecoration: "none" }}
            >
              <FileSearch size={18} />
              Show Analysis Engine
            </Link>
          </div>

          {/* Floating stats strip */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "72px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { label: "Stylometric Signals", value: "12+", icon: Fingerprint },
              { label: "Graph Metrics", value: "8", icon: Network },
              { label: "Sources Fused", value: "3", icon: Database },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <stat.icon
                  size={20}
                  style={{ color: "var(--accent-cyan)", opacity: 0.7 }}
                />
                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Feature Cards Section ─── */}
        <section
          className="container"
          style={{ paddingTop: "40px", paddingBottom: "100px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card 1 */}
            <div
              className="glass-panel animate-fade-in"
              style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(168,85,247,0.15))",
                    border: "1px solid rgba(6,182,212,0.2)",
                  }}
                >
                  <Database
                    size={22}
                    style={{ color: "var(--accent-cyan)" }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  Built on real data, not demos
                </h3>
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                ECHO pulls live reviews from OpenReview, matches metadata from
                arXiv, and runs local HuggingFace models — no API keys, fully
                offline-capable.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="glass-panel animate-fade-in"
              style={{ animationDelay: "0.25s", animationFillMode: "backwards" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(239,68,68,0.15))",
                    border: "1px solid rgba(168,85,247,0.2)",
                  }}
                >
                  <BrainCircuit
                    size={22}
                    style={{ color: "var(--accent-purple)" }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  Agent-first forensics
                </h3>
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                Users don&apos;t just browse papers. They get stylometric
                fingerprints, specificity entropy scores, and AI-generated
                collusion graph analysis.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="glass-panel animate-fade-in"
              style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(6,182,212,0.15))",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <Trophy
                    size={22}
                    style={{ color: "var(--accent-green)" }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  Judge-ready storytelling
                </h3>
              </div>
              <ul
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.9,
                  fontSize: "0.95rem",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {[
                  "Cross-source analysis across OpenReview + arXiv + Semantic Scholar",
                  "Local HuggingFace embeddings — runs fully offline",
                  "D3.js force-directed collusion graphs",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--accent-green)",
                        marginTop: "5px",
                        flexShrink: 0,
                      }}
                    >
                      ▸
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "32px 24px",
          borderTop: "1px solid var(--border-color)",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ opacity: 0.7 }}>
          Built for{" "}
          <span className="text-gradient" style={{ fontWeight: 600 }}>
            WeMakeDevs Coral Hackathon
          </span>
        </span>
      </footer>
    </>
  );
}
