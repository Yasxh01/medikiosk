"""/generate-history — free-form interview answers → structured clinical history."""
import logging

from app import fallbacks
from app.llm import prompts
from app.llm.gemini_client import LLMUnavailable, generate_json
from app.schemas import GenerateHistoryRequest, GenerateHistoryResponse, StructuredHistory

logger = logging.getLogger(__name__)


def _patient_line(req: GenerateHistoryRequest) -> str:
    p = req.patient
    if not p:
        return "unknown"
    parts = [p.name or "unknown"]
    if p.age is not None:
        parts.append(f"{p.age} years")
    if p.gender:
        parts.append(p.gender)
    return ", ".join(parts)


def generate_history(req: GenerateHistoryRequest) -> GenerateHistoryResponse:
    answers_block = "\n".join(f"- Q: {a.question}\n  A: {a.answer}" for a in req.answers) or "(none)"
    prompt = prompts.GENERATE_HISTORY.format(
        patient_line=_patient_line(req),
        chief_complaint=req.chief_complaint,
        free_text=req.free_text or "(none)",
        answers_block=answers_block,
    )
    try:
        data = generate_json(prompt, system=prompts.SYSTEM_CLINICAL)
        history = StructuredHistory.model_validate(data)
        if not history.chief_complaint:
            history.chief_complaint = req.chief_complaint
        return GenerateHistoryResponse(history=history, fallback=False)
    except (LLMUnavailable, Exception) as exc:
        logger.info("generate-history falling back: %s", exc)
        answers_text = "; ".join(f"{a.question} -> {a.answer}" for a in req.answers)
        return fallbacks.history_fallback(req.chief_complaint, answers_text)
