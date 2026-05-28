import math
import re
import logging
from collections import Counter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Generic stop words and common academic fluff that LLMs overuse
GENERIC_WORDS = set([
    "the", "a", "an", "is", "are", "was", "were", "to", "of", "and", "in", "that", "it", 
    "for", "on", "as", "with", "by", "this", "we", "can", "be", "which", "paper", "authors",
    "proposed", "method", "approach", "results", "show", "demonstrate", "novel", "significant",
    "important", "contribution", "well-written", "interesting", "good", "great", "however"
])

def calculate_entropy(words: list[str]) -> float:
    """Calculate Shannon entropy of a word distribution to measure vocabulary diversity."""
    if not words:
        return 0.0
    
    word_counts = Counter(words)
    total_words = sum(word_counts.values())
    
    entropy = 0.0
    for count in word_counts.values():
        probability = count / total_words
        entropy -= probability * math.log2(probability)
        
    return entropy

def analyze_specificity(reviews: list[dict], paper_abstract: str = "") -> dict:
    """
    Measure how domain-specific a review is.
    AI slop reviews often use generic praise ("The paper proposes a novel method...") 
    without citing specific domain entities. We measure this via entropy and 
    domain-specific word density.
    """
    if not reviews:
        return {"error": "No reviews provided"}
        
    results = []
    
    for review in reviews:
        text = review.get("text", "").lower()
        if len(text) < 50:
            continue
            
        # Tokenize simply
        words = re.findall(r'\b\w+\b', text)
        
        # Filter generic words
        specific_words = [w for w in words if w not in GENERIC_WORDS and len(w) > 3]
        
        # Calculate metrics
        total_words = len(words)
        if total_words == 0:
            continue
            
        specificity_ratio = len(specific_words) / total_words
        vocab_entropy = calculate_entropy(specific_words)
        
        # Scoring heuristic
        # A good review has high entropy (diverse vocabulary) and high specificity_ratio
        score = (specificity_ratio * 10) + vocab_entropy
        
        is_slop = score < 6.0 # Arbitrary threshold for demo
        
        results.append({
            "review_id": review.get("id"),
            "specificity_score": round(score, 2),
            "entropy": round(vocab_entropy, 2),
            "is_likely_slop": is_slop
        })
        
    slop_count = sum(1 for r in results if r["is_likely_slop"])
    
    return {
        "slop_ratio": round(slop_count / len(results), 2) if results else 0,
        "details": results
    }
