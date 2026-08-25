"""MediKiosk AI Service — FastAPI entry point.

Run:  uvicorn app.main:app --port 8000
Docs: http://localhost:8000/docs
"""
import logging

from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import config, fallbacks
from app.schemas import (
    ExtractDocumentResponse,
    GenerateHistoryRequest,
    GenerateHistoryResponse,
    GenerateSummaryRequest,
    GenerateSummaryResponse,
    HealthResponse,
    NextQuestionRequest,
    NextQuestionResponse,
    RedFlagsRequest,
    RedFlagsResponse,
)
from app.services import document, history, questioning, redflags, summary

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("medikiosk")

app = FastAPI(
    title="MediKiosk AI Service",
    description="AI history-taking, red-flag triage, summarization and document intelligence.",
    version=config.SERVICE_VERSION,
)

# The Node backend (and the Streamlit demo) call this service from other ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo rule: never let the frontend see a 500 — every path has a schema-valid fallback.
_PATH_FALLBACKS = {
    "/next-question": lambda: fallbacks.next_question_fallback(),
    "/generate-history": lambda: fallbacks.history_fallback(""),
    "/red-flags": lambda: fallbacks.red_flags_fallback(),
    "/generate-summary": lambda: fallbacks.summary_fallback("Chief Complaint: None reported"),
    "/extract-document": lambda: fallbacks.extract_document_fallback(),
}


@app.exception_handler(Exception)
async def global_fallback_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s: %s", request.url.path, exc)
    maker = _PATH_FALLBACKS.get(request.url.path)
    if maker:
        return JSONResponse(status_code=200, content=maker().model_dump())
    return JSONResponse(status_code=500, content={"detail": "internal error"})


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        gemini_configured=bool(config.GEMINI_API_KEY),
        openrouter_configured=bool(config.OPENROUTER_API_KEY),
        version=config.SERVICE_VERSION,
    )


@app.post("/next-question", response_model=NextQuestionResponse)
def next_question(req: NextQuestionRequest) -> NextQuestionResponse:
    return questioning.next_question(req)


@app.post("/generate-history", response_model=GenerateHistoryResponse)
def generate_history(req: GenerateHistoryRequest) -> GenerateHistoryResponse:
    return history.generate_history(req)


@app.post("/red-flags", response_model=RedFlagsResponse)
def red_flags(req: RedFlagsRequest) -> RedFlagsResponse:
    return redflags.detect_red_flags(req)


@app.post("/generate-summary", response_model=GenerateSummaryResponse)
def generate_summary(req: GenerateSummaryRequest) -> GenerateSummaryResponse:
    return summary.generate_summary(req)


@app.post("/extract-document", response_model=ExtractDocumentResponse)
async def extract_document(file: UploadFile = File(...)) -> ExtractDocumentResponse:
    file_bytes = await file.read()
    try:
        return document.extract_document(file_bytes, file.content_type or "", file.filename or "")
    except document.BadUpload as exc:
        return JSONResponse(  # type: ignore[return-value]
            status_code=400,
            content={"detail": str(exc), "extraction": None, "fallback": True},
        )
