import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_semantic_scholar_data(query: str, limit: int = 1) -> dict:
    """
    Fetch citation and paper data from Semantic Scholar Graph API.
    No API key required for basic usage (rate limits apply).
    """
    base_url = "https://api.semanticscholar.org/graph/v1/paper/search"
    
    params = {
        "query": query,
        "limit": limit,
        "fields": "title,authors,abstract,citationCount,referenceCount,year"
    }
    
    logger.info(f"Querying Semantic Scholar for: {query}")
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if not data.get('data'):
            return {"error": "No results found on Semantic Scholar"}
            
        paper = data['data'][0]
        return {
            "id": paper.get("paperId"),
            "title": paper.get("title"),
            "abstract": paper.get("abstract"),
            "authors": [author.get("name") for author in paper.get("authors", [])],
            "year": paper.get("year"),
            "citationCount": paper.get("citationCount"),
            "referenceCount": paper.get("referenceCount"),
            "source": "semantic_scholar"
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error querying Semantic Scholar: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    test_query = "Attention is all you need"
    print(fetch_semantic_scholar_data(test_query))
