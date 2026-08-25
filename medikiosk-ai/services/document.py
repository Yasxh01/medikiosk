"""/extract-document — prescription / lab report → structured data.

Chain: free OpenRouter vision model → Gemini vision → canned offline sample.
PDFs are rendered to a PNG of the first page with PyMuPDF before extraction.
"""
import logging

from app import config, fallbacks
from app.llm import prompts
from app.llm.gemini_client import LLMUnavailable, generate_json_vision
from app.llm.openrouter_client import extract_json_from_image
from app.schemas import DocumentExtraction, ExtractDocumentResponse

logger = logging.getLogger(__name__)

_IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


class BadUpload(Exception):
    pass


def _pdf_first_page_to_png(pdf_bytes: bytes) -> bytes:
    import fitz  # PyMuPDF

    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        if doc.page_count == 0:
            raise BadUpload("PDF has no pages")
        pix = doc[0].get_pixmap(dpi=200)
        return pix.tobytes("png")


def _mark_abnormal(extraction: DocumentExtraction) -> None:
    """Double-check abnormal flags with a simple numeric range parse (model may miss some)."""
    for lab in extraction.lab_results:
        rng = lab.ref_range.replace("–", "-")
        if "-" not in rng:
            continue
        try:
            low_s, high_s = rng.split("-", 1)
            low, high = float(low_s.strip()), float(high_s.strip())
            value = float(lab.value.replace(",", "").strip())
            if value < low or value > high:
                lab.abnormal = True
        except ValueError:
            continue


def extract_document(file_bytes: bytes, content_type: str, filename: str) -> ExtractDocumentResponse:
    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise BadUpload("file larger than 10 MB")
    if not file_bytes:
        raise BadUpload("empty file")

    name = (filename or "").lower()
    ctype = (content_type or "").lower()
    if ctype == "application/pdf" or name.endswith(".pdf"):
        image_bytes, mime = _pdf_first_page_to_png(file_bytes), "image/png"
    elif ctype in _IMAGE_TYPES or name.endswith((".png", ".jpg", ".jpeg", ".webp")):
        image_bytes, mime = file_bytes, ctype if ctype in _IMAGE_TYPES else "image/png"
    else:
        raise BadUpload(f"unsupported file type: {content_type or filename}")

    # 1) Free OpenRouter vision model primary
    try:
        data = extract_json_from_image(prompts.EXTRACT_DOCUMENT, image_bytes, mime)
        extraction = DocumentExtraction.model_validate(data)
        _mark_abnormal(extraction)
        return ExtractDocumentResponse(
            extraction=extraction, source_model=config.OPENROUTER_VISION_MODEL, fallback=False
        )
    except (LLMUnavailable, Exception) as exc:
        logger.info("OpenRouter vision failed (%s), trying Gemini vision", exc)

    # 2) Gemini vision backup
    try:
        data = generate_json_vision(prompts.EXTRACT_DOCUMENT, image_bytes, mime)
        extraction = DocumentExtraction.model_validate(data)
        _mark_abnormal(extraction)
        return ExtractDocumentResponse(extraction=extraction, source_model="gemini-vision", fallback=False)
    except (LLMUnavailable, Exception) as exc:
        logger.info("Gemini vision failed (%s), returning offline sample", exc)

    # 3) Offline canned sample — demo never stalls
    return fallbacks.extract_document_fallback()
