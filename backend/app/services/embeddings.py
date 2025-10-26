from sentence_transformers import SentenceTransformer

# Load once at startup
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def get_embedding(text: str) -> list[float]:
    """
    Returns a free embedding vector using Sentence Transformers.
    """
    text = text.strip().replace("\n", " ")
    embedding = model.encode(text, convert_to_numpy=True).tolist()
    return embedding
