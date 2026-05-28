<div align="center">
  <h1>ECHO</h1>
  <h3>Know What's Real.</h3>
  <p>
    A premium AI research-forensics platform for detecting suspicious peer-review behavior across
    OpenReview, arXiv, and Semantic Scholar.
  </p>
  <p>
    <strong>Generic reviews. Low-specificity feedback. Stylometry similarity. Collusion patterns.
    Reviewer behavior anomalies.</strong>
  </p>
</div>

---

## Why ECHO Exists

Scientific peer review is one of the highest-leverage trust systems in the world. But as review volume grows and AI-generated text becomes cheap, program chairs need better tools than manual spot checks and intuition.

ECHO is a forensic command center for scientific integrity. It takes a paper or title, gathers available open research metadata, analyzes the review text, and generates an evidence-backed report that helps chairs decide what deserves closer inspection.

The goal is not to replace human judgment. The goal is to make suspicious patterns visible.

## What It Detects

ECHO looks for five classes of risk:

- Generic reviews: reviews that rely on broad praise without technical grounding.
- Low-specificity reviews: reviews with weak domain density and low vocabulary entropy.
- Stylometry similarity: reviews that are unusually close to the paper text or abstract.
- Collusion patterns: reviewer-paper-author graph structures that suggest tight coordination.
- Suspicious reviewer behavior: burst timing, repeated language patterns, and weak diversity signals.

## Product Experience

The frontend has been redesigned as a premium, futuristic SaaS product inspired by Apple, Vercel, Linear, Perplexity, and Palantir-style intelligence dashboards.

It includes:

- Cinematic landing page for ECHO.
- Floating glass navigation.
- Real "Analyze" CTA wired to the dashboard analysis flow.
- AI-style search and thinking state.
- Intelligence dashboard preview with Recharts visualizations.
- Premium forensic report layout with verdict gauge, risk cards, findings, actions, graph map, and evidence cards.
- Live source-health page that explains whether providers are connected, rate-limited, or offline.
- Home navigation from ECHO branding across the app.

## Core Analysis Engines

### 1. Stylometry Fingerprinting

ECHO embeds the paper text and review text, then compares them with cosine similarity. High similarity can indicate templated or coordinated review behavior.

The system first tries to use the local HuggingFace `all-MiniLM-L6-v2` SentenceTransformer model. If the model is not cached and the environment cannot reach HuggingFace, ECHO falls back to a deterministic local lexical embedder so analysis still works offline instead of crashing.

### 2. Specificity Entropy Scanner

The specificity analyzer estimates how grounded a review is by measuring:

- Vocabulary diversity.
- Domain-specific word density.
- Generic academic filler language.

Low specificity can indicate AI-generated or low-effort peer review.

### 3. Collusion Graph Detector

ECHO builds a directed graph of papers, authors, and reviewers, then uses NetworkX to inspect suspicious short cycles and relationship patterns.

The report renders this as an interactive graph so users can inspect the structure visually.

### 4. Cross-Source Intelligence

ECHO is designed around open research infrastructure:

- OpenReview for paper submissions and public reviews.
- arXiv for preprint metadata.
- Semantic Scholar for citation and graph metadata.

The source-health page checks these providers live and explains provider state clearly:

- Connected: the API responded.
- Rate limited: the provider is reachable but temporarily throttling requests.
- Offline: the probe could not reach the provider.

## Architecture

```text
ECHO
├── backend
│   ├── FastAPI API
│   ├── OpenReview, arXiv, Semantic Scholar fetchers
│   ├── Stylometry analyzer
│   ├── Specificity analyzer
│   ├── Collusion graph analyzer
│   ├── Offline-safe embedding fallback
│   └── SQLite persistence with graceful failure handling
│
└── frontend
    ├── Next.js App Router
    ├── React 19
    ├── Tailwind CSS
    ├── Framer Motion
    ├── Recharts
    ├── D3 collusion graph
    ├── shadcn-style reusable button primitive
    └── Premium glassmorphic SaaS UI
```

## Tech Stack

Frontend:

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- Recharts
- D3
- Lucide React
- Radix Slot
- class-variance-authority
- clsx
- tailwind-merge

Backend:

- FastAPI
- Python
- sentence-transformers
- NetworkX
- SciPy
- NumPy
- Requests
- SQLite
- ReportLab for PDF export

## Quick Start

### 1. Start the backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

### 2. Start the frontend

In a second terminal:

```bash
cd frontend

npm install
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Frontend:

```text
http://127.0.0.1:3001
```

The frontend proxies API requests through Next.js:

```text
/api/* -> http://127.0.0.1:8000/api/*
```

## Demo Flow

For a reliable demo, use:

```text
Attention Is All You Need
```

Suggested judging path:

1. Open `http://127.0.0.1:3001`.
2. Show the premium landing page and product positioning.
3. Click `Analyze`.
4. The dashboard opens with a seeded query and runs the backend analysis.
5. Walk through the forensic report:
   - Overall verdict.
   - Risk breakdown.
   - Stylometry signal.
   - Specificity signal.
   - Collusion graph.
   - Evidence cards.
   - Recommended actions.
6. Open the Sources page to show live provider health.

## Reliability Features

ECHO includes practical hackathon-grade hardening:

- Offline-safe embedding fallback if HuggingFace cannot be reached.
- SQLite persistence is non-fatal, so analysis still returns if local storage is locked or unavailable.
- Frontend uses a proxy path instead of hard-coding backend URLs into UI calls.
- Production build avoids remote Google font fetching.
- Source-health states are truthful and explained.
- PDF and JSON exports are available from reports.

## Verification

The latest pushed version was verified with:

```bash
npm run lint
npx next build --webpack
```

Runtime smoke checks:

```text
GET  /                         -> 200
POST /api/analyze              -> 200
GET  /api/sources/health       -> 200
```

Latest verified commit on `main`:

```text
c332c82897083c39b16d64255f27671ef914a5b6
```

## API Overview

### Analyze a paper

```http
POST /api/analyze
Content-Type: application/json

{
  "query": "Attention Is All You Need"
}
```

Returns:

- Paper metadata.
- Stylometry results.
- Specificity results.
- Collusion graph.
- Risk assessment.
- Top findings.
- Recommended actions.

### Source health

```http
GET /api/sources/health
```

Returns live status for:

- OpenReview
- arXiv
- Semantic Scholar

### Export report PDF

```http
POST /api/export/pdf
```

Returns a base64 encoded PDF report.

## Why It Can Win

ECHO is more than a dashboard. It is a complete research-integrity workflow:

- Clear real-world problem.
- Multi-source open-data strategy.
- Actual backend analysis, not a static mockup.
- Premium product-grade interface.
- Explainable forensic report.
- Graph intelligence layer.
- Offline resilience.
- Judge-friendly demo path.

The product tells a strong story: scientific integrity needs an intelligence layer, and ECHO is a credible first version of that layer.

---

Built for hackathon judging, but designed like a serious AI integrity product.
