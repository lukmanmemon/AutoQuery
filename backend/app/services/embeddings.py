from sentence_transformers import SentenceTransformer
from functools import lru_cache

@lru_cache(maxsize=1)
def get_model():
    """
    Lazy-load the SentenceTransformer model the first time it's needed.
    Keeps it cached afterward.
    """
    return SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def get_embedding(text: str) -> list[float]:
    model = get_model()  # Load only when first used
    text = text.strip().replace("\n", " ")
    embedding = model.encode(text, convert_to_numpy=True).tolist()
    return embedding

