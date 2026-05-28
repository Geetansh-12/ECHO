import openreview
import logging
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_openreview_client() -> openreview.api.OpenReviewClient:
    """Initialize an anonymous OpenReview client."""
    # API v2 is the modern way to query openreview
    client = openreview.api.OpenReviewClient(baseurl='https://api2.openreview.net')
    return client

def fetch_paper_and_reviews(venue_id: str, paper_title: str) -> Dict[str, Any]:
    """
    Fetch a paper and its associated reviews from OpenReview.
    Example venue_id: 'ICLR.cc/2024/Conference'
    """
    client = get_openreview_client()
    
    logger.info(f"Searching for paper '{paper_title}' in venue '{venue_id}'")
    
    # Note: openreview-py search API can be tricky. We might need to iterate or use specific filters.
    # We will grab recent submissions for a venue as a proof of concept if search fails.
    
    try:
        # Search for submissions
        submissions = client.get_notes(invitation=f"{venue_id}/-/Submission", content={"title": paper_title})
        
        if not submissions:
            logger.warning(f"No submissions found for title: {paper_title}")
            return {"error": "Paper not found"}
            
        target_paper = submissions[0]
        paper_id = target_paper.id
        
        logger.info(f"Found paper: {target_paper.content.get('title', {}).get('value')} (ID: {paper_id})")
        
        # Fetch reviews for this paper
        # Reviews are typically under the invitation {Venue}/-/Paper{number}/Official_Review
        # But we can query by forum ID
        reviews = client.get_notes(forum=paper_id)
        
        # Filter for actual reviews (ignoring meta-reviews, comments, etc., initially)
        # Note: invitation strings vary by conference
        actual_reviews = [
            r for r in reviews 
            if 'Review' in r.invitation or 'Official_Review' in r.invitation
        ]
        
        parsed_reviews = []
        for r in actual_reviews:
            # Extract content (v2 API uses .value dicts)
            content = r.content
            parsed_reviews.append({
                "id": r.id,
                "signatures": r.signatures,
                "text": content.get("review", {}).get("value", "") or content.get("main_review", {}).get("value", "") or str(content),
                "rating": content.get("rating", {}).get("value", None),
                "confidence": content.get("confidence", {}).get("value", None)
            })
            
        return {
            "paper_id": paper_id,
            "title": target_paper.content.get('title', {}).get('value'),
            "abstract": target_paper.content.get('abstract', {}).get('value'),
            "authors": target_paper.content.get('authors', {}).get('value'),
            "reviews": parsed_reviews
        }
        
    except openreview.OpenReviewException as e:
        logger.error(f"OpenReview API Error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Test execution
    # Using ICLR 2024 as an example venue
    venue = "ICLR.cc/2024/Conference"
    # A random popular paper title or just search for a known one. Let's use a dummy title that we know exists or just list one.
    # To test locally, you can change this to a known paper title from ICLR 2024.
    test_title = "Position: The role of open source in AI" 
    
    print("Initializing OpenReview fetcher test...")
    results = fetch_paper_and_reviews(venue, test_title)
    print(f"Results: {results}")
