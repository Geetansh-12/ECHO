from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
from typing import Any

from fetchers.openreview import fetch_paper_and_reviews
from fetchers.arxiv import fetch_arxiv_metadata
from analyzers.stylometry import analyze_stylometry
from analyzers.specificity import analyze_specificity
from analyzers.collusion import build_collusion_graph
from storage import get_stats, init_db, list_recent_analyses, save_analysis

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ECHO API",
    description="Peer Review Manipulation Detector",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    query: str
    venue_id: str = "ICLR.cc/2024/Conference"


def _build_risk_assessment(
    stylometry_results: dict[str, Any],
    specificity_results: dict[str, Any],
    collusion_graph: dict[str, Any],
) -> dict[str, Any]:
    suspicious_matches = int(stylometry_results.get("suspicious_matches", 0))
    slop_ratio = float(specificity_results.get("slop_ratio", 0))
    ring_count = int(collusion_graph.get("ring_count", 0))
    review_count = max(
        len(stylometry_results.get("details", [])),
        len(specificity_results.get("details", [])),
        1,
    )

    stylometry_component = min((suspicious_matches / review_count) * 50, 50)
    specificity_component = min(slop_ratio * 30, 30)
    collusion_component = min(ring_count * 10, 20)
    risk_score = round(
        stylometry_component + specificity_component + collusion_component, 2
    )

    if risk_score >= 70:
        verdict = "High Risk"
    elif risk_score >= 40:
        verdict = "Medium Risk"
    else:
        verdict = "Low Risk"

    top_findings = []
    if suspicious_matches:
        top_findings.append(
            f"{suspicious_matches} review(s) show high stylometric similarity to the paper."
        )
    if slop_ratio >= 0.4:
        top_findings.append(
            f"{round(slop_ratio * 100)}% of reviews appear low-specificity or generic."
        )
    if ring_count:
        top_findings.append(f"{ring_count} potential collusion ring cycle(s) detected.")
    if not top_findings:
        top_findings.append("No major anomalies detected across current checks.")

    recommendations = [
        "Run manual spot-check on flagged reviews and compare with reviewer history.",
        "Escalate suspicious cases to area chairs for verification.",
    ]
    if verdict == "High Risk":
        recommendations.append(
            "Request additional independent reviews before final acceptance decision."
        )

    return {
        "risk_score": risk_score,
        "verdict": verdict,
        "components": {
            "stylometry": round(stylometry_component, 2),
            "specificity": round(specificity_component, 2),
            "collusion": round(collusion_component, 2),
        },
        "top_findings": top_findings,
        "recommendations": recommendations,
    }


@app.get("/")
def read_root():
    return {"status": "ECHO Backend is running", "version": "1.0.0"}


@app.on_event("startup")
def startup_event():
    init_db()


@app.post("/api/analyze")
def analyze_paper(request: AnalyzeRequest):
    query = request.query
    venue_id = request.venue_id
    
    logger.info(f"Analyzing query: {query}")
    
    # 1. Fetch paper and reviews from OpenReview
    or_data = fetch_paper_and_reviews(venue_id, query)
    
    if "error" in or_data:
        # Fallback to arxiv just to show we have multi-source, 
        # but arxiv doesn't have reviews typically unless they are linked.
        logger.warning("Paper not found on OpenReview, trying arXiv...")
        arxiv_data = fetch_arxiv_metadata(query)
        if "error" in arxiv_data:
            raise HTTPException(status_code=404, detail="Paper not found in any supported source")
        
        return {
            "status": "partial",
            "message": "Paper found on arXiv but no OpenReview data available.",
            "paper": arxiv_data,
        }
        
    paper_title = or_data.get("title", "")
    abstract = or_data.get("abstract", "")
    reviews = or_data.get("reviews", [])
    paper_text = paper_title + " " + abstract
    
    # 2. Run Analyzers
    stylometry_results = analyze_stylometry(paper_text, reviews)
    specificity_results = analyze_specificity(reviews, abstract)
    
    # Inject paper_id into reviews for the graph builder
    for rev in reviews:
        if "paper_id" not in rev:
            rev["paper_id"] = or_data.get("paper_id") or or_data.get("id") or "unknown"
            
    # We build a graph based on this single paper for now, 
    # but in a real scenario we'd query the whole venue.
    collusion_graph = build_collusion_graph([or_data], reviews)

    risk_assessment = _build_risk_assessment(
        stylometry_results, specificity_results, collusion_graph
    )

    response = {
        "status": "success",
        "paper": {
            "title": paper_title,
            "abstract": abstract,
            "authors": or_data.get("authors", []),
        },
        "results": {
            "stylometry": stylometry_results,
            "specificity": specificity_results,
            "collusion": collusion_graph,
        },
        "risk_assessment": risk_assessment,
    }

    save_analysis(
        {
            "query": query,
            "venue_id": venue_id,
            "status": response["status"],
            "risk_score": risk_assessment["risk_score"],
            "verdict": risk_assessment["verdict"],
            "paper_title": paper_title,
            "suspicious_matches": stylometry_results.get("suspicious_matches", 0),
            "slop_ratio": specificity_results.get("slop_ratio", 0),
            "ring_count": collusion_graph.get("ring_count", 0),
        },
        response,
    )

    return response


@app.get("/api/history")
def get_analysis_history(limit: int = 20):
    return {"items": list_recent_analyses(limit)}


@app.get("/api/stats")
def get_analysis_stats():
    return get_stats()


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "echo-backend"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
