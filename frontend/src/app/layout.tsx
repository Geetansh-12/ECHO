import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECHO - Know What's Real",
  description:
    "AI-powered forensic analysis for scientific peer reviews across OpenReview, arXiv, and Semantic Scholar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        style={{
          fontFamily:
            "Inter, Geist, Satoshi, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#020617",
          color: "#f8fafc",
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
