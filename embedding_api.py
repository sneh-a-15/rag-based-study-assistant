import modal

app = modal.App("sentence-transformer-embedder")

# OPTIMIZATION 10: Better Modal configuration
image = (
    modal.Image.debian_slim()
    .pip_install("sentence-transformers", "torch")
    .run_commands(
        # Pre-download model during build
        "python -c 'from sentence_transformers import SentenceTransformer; SentenceTransformer(\"all-MiniLM-L6-v2\")'"
    )
)

@app.function(
    image=image, 
    keep_warm=3,  # Keep more instances warm
    concurrency_limit=20,  # Higher concurrency
    timeout=15,  # Shorter timeout
    retries=2
)
def embed_text(text: str):
    from sentence_transformers import SentenceTransformer
    # Model loads once per container due to keep_warm
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embedding = model.encode(text)
    return embedding.tolist()

# OPTIMIZATION 11: Batch function for future use
@app.function(
    image=image,
    keep_warm=1,
    timeout=30
)
def embed_batch(texts: list):
    """For future optimization - batch multiple queries"""
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(texts)
    return embeddings.tolist()