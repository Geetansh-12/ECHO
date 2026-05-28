from sentence_transformers import SentenceTransformer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Singleton pattern for the model so it only loads once in memory
class Embedder:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            logger.info("Loading local HuggingFace embedding model (all-MiniLM-L6-v2)...")
            cls._instance = super(Embedder, cls).__new__(cls)
            # all-MiniLM-L6-v2 is fast, small, and good for general semantic similarity
            cls._instance.model = SentenceTransformer('all-MiniLM-L6-v2')
        return cls._instance
        
    def encode(self, texts: list[str]):
        return self.model.encode(texts)

def get_embedder():
    return Embedder()

if __name__ == "__main__":
    emb = get_embedder()
    vectors = emb.encode(["Hello World", "This is a test"])
    print(f"Generated {len(vectors)} embeddings of shape {vectors[0].shape}")
