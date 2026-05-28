import networkx as nx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def build_collusion_graph(papers: list[dict], all_reviews: list[dict]) -> dict:
    """
    Builds a directed graph of Authors -> Reviews -> Papers.
    Detects reciprocal review rings (e.g., A reviews B, B reviews A).
    Since OpenReview is often double-blind, we use signatures or inferred identities if available.
    """
    G = nx.DiGraph()
    
    # Add paper nodes
    for paper in papers:
        paper_id = paper.get("id", "unknown")
        authors = paper.get("authors", [])
        
        G.add_node(paper_id, type="paper", title=paper.get("title", ""))
        
        for author in authors:
            G.add_node(author, type="author")
            # Author -> Paper edge
            G.add_edge(author, paper_id, relation="wrote")
            
    # Add reviewer edges
    for review in all_reviews:
        paper_id = review.get("paper_id")
        signatures = review.get("signatures", ["Anonymous"])
        
        for sig in signatures:
            G.add_node(sig, type="reviewer")
            # Reviewer -> Paper edge
            G.add_edge(sig, paper_id, relation="reviewed")
            
    # Detect rings (cycles of length 2 or 3)
    # This requires undirected or specific path finding. We'll find simple cycles.
    cycles = list(nx.simple_cycles(G))
    suspicious_cycles = [c for c in cycles if len(c) <= 4] # Short cycles indicate tight rings
    
    # Export for D3.js visualization
    nodes_data = [{"id": n, **G.nodes[n]} for n in G.nodes()]
    edges_data = [{"source": u, "target": v, "relation": d["relation"]} for u, v, d in G.edges(data=True)]
    
    return {
        "nodes": nodes_data,
        "links": edges_data,
        "ring_count": len(suspicious_cycles),
        "suspicious_cycles": suspicious_cycles
    }
