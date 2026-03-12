"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Brain,
  Bug,
  BookOpen,
  FileText,
  Activity,
  Shield,
  ChevronDown,
  ExternalLink,
  Github,
  Cpu,
  Database,
  Layers,
  Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Pillar = {
  id: string;
  icon: React.ReactNode;
  label: string;
  headline: string;
  summary: string;
  sections: { title: string; body: string; code?: string }[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECH_STACK = [
  "FastAPI",
  "Python",
  "FAISS",
  "Sentence-Transformers",
  "Ollama (Llama 3)",
  "PyMuPDF",
  "SQLAlchemy",
  "Pydantic v2",
  "SQLite / PostgreSQL",
  "Docker",
  "Streamlit",
  "pytest",
];

const PILLARS: Pillar[] = [
  {
    id: "system-design",
    icon: <Building2 className="h-5 w-5" />,
    label: "System Design",
    headline: "A 3-tier architecture built for privacy and scale",
    summary:
      "Every architecture decision was deliberate — from choosing a local LLM over a cloud API to using FAISS over a managed vector store. The design reflects the real-world constraint: law firms and CA firms cannot send client documents to external APIs.",
    sections: [
      {
        title: "The core data flow",
        body: `Upload → FastAPI validates & saves PDF → Background task queued → PyMuPDF extracts text → Sentence-aware chunker splits into 1,200-char chunks → Sentence-Transformers embeds chunks → FAISS index saved to disk → Status flips READY → Query arrives → Embed question → FAISS nearest-neighbor search → Top-7 chunks retrieved → RAG prompt assembled → Ollama generates answer with citations.

Every step is a separate function with a single responsibility, making it easy to swap any layer (e.g., replace FAISS with Pinecone, replace Ollama with GPT-4 via one config change).`,
      },
      {
        title: "Why Ollama over OpenAI?",
        body: `Law firms and CA firms handle confidential client data. Sending a contract or invoice to a third-party API violates confidentiality obligations. Ollama runs Llama 3 entirely on the local machine — zero data leaves the network. This is not just a cost decision; it is a compliance decision.`,
      },
      {
        title: "Why FAISS over a managed vector DB?",
        body: `Pinecone and Weaviate require outbound internet connections, which again conflicts with air-gapped or on-premise deployment requirements. FAISS runs in-process, stores indexes as flat files on disk, and can be loaded into memory in milliseconds. For up to ~50,000 chunks (equivalent to ~200 contracts), FAISS exact search (IndexFlatL2) outperforms approximate-search solutions with zero infrastructure overhead.`,
      },
      {
        title: "SQL: why SQLite in dev, PostgreSQL-ready in prod?",
        body: `SQLite requires zero configuration and has no separate process — perfect for development, tests, and single-server deployments. The DATABASE_URL is a Pydantic Settings field read from environment variables, so swapping to PostgreSQL in production requires a single env var change. SQLAlchemy 2.0 abstracts the dialect completely.`,
        code: `# config.py — swapping databases is one env var
database_url: str = f"sqlite:///{BASE_DIR}/storage/documents.db"
# Production: DATABASE_URL=postgresql://user:pass@host:5432/dbname`,
      },
      {
        title: "Multi-document search design",
        body: `When no doc_id is provided, the query endpoint embeds the question ONCE (expensive GPU/CPU operation), then fans out that single embedding to every READY document's FAISS index, collects all candidate chunks, sorts by L2 distance globally, and returns the top-K. This works because every index was built with the same embedding model — the vector spaces are directly comparable.`,
        code: `def search_across_documents(query, doc_ids, doc_id_to_filename):
    query_embedding = embed_texts([query])   # embed once, reuse everywhere
    all_candidates = []
    for doc_id in doc_ids:
        index, metadata = _load_index(doc_id)
        distances, positions = index.search(query_embedding, TOP_K)
        # collect with doc_id, filename, page, text, distance
    all_candidates.sort(key=lambda x: x["distance"])
    return all_candidates[:TOP_K]             # globally best chunks`,
      },
    ],
  },
  {
    id: "ai-orchestration",
    icon: <Brain className="h-5 w-5" />,
    label: "AI Orchestration",
    headline: "RAG pipeline: Retrieve → Augment → Generate",
    summary:
      "The intelligence of this system is not in a single model call — it is in the pipeline that feeds the right context to the model. Getting this pipeline wrong means the LLM gets partial or irrelevant information and confidently produces wrong answers.",
    sections: [
      {
        title: "The RAG pipeline in detail",
        body: `Retrieval: The user's question is embedded into the same vector space as the document chunks. FAISS finds the 7 most semantically similar chunks using L2 distance — not keyword search, but meaning search. A question about "payment terms" will retrieve chunks about "net 30 days" even if the exact phrase "payment terms" never appears.

Augmentation: The prompt assembles retrieved chunks with source labels ([Source 1 — contract.pdf, Page 25]) so the LLM knows exactly where each piece of information came from. Instructions tell the LLM to synthesize across all chunks, not just look for an exact match.

Generation: Ollama generates with temperature=0.1 (minimal creativity, maximum factual accuracy) and num_predict=1024 (enough tokens for multi-part answers).`,
      },
      {
        title: "Context engineering: fixing the 'not present' problem",
        body: `Initial version: LLM said "This information is not present" even when the answer was on the retrieved page. Root cause analysis found three bugs:

1. chunk_size=500 characters cut sentences mid-word — "AWS offers a range of frameworks to build fou..." (truncated). The LLM received an incomplete thought.
2. Blind character slicing had no awareness of sentence boundaries.
3. Prompt fallback was too aggressive: "If not found, say not present" — trained the LLM to give up on partial context.`,
        code: `# Before (blind character slice — breaks sentences):
chunk = text[start : start + chunk_size]

# After (sentence-aware — always complete thoughts):
sentences = re.split(r'(?<=[.!?])\\s+', text)
# Group sentences until chunk_size reached, never break mid-sentence`,
      },
      {
        title: "Prompt engineering decisions",
        body: `Every instruction in the prompt was chosen to solve a specific failure mode observed during testing:

- "Synthesize across ALL provided excerpts" → prevents the LLM from stopping at the first relevant chunk
- "If excerpts contain partial info, share what you found" → replaces the hard "not present" fallback with graceful degradation
- "Always cite source filename and page number" → gives the user evidence to verify every answer
- temperature=0.1 → near-deterministic output for factual document QA`,
        code: `prompt = (
    "You are an expert document analyst...\\n\\n"
    "Rules:\\n"
    "- Synthesize information across ALL provided excerpts.\\n"
    "- Always cite source filename and page number.\\n"
    "- If partial info found, share it — don't say 'not present'.\\n"
    "- Only say absent if topic is truly missing from all excerpts.\\n"
)`,
      },
    ],
  },
  {
    id: "debugging",
    icon: <Bug className="h-5 w-5" />,
    label: "Debugging",
    headline: "Catching what AI-generated code misses",
    summary:
      "AI writes confident, clean-looking code with subtle bugs. Three real production bugs in this project — and how they were diagnosed and fixed.",
    sections: [
      {
        title: "Bug 1: The Pydantic alias trap",
        body: `Symptom: Streamlit app threw KeyError: 'doc_id' at line 398 — even though the FastAPI schema defined doc_id.

Root cause: Pydantic v2 Field(alias='id') applies alias to BOTH input validation AND JSON serialization. The API was reading from SQLAlchemy ORM (where the column is named 'id') but serializing back to the client as {'id': '...'} — not {'doc_id': '...'}. The Streamlit code expected 'doc_id'.

Fix: Field(validation_alias='id') applies the alias ONLY to input (ORM reading). The output field name remains doc_id. A one-word change that requires knowing the Pydantic v2 alias model deeply.`,
        code: `# WRONG — applies alias to both input AND output serialization:
doc_id: str = Field(alias="id")
# API returns {"id": "abc"} → KeyError in frontend

# CORRECT — alias only for reading from ORM, output uses Python field name:
doc_id: str = Field(validation_alias="id")
# API returns {"doc_id": "abc"} → works correctly`,
      },
      {
        title: "Bug 2: Background task DB session race condition",
        body: `Symptom: Background indexing task occasionally crashed with 'Session already closed' errors.

Root cause: FastAPI's Depends(get_db) session is tied to the request lifecycle. When the background task runs after the HTTP response is sent, the request is closed — and so is the session.

Fix: The background task creates its own SessionLocal() session, manages its own transaction, and closes it in a finally block. Never share a request-scoped session with a background task.`,
        code: `# WRONG — uses request's session, closed before task runs:
def run_indexing_pipeline(doc_id: str, db: Session):
    doc = db.get(Document, doc_id)   # Session already closed → crash

# CORRECT — background task owns its session:
def run_indexing_pipeline(doc_id: str, pdf_path: str):
    db = SessionLocal()     # own session, independent lifecycle
    try:
        doc = db.get(Document, doc_id)
        ...
    finally:
        db.close()          # always clean up`,
      },
      {
        title: "Bug 3: uvicorn module resolution (venv vs system Python)",
        body: `Symptom: ModuleNotFoundError: No module named 'faiss' — even after installing it.

Root cause: Running 'uvicorn main:app' used the system Homebrew Python, not the virtual environment Python, despite the venv being activated. The venv's uvicorn was not on PATH.

Fix: python -m uvicorn main:app --reload forces Python to use the currently active interpreter, ensuring all packages installed inside the venv are found.

Lesson: Always run FastAPI apps as python -m uvicorn in development to guarantee interpreter consistency.`,
        code: `# Breaks if venv uvicorn is not first on PATH:
uvicorn main:app --reload

# Always resolves to the active Python interpreter:
python -m uvicorn main:app --reload --port 8000`,
      },
    ],
  },
  {
    id: "domain-expertise",
    icon: <BookOpen className="h-5 w-5" />,
    label: "Domain Expertise",
    headline: "Built for law firms, CA firms, and regulated industries",
    summary:
      "The technical decisions in this project are not arbitrary engineering choices — they are directly driven by the privacy and compliance requirements of the target domain.",
    sections: [
      {
        title: "The domain: document-heavy regulated businesses",
        body: `Law firms, CA firms, and financial services companies live inside documents. A senior partner at a law firm reviews 50–100 page contracts multiple times a day. A CA firm processes hundreds of invoices, balance sheets, and audit reports per engagement. Their core problem: finding a specific clause, number, or obligation buried in a long document wastes billable hours.

The value proposition: ask a plain-English question, get a precise answer with an exact page citation you can verify in 10 seconds. Time saved: 5–20 minutes per document, multiplied by hundreds of documents.`,
      },
      {
        title: "Why data sovereignty is a hard requirement, not a nice-to-have",
        body: `Professional conduct rules (Bar Council rules for lawyers, ICAI guidelines for CAs) impose strict confidentiality obligations. Uploading a client's contract to OpenAI's API without the client's consent is a professional conduct violation — potentially license-threatening.

This is why Ollama is the only acceptable LLM choice for this domain. It runs entirely on the firm's own hardware. No data leaves the machine. The firm can deploy this system in an air-gapped network with no internet access whatsoever.`,
      },
      {
        title: "Document type awareness in the chunking strategy",
        body: `Legal and financial documents have specific structure: numbered clauses, defined terms, cross-references ("as defined in Section 4.2"), and dense tabular data (financial statements). The 1,200-character chunk size was chosen so that a single clause — typically 100–400 words — fits completely within one chunk. An answer that requires synthesizing across 3–4 clauses will be captured across adjacent chunks, linked by the 200-character overlap.`,
      },
    ],
  },
  {
    id: "tech-writing",
    icon: <FileText className="h-5 w-5" />,
    label: "Tech Writing",
    headline: "Code that explains itself — and its decisions",
    summary:
      "The codebase is documented not just with what each function does, but with WHY each decision was made. This is the difference between code a junior reads and code a senior trusts.",
    sections: [
      {
        title: "Documenting the WHY, not just the WHAT",
        body: `Every configuration value in config.py has an inline explanation of why it was tuned to that specific number:

chunk_size = 1200  →  "500 was too small — it cut sentences mid-way, sending incomplete context to the LLM. 1200 chars ≈ 3-5 full sentences, enough for a complete thought."

top_k_results = 7  →  "More chunks = better answers for broad questions. Diminishing returns beyond ~8 because LLMs struggle with very long prompts."

These comments survive long after the original author has left. A new engineer inheriting this code knows exactly why these numbers exist — and what will break if they change them.`,
        code: `# chunk_size: target characters per chunk AFTER sentence-aware splitting.
#   500 was too small — it cut sentences mid-way, sending incomplete context
#   to the LLM. 1200 chars ≈ 3-5 full sentences, enough for a complete thought.
chunk_size: int = 1200

# chunk_overlap: characters of the previous chunk repeated at start of next.
#   Larger overlap ensures answers sitting on a chunk boundary are fully captured.
chunk_overlap: int = 200`,
      },
      {
        title: "Module-level docstrings as architecture documentation",
        body: `Each service file opens with a docstring explaining: what the module does, WHY this approach was chosen over alternatives, and what trade-offs were accepted. For example, llm_service.py explains the full RAG pattern before a single line of code, including why the old prompt was changed and what specific failure modes each change fixes.

This is the kind of technical writing that gets engineers promoted: it demonstrates understanding of the system beyond just making the tests pass.`,
      },
      {
        title: "Error messages as user communication",
        body: `The three RuntimeError messages raised in ask_ollama() are actionable — they tell the developer exactly what command to run:

ConnectionError → "Make sure Ollama is running: run 'ollama serve' in your terminal."
Timeout → "The model may be loading for the first time. Please retry."
HTTPError 404 → "Check that the model is pulled: 'ollama pull llama3'."

Compare this to a raw "Connection refused" error with a stack trace — the difference is hours of debugging time saved.`,
        code: `except requests.exceptions.ConnectionError:
    raise RuntimeError(
        f"Cannot connect to Ollama at {settings.ollama_base_url}. "
        "Make sure Ollama is running: run 'ollama serve' in your terminal."
    )`,
      },
    ],
  },
  {
    id: "observability",
    icon: <Activity className="h-5 w-5" />,
    label: "Observability",
    headline: "Know what your system is doing in production",
    summary:
      "A system you cannot observe is a system you cannot debug. Every production failure mode has a corresponding signal — status tracking, request IDs, health endpoints, and structured logs.",
    sections: [
      {
        title: "Document status lifecycle",
        body: `Every uploaded document transitions through states: PENDING → PROCESSING → READY / FAILED. At any point, the /documents/{doc_id} endpoint returns the current status. If a document gets stuck in PROCESSING (e.g., OOM during indexing), the status reveals it. If extraction fails, the error_message field stores the exact exception — visible via API without needing SSH access to the server.`,
        code: `class DocumentStatus(str, enum.Enum):
    PENDING = "PENDING"       # uploaded, not yet indexed
    PROCESSING = "PROCESSING" # background task running
    READY = "READY"           # indexed, queryable
    FAILED = "FAILED"         # indexing crashed — error_message set`,
      },
      {
        title: "Request logging middleware",
        body: `Every HTTP request is logged with: method, path, status code, and response time in milliseconds. Every response carries an X-Request-ID header (8-char UUID) so a client can report a specific request ID to support. A slow query at 4,200ms is immediately visible in logs — no APM tool required for basic performance profiling.`,
        code: `# Every request logged automatically:
# INFO: POST /documents/query → 200 | 4,218ms | req_id=a3f7b2c1
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration_ms:.0f}ms"
        logger.info(f"{method} {path} → {status} | {duration_ms:.0f}ms")`,
      },
      {
        title: "Health endpoint for monitoring",
        body: `The /health endpoint reports: API status, database connectivity, and Ollama reachability. An uptime monitor (UptimeRobot, Pingdom, or a k8s liveness probe) hits /health every 30 seconds. If Ollama goes down, the health check fails and an alert fires — before the first user hits a 500 error.`,
        code: `GET /health → {
    "status": "healthy",
    "version": "1.0.0",
    "database": "connected",
    "ollama": "reachable",       # False → alert fires before users notice
    "ollama_model": "llama3.2:3b"
}`,
      },
      {
        title: "pytest test suite with in-memory test DB",
        body: `The test suite overrides the database URL to SQLite in-memory (:memory:) so tests never touch production data. A conftest.py fixture creates a real test PDF using PyMuPDF so uploads actually have bytes to process. Tests cover: 401 auth rejection, valid upload → 202, oversized file rejection, list pagination shape, single-doc fetch, 404 on missing doc_id, delete, and health check.`,
        code: `@pytest.fixture(scope="session")
def test_pdf_bytes():
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Test document content for integration tests.")
    return doc.tobytes()

# Tests run against real in-memory SQLite — same SQLAlchemy code as prod`,
      },
    ],
  },
  {
    id: "security",
    icon: <Shield className="h-5 w-5" />,
    label: "Security",
    headline: "Threat-modeled before a single line of auth code was written",
    summary:
      "Security is not a feature you add at the end — it is a set of decisions made throughout. Four specific security decisions in this project and why each one matters.",
    sections: [
      {
        title: "API key authentication on every route",
        body: `All endpoints (except /health) require an X-API-Key header. Missing key → 401. Wrong key → 401. The check is a FastAPI Security dependency injected at the router level — it cannot be accidentally omitted from a new route added to an existing router. The key lives in .env and is never hardcoded.`,
        code: `# dependencies.py — auth enforced at router level, not per-route
_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key: str = Security(_api_key_header)) -> str:
    if not api_key:
        raise HTTPException(status_code=401, detail="Missing API key.")
    if api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="Invalid API key.")
    return api_key

# Applied at router level — all routes in the router inherit it:
router = APIRouter(dependencies=[Depends(verify_api_key)])`,
      },
      {
        title: "Path traversal prevention in file storage",
        body: `User-uploaded filenames are never used directly in file paths. Every uploaded PDF is renamed to {doc_id}.pdf where doc_id is a UUID generated server-side. A filename like ../../etc/passwd or ../config.py cannot escape the storage directory because the original filename is discarded entirely.`,
        code: `def save_uploaded_pdf(file_bytes: bytes, doc_id: str) -> str:
    # doc_id is a UUID — user-controlled filename is NEVER used in path
    # Eliminates path traversal risk entirely
    save_path = os.path.join(settings.pdf_storage_dir, f"{doc_id}.pdf")
    with open(save_path, "wb") as f:
        f.write(file_bytes)`,
      },
      {
        title: "No secrets in code — Pydantic Settings from environment",
        body: `Every sensitive value (API key, database URL, Ollama URL) is a Pydantic Settings field. The Settings class reads from a .env file that is gitignored. The default API key value in code is 'dev-api-key-change-in-production' — deliberately obvious so no developer could mistake it for a real key. Production deployments inject secrets via environment variables or Docker secrets.`,
        code: `class Settings(BaseSettings):
    # Default is intentionally obvious — forces change before production
    api_key: str = "dev-api-key-change-in-production"

    # Production: DATABASE_URL=postgresql://user:pass@host:5432/dbname
    database_url: str = f"sqlite:///{BASE_DIR}/storage/documents.db"`,
      },
      {
        title: "File size and type validation",
        body: `Uploads are validated before any bytes are written to disk: file must have content-type application/pdf, and file size must not exceed max_file_size_mb (default 20MB). This prevents disk exhaustion attacks (uploading a 10GB file) and ensures PyMuPDF only receives valid PDF bytes. Both checks happen at the API boundary, before any expensive processing.`,
        code: `# Validate BEFORE writing to disk — fail fast, fail cheap
if file.content_type != "application/pdf":
    raise HTTPException(400, "Only PDF files are accepted.")

file_bytes = await file.read()
if len(file_bytes) > settings.max_file_size_mb * 1024 * 1024:
    raise HTTPException(413, f"File exceeds {settings.max_file_size_mb}MB limit.")`,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="mt-3 overflow-x-auto rounded-lg bg-[#1e2a20] p-4 text-[12px] leading-relaxed text-[#cfe7d7]"
      style={{ fontFamily: "ui-monospace, 'Cascadia Code', monospace" }}
    >
      <code>{code}</code>
    </pre>
  );
}

function PillarSection({
  section,
}: {
  section: { title: string; body: string; code?: string };
}) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="mb-2 text-sm font-semibold text-[color:var(--foreground)]">
        {section.title}
      </h4>
      <p className="text-sm leading-relaxed text-[color:var(--muted-foreground)] whitespace-pre-line">
        {section.body}
      </p>
      {section.code && <CodeBlock code={section.code} />}
    </div>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-card shadow-sm">
      <button
        type="button"
        className="flex w-full items-start gap-4 p-5 text-left hover:bg-[color:var(--muted)] transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="mt-0.5 shrink-0 rounded-lg bg-[color:var(--chart-1)] p-2 text-white">
          {pillar.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--muted-foreground)]">
              {pillar.label}
            </span>
            <ChevronDown
              className={[
                "h-4 w-4 shrink-0 text-[color:var(--muted-foreground)] transition-transform duration-300",
                open ? "rotate-180" : "",
              ].join(" ")}
            />
          </div>
          <p className="mt-1 text-base font-semibold text-[color:var(--foreground)]">
            {pillar.headline}
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
            {pillar.summary}
          </p>
        </div>
      </button>

      {open && (
        <div className="border-t border-[color:var(--border)] bg-[color:var(--secondary)] px-5 py-5">
          {pillar.sections.map((s) => (
            <PillarSection key={s.title} section={s} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Architecture SVG ─────────────────────────────────────────────────────────

function ArchDiagram() {
  const boxes = [
    { x: 20, y: 60, w: 110, h: 44, label: "PDF Upload", sub: "FastAPI + Pydantic", icon: "📄" },
    { x: 170, y: 60, w: 110, h: 44, label: "Background Task", sub: "Status: PENDING→READY", icon: "⚙️" },
    { x: 320, y: 20, w: 120, h: 44, label: "PDF Parsing", sub: "PyMuPDF (fitz)", icon: "📑" },
    { x: 320, y: 100, w: 120, h: 44, label: "Chunker", sub: "Sentence-aware 1200c", icon: "✂️" },
    { x: 490, y: 60, w: 120, h: 44, label: "Embeddings", sub: "all-MiniLM-L6-v2", icon: "🧠" },
    { x: 660, y: 60, w: 110, h: 44, label: "FAISS Index", sub: "Stored on disk", icon: "🗄️" },
    { x: 320, y: 190, w: 120, h: 44, label: "Query API", sub: "doc_id optional", icon: "❓" },
    { x: 490, y: 190, w: 120, h: 44, label: "RAG Prompt", sub: "7 chunks + citations", icon: "📝" },
    { x: 660, y: 190, w: 110, h: 44, label: "Ollama LLM", sub: "Llama 3 (local)", icon: "🤖" },
  ];

  const arrows = [
    { x1: 130, y1: 82, x2: 170, y2: 82 },
    { x1: 280, y1: 72, x2: 320, y2: 42 },
    { x1: 280, y1: 92, x2: 320, y2: 122 },
    { x1: 440, y1: 42, x2: 490, y2: 72 },
    { x1: 440, y1: 122, x2: 490, y2: 92 },
    { x1: 610, y1: 82, x2: 660, y2: 82 },
    { x1: 660, y1: 82, x2: 780, y2: 82, dash: true, label: "search" },
    { x1: 440, y1: 212, x2: 490, y2: 212 },
    { x1: 610, y1: 212, x2: 660, y2: 212 },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[#1e2a20] p-4">
      <svg width="800" height="260" viewBox="0 0 800 260" className="min-w-[700px]">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#2e6b4a" />
          </marker>
        </defs>

        {arrows.map((a, i) => (
          <line
            key={i}
            x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            stroke="#2e6b4a"
            strokeWidth="1.5"
            strokeDasharray={a.dash ? "4 3" : undefined}
            markerEnd="url(#arrow)"
          />
        ))}

        {/* Query path connector */}
        <line x1="320" y1="212" x2="225" y2="212" stroke="#f26a3a" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="225" y1="212" x2="225" y2="104" stroke="#f26a3a" strokeWidth="1.5" />

        <text x="40" y="224" fill="#f26a3a" fontSize="9" fontFamily="monospace">← user query path</text>
        <text x="630" y="56" fill="#2e6b4a" fontSize="9" fontFamily="monospace">index search</text>

        {boxes.map((b) => (
          <g key={b.label}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h}
              rx="6" fill="#243325" stroke="#2e6b4a" strokeWidth="1" />
            <text x={b.x + b.w / 2} y={b.y + 14} textAnchor="middle"
              fill="#cfe7d7" fontSize="10" fontWeight="600">
              {b.icon} {b.label}
            </text>
            <text x={b.x + b.w / 2} y={b.y + 30} textAnchor="middle"
              fill="#7a8078" fontSize="8.5">
              {b.sub}
            </text>
          </g>
        ))}

        <text x="400" y="252" textAnchor="middle" fill="#7a8078" fontSize="9">
          Upload flow (green) — Query flow (orange)
        </text>
      </svg>
    </div>
  );
}

// ─── Metric Cards ─────────────────────────────────────────────────────────────

const METRICS = [
  { icon: <Zap className="h-5 w-5" />, value: "<200ms", label: "Query latency (FAISS search)" },
  { icon: <Cpu className="h-5 w-5" />, value: "1,024", label: "Max tokens per LLM answer" },
  { icon: <Database className="h-5 w-5" />, value: "1,200c", label: "Chunk size (sentence-aware)" },
  { icon: <Layers className="h-5 w-5" />, value: "7 chunks", label: "Context chunks per query" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocumentIntelligencePage() {
  return (
    <main className="min-h-dvh w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 sm:py-14">

        {/* Back nav */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>

        {/* Hero */}
        <div className="mb-10 rounded-2xl border border-[color:var(--border)] bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="mb-2 inline-block rounded-full bg-[color:var(--chart-4)] px-3 py-1 text-xs font-semibold text-[color:var(--chart-1)]">
                Production Project
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
                Document Intelligence API
              </h1>
              <p className="mt-2 text-base text-[color:var(--muted-foreground)] max-w-xl leading-relaxed">
                A privacy-first RAG system that lets businesses upload PDF documents and query them in plain English — with exact page citations. Built for law firms and CA firms where data cannot leave the organization.
              </p>
            </div>
            <a
              href="https://github.com/Sandhyavathi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] px-4 py-2 text-sm font-medium hover:bg-[color:var(--muted)] transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          {/* Tech stack */}
          <div className="mt-6 flex flex-wrap gap-2">
            {TECH_STACK.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--muted)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--muted-foreground)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-[color:var(--border)] bg-card p-4 text-center shadow-sm"
            >
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--chart-4)] text-[color:var(--chart-1)]">
                {m.icon}
              </div>
              <p className="text-xl font-bold text-[color:var(--foreground)]">{m.value}</p>
              <p className="mt-0.5 text-[11px] text-[color:var(--muted-foreground)]">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Demo Video */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold">Live Demo</h2>
          <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[#0e0e16] shadow-lg">
            <div className="px-5 pt-5 pb-3">
              <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                Uploading a PDF, watching the indexing pipeline run in real time (PENDING → PROCESSING → READY), then querying in plain English and receiving an answer with exact page citations.
              </p>
            </div>
            <div className="relative">
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full"
                style={{ display: "block", maxHeight: "520px", background: "#09090e" }}
              >
                <source src="/videos/demo.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold">System Architecture</h2>
          <ArchDiagram />
          <p className="mt-3 text-xs text-[color:var(--muted-foreground)] text-center">
            Upload flow: PDF → PyMuPDF → Sentence chunker → Embeddings → FAISS index.
            Query flow: Question → Embed → FAISS search → RAG prompt → Ollama → Answer with citations.
          </p>
        </section>

        {/* 7 pillars */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Engineering Deep-Dive</h2>
            <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
              Seven dimensions that separate a production system from a tutorial project. Click each pillar to expand the full technical explanation.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {PILLARS.map((p) => (
              <PillarCard key={p.id} pillar={p} />
            ))}
          </div>
        </section>

        {/* Key learnings */}
        <section className="mb-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] p-6">
          <h2 className="mb-4 text-lg font-bold">Key Engineering Learnings</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Context is everything in RAG",
                body: "The LLM is only as good as the context you give it. Improving chunk quality (sentence-aware, 1200c, 200c overlap) had more impact on answer quality than any prompt change.",
              },
              {
                title: "Background tasks need their own DB sessions",
                body: "FastAPI request sessions are request-scoped. Any background task that outlives the HTTP response must create its own SessionLocal() — never share a request-scoped session.",
              },
              {
                title: "Pydantic v2 alias behavior changed from v1",
                body: "In Pydantic v2, Field(alias=...) is bidirectional. Use validation_alias for ORM input mapping and serialization_alias for output-only aliasing. A one-word change that takes an hour to diagnose without knowing the pattern.",
              },
              {
                title: "Local LLMs are production-viable for domain-specific QA",
                body: "Llama 3.2 3B running on a MacBook M1 achieves sub-200ms FAISS retrieval and 4–8s generation for document QA — entirely acceptable UX for professional users who currently spend minutes searching manually.",
              },
            ].map((l) => (
              <div
                key={l.title}
                className="rounded-lg border border-[color:var(--border)] bg-card p-4"
              >
                <h3 className="mb-1 text-sm font-semibold">{l.title}</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-[color:var(--border)] pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
          <a
            href="https://github.com/Sandhyavathi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--chart-1)] hover:underline"
          >
            GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </main>
  );
}
