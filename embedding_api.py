import modal

app = modal.App("sentence-transformer-embedder")

image = (
    modal.Image.debian_slim()
    .pip_install("sentence-transformers")
)

@app.function(image=image, gpu=None, timeout=60)
def embed_text(text: str):
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    embedding = model.encode(text)
    return embedding.tolist()
