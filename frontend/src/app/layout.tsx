import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ECHO — Peer Review Manipulation Detector",
  description: "Exposing AI-generated slop and collusion rings in academic peer review. Cross-document stylometric fingerprinting meets graph analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={{ height: '100%' }}
    >
      <body style={{
        fontFamily: 'var(--font-inter), sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0a0f',
        color: '#f8fafc',
        margin: 0
      }}>
        {children}
      </body>
    </html>
  );
}
