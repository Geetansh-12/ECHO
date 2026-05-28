import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_arxiv_metadata(query: str, max_results: int = 1) -> dict:
    """
    Fetch paper metadata from arXiv API using a search query (e.g., title or author).
    """
    base_url = 'http://export.arxiv.org/api/query?'
    
    # Clean and encode query
    safe_query = urllib.parse.quote(query)
    url = f"{base_url}search_query=all:{safe_query}&start=0&max_results={max_results}"
    
    logger.info(f"Fetching from arXiv: {url}")
    
    try:
        response = urllib.request.urlopen(url)
        data = response.read()
        root = ET.fromstring(data)
        
        # arXiv XML namespace
        ns = {'arxiv': 'http://www.w3.org/2005/Atom', 'opensearch': 'http://a9.com/-/spec/opensearch/1.1/'}
        
        entries = root.findall('arxiv:entry', ns)
        if not entries:
            return {"error": "No results found on arXiv"}
            
        entry = entries[0]
        
        title = entry.find('arxiv:title', ns).text.strip().replace('\n', ' ')
        summary = entry.find('arxiv:summary', ns).text.strip().replace('\n', ' ')
        authors = [author.find('arxiv:name', ns).text for author in entry.findall('arxiv:author', ns)]
        published = entry.find('arxiv:published', ns).text
        paper_id = entry.find('arxiv:id', ns).text
        
        return {
            "id": paper_id,
            "title": title,
            "abstract": summary,
            "authors": authors,
            "published": published,
            "source": "arxiv"
        }
        
    except Exception as e:
        logger.error(f"Error fetching from arXiv: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    test_query = "Attention is all you need"
    print(fetch_arxiv_metadata(test_query))
