<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.svg" alt="ECHO Logo" width="80" height="80" />
  <h1>ECHO</h1>
  <p><strong>Peer Review Manipulation Detector</strong></p>
  <p><i>Cross-document stylometric fingerprinting meets graph analysis. Exposing AI-generated slop and collusion rings in academic publishing.</i></p>
</div>

<hr />

## 🔍 The Problem
Academic publishing is under attack by AI-generated "slop" reviews and highly organized reciprocal citation/review collusion rings. Current tools just look at the text. **ECHO** looks at the entire network.

ECHO acts as a forensic analysis engine that ingests metadata from **OpenReview, arXiv, and Semantic Scholar** to identify suspicious peer reviews without relying on third-party black-box APIs. 

## ⚡ Core Engines

- **🤖 LIVE Stylometric Fingerprinting**: Computes cosine similarity between paper abstracts and review text using a local HuggingFace embedding model (`all-MiniLM-L6-v2`). Flags reviews that are statistically indistinguishable from the paper itself.
- **📉 Specificity Entropy Scanner**: Measures vocabulary diversity and domain-specific word density. AI-generated reviews often feature generic praise and lack domain grounding, leading to a low entropy score.
- **🕸️ Collusion Ring Detector**: Builds a directed graph (`Author → Paper → Reviewer`) using NetworkX to detect tight reciprocal review cycles (e.g., "I review your paper, you review mine").
- **📊 Cross-Source Intelligence**: Joins open APIs (OpenReview + arXiv + Semantic Scholar) to build a unified forensic profile of any submission.

## 🛠️ Technology Stack

We built ECHO to be fast, beautiful, and capable of running fully local analysis without expensive API keys.

**Frontend Command Center:**
- **Next.js & React**: App Router, Server/Client components
- **Aesthetics**: Custom Glassmorphic CSS Engine inspired by premium dashboards
- **Visualizations**: **D3.js** for interactive force-directed collusion graphs
- **Icons**: Lucide React

**Analysis Backend:**
- **Python & FastAPI**: High-performance asynchronous API
- **HuggingFace Models**: `sentence-transformers` running locally
- **Graph Mathematics**: `networkx` for cycle detection
- **Data Storage**: Local `SQLite` for caching and state management

## 🚀 Quick Start

ECHO is split into two parts: the FastAPI backend and the Next.js frontend.

### 1. Start the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the analysis server
uvicorn main:app --reload
```
*The backend will run on `http://localhost:8000`*

### 2. Start the Frontend Command Center

Open a new terminal window:

```bash
cd frontend

# Install Node modules
npm install

# Start the Next.js dev server
npm run dev
```
*The frontend will run on `http://localhost:3000`*

## 💡 Usage

1. Open `http://localhost:3000` in your browser.
2. Click **Open Command Center**.
3. In the Dashboard, enter an OpenReview Forum ID or an arXiv ID in the search bar.
4. ECHO will fetch the paper metadata, scrape the reviews, run stylometric analysis, and render the collusion graph.
5. Visit the **Explorer** page to view the raw SQL-style analysis blueprints driving ECHO.

---
*Built for the WeMakeDevs Coral Hackathon*
