from pinecone import Pinecone
import pdfplumber
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

API_KEY = "pcsk_5ATdWc_RKn8FWqmTvVz6xi7igLP7fuDDqiGKxCqYPHRWusc3daX8RUwUUuJEKGZNnj2Tiq"
INDEX_NAME = "cs-study-assistant"
MODEL_NAME = 'all-MiniLM-L6-v2'

# === INIT PINECONE ===
print("[🔁] Connecting to Pinecone...")
pc = Pinecone(api_key=API_KEY)
index = pc.Index(INDEX_NAME)
print("[✅] Connected to Pinecone index:", INDEX_NAME)

# === INIT EMBEDDING MODEL ===
print("[🧠] Loading embedding model...")
model = SentenceTransformer(MODEL_NAME)
print("[✅] Model loaded.")

# === CHUNKING FUNCTION ===
def extract_chunks_from_pdf(file_path, chunk_size=400):
    print(f"[📄] Reading PDF: {file_path}")
    chunks = []
    with pdfplumber.open(file_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                words = text.split()
                for i in range(0, len(words), chunk_size):
                    chunk = ' '.join(words[i:i+chunk_size])
                    chunks.append(chunk)
    print(f"[📚] Total chunks extracted: {len(chunks)}")
    return chunks

# === UPLOAD FUNCTION ===
def process_and_upload(subject_name, file_path):
    chunks = extract_chunks_from_pdf(file_path)
    
    print(f"[📡] Uploading {subject_name} chunks to Pinecone...")
    for i, chunk in tqdm(enumerate(chunks), total=len(chunks)):
        vector = model.encode(chunk).tolist()
        metadata = {
            "subject": subject_name,
            "chunk_id": i,
            "text": chunk
        }

        if i < 1:
            print("\n--- Sample Chunk ---")
            print("Chunk ID:", f"{subject_name}_{i}")
            print("Text:", chunk[:200], "...")
            print("--------------------\n")

        index.upsert([
            (f"{subject_name}_{i}", vector, metadata)
        ])

    print(f"[✅] {subject_name} upload complete!\n")

# === RUN FOR ALL SUBJECTS ===
process_and_upload("DBMS", "data/DBMS.pdf")
process_and_upload("OS", "data/OS.pdf")