from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging

from fetchers.openreview import fetch_paper_and_reviews
from fetchers.arxiv import fetch_arxiv_metadata
from analyzers.stylometry import analyze_stylometry
from analyzers.specificity import analyze_specificity
from analyzers.collusion import build_collusion_graph

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

@app.get("/")
def read_root():
    return {"status": "ECHO Backend is running", "version": "1.0.0"}

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
            "paper": arxiv_data
        }
        
    paper_title = or_data.get("title", "")
    abstract = or_data.get("abstract", "")
    reviews = or_data.get("reviews", [])
    paper_text = paper_title + " " + abstract
    
    # 2. Run Analyzers
    stylometry_results = analyze_stylometry(paper_text, reviews)
    specificity_results = analyze_specificity(reviews, abstract)
    
    # We build a graph based on this single paper for now, 
    # but in a real scenario we'd query the whole venue.
    collusion_graph = build_collusion_graph([or_data], reviews)
    
    return {
        "status": "success",
        "paper": {
            "title": paper_title,
            "abstract": abstract,
            "authors": or_data.get("authors", [])
        },
        "results": {
            "stylometry": stylometry_results,
            "specificity": specificity_results,
            "collusion": collusion_graph
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
