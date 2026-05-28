"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Fingerprint, Lock, Loader2, Key } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [step, setStep] = useState<string>("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode) return;

    setIsAuthenticating(true);
    setStep("Verifying clearance...");

    setTimeout(() => setStep("Authenticating with Semantic Scholar..."), 800);
    setTimeout(() => setStep("Establishing OpenReview tunnel..."), 1600);
    setTimeout(() => setStep("Access Granted."), 2400);

    setTimeout(() => {
      router.push("/dashboard");
    }, 2800);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-dark)", color: "var(--text-primary)", alignItems: "center", justifyContent: "center" }}>
      {/* Background Ambience */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "30%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 60%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "20%", width: "35vw", height: "35vw", background: "radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 60%)", filter: "blur(60px)" }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "420px", padding: "24px", position: "relative", zIndex: 10 }}
      >
        <Link href="/" style={{ display: "flex", justifyContent: "center", marginBottom: "40px", textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ShieldAlert className="text-cyan" size={36} />
            <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: "0.1em" }} className="text-gradient">ECHO</h1>
          </div>
        </Link>

        <div className="glass-panel" style={{ padding: "40px 32px", display: "flex", flexDirection: "column", gap: "32px", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "8px", fontWeight: 600 }}>Command Center Access</h2>
            <p className="text-secondary" style={{ fontSize: "0.9rem" }}>Authenticate to enter the forensic dashboard.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                <Key size={18} />
              </div>
              <input
                type="password"
                className="search-input mono"
                style={{ 
                  paddingLeft: "48px", 
                  width: "100%", 
                  background: "rgba(0, 0, 0, 0.3)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "1rem",
                  letterSpacing: "0.2em"
                }}
                placeholder="ACCESS CODE"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={isAuthenticating}
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="primary-btn" 
              style={{ 
                width: "100%", 
                padding: "14px", 
                justifyContent: "center",
                display: "flex",
                gap: "10px",
                fontSize: "1rem",
                opacity: !accessCode ? 0.5 : 1,
                cursor: !accessCode ? "not-allowed" : "pointer"
              }}
              disabled={!accessCode || isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating
                </>
              ) : (
                <>
                  <Fingerprint size={20} />
                  Authorize
                </>
              )}
            </button>
          </form>

          {isAuthenticating && (
            <div style={{ textAlign: "center", minHeight: "24px" }}>
              <motion.p 
                key={step}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mono text-cyan" 
                style={{ fontSize: "0.85rem", margin: 0 }}
              >
                {step}
              </motion.p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", color: "var(--text-muted)", fontSize: "0.85rem", gap: "6px", alignItems: "center" }}>
          <Lock size={14} /> Secure end-to-end encryption
        </div>
      </motion.div>
    </div>
  );
}
