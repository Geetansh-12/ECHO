import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).resolve().parent / "echo.db"


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with _get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT NOT NULL,
                venue_id TEXT NOT NULL,
                status TEXT NOT NULL,
                risk_score REAL NOT NULL,
                verdict TEXT NOT NULL,
                paper_title TEXT,
                suspicious_matches INTEGER DEFAULT 0,
                slop_ratio REAL DEFAULT 0,
                ring_count INTEGER DEFAULT 0,
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def save_analysis(summary: dict[str, Any], payload: dict[str, Any]) -> None:
    with _get_connection() as conn:
        conn.execute(
            """
            INSERT INTO analyses (
                query, venue_id, status, risk_score, verdict, paper_title,
                suspicious_matches, slop_ratio, ring_count, payload, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                summary.get("query", ""),
                summary.get("venue_id", ""),
                summary.get("status", "unknown"),
                float(summary.get("risk_score", 0)),
                summary.get("verdict", "Unknown"),
                summary.get("paper_title"),
                int(summary.get("suspicious_matches", 0)),
                float(summary.get("slop_ratio", 0)),
                int(summary.get("ring_count", 0)),
                json.dumps(payload),
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        conn.commit()


def list_recent_analyses(limit: int = 20) -> list[dict[str, Any]]:
    safe_limit = max(1, min(limit, 100))
    with _get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                id, query, venue_id, status, risk_score, verdict, paper_title,
                suspicious_matches, slop_ratio, ring_count, created_at
            FROM analyses
            ORDER BY id DESC
            LIMIT ?
            """,
            (safe_limit,),
        ).fetchall()
        return [dict(row) for row in rows]


def get_stats() -> dict[str, Any]:
    with _get_connection() as conn:
        totals = conn.execute(
            """
            SELECT
                COUNT(*) AS total_analyses,
                AVG(risk_score) AS avg_risk_score,
                SUM(CASE WHEN verdict = 'High Risk' THEN 1 ELSE 0 END) AS high_risk_cases,
                SUM(CASE WHEN verdict = 'Medium Risk' THEN 1 ELSE 0 END) AS medium_risk_cases,
                SUM(CASE WHEN verdict = 'Low Risk' THEN 1 ELSE 0 END) AS low_risk_cases
            FROM analyses
            """
        ).fetchone()

        latest = conn.execute(
            """
            SELECT created_at
            FROM analyses
            ORDER BY id DESC
            LIMIT 1
            """
        ).fetchone()

    return {
        "total_analyses": int(totals["total_analyses"] or 0),
        "avg_risk_score": round(float(totals["avg_risk_score"] or 0), 2),
        "high_risk_cases": int(totals["high_risk_cases"] or 0),
        "medium_risk_cases": int(totals["medium_risk_cases"] or 0),
        "low_risk_cases": int(totals["low_risk_cases"] or 0),
        "last_analyzed_at": latest["created_at"] if latest else None,
    }
