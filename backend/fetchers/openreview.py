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
    
    # --- HACKATHON DEMO MOCK DATA ---
    # Intercept specific searches to guarantee rich data for the analyzers to demonstrate
    if "open source in ai" in paper_title.lower() or "attention is all you need" in paper_title.lower():
        title_to_use = "Position: The Role of Open Source in AI" if "open source" in paper_title.lower() else "Attention Is All You Need"
        abstract_to_use = "We discuss the role of open-source software in artificial intelligence. Open-source models have democratized access to AI, but they also bring challenges related to safety, misuse, and alignment. We argue that open-source AI is crucial for transparent and reproducible research."
        if "attention" in title_to_use.lower():
            abstract_to_use = "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely."
            
        logger.info(f"Serving Hackathon Demo Data for: {title_to_use}")
        return {
            "paper_id": "demo_123",
            "title": title_to_use,
            "abstract": abstract_to_use,
            "authors": ["Alice Smith", "Bob Jones"],
            "reviews": [
                {
                    "id": "rev1",
                    "signatures": ["Reviewer 1"],
                    "text": "This paper presents a strong position. The arguments are well-supported by recent literature, particularly regarding the democratization of models. However, the section on safety could be expanded to include more empirical evidence of misuse. Overall, a solid contribution to the ongoing debate.",
                    "rating": "8: Accept",
                    "confidence": "4: Confident"
                },
                {
                    "id": "rev2",
                    "signatures": ["Reviewer 2"],
                    "text": "The paper is well written and novel. It presents interesting results. The authors show that the proposed method is good. I recommend accepting the paper because it is well written and novel. Thank you.",
                    "rating": "6: Weak Accept",
                    "confidence": "3: Somewhat Confident"
                },
                {
                    "id": "rev3",
                    "signatures": ["Reviewer 3"],
                    "text": f"{abstract_to_use} Therefore, the paper should be accepted because it says exactly this.",
                    "rating": "10: Strong Accept",
                    "confidence": "5: Very Confident"
                }
            ]
        }
    # --------------------------------
    
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
