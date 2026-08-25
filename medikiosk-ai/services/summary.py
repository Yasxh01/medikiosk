"""/generate-summary — physician-ready intake summary.

Primary: Gemini writes the 8-section summary.
Fallback: deterministic template rendered straight from the structured history,
so a readable summary always exists.
"""
import json
import logging

from app import fallbacks
from app.llm import prompts
from app.llm.gemini_client import LLMUnavailable, generate_json
from app.schemas import (
    GenerateSummaryRequest,
    GenerateSummaryResponse,
    SummarySection,
)

logger = logging.getLogger(__name__)


def _join(items: list, empty: str = "None reported") -> str:
    return ", ".join(str(i) for i in items) if items else empty


def _template_summary(req: GenerateSummaryRequest) -> str:
    h = req.history
    hpi_bits = []
    for label, val in [
        ("onset", h.hpi.onset), ("duration", h.hpi.duration), ("character", h.hpi.character),
        ("location", h.hpi.location), ("radiation", h.hpi.radiation),
        ("aggravated by", h.hpi.aggravating_factors), ("relieved by", h.hpi.relieving_factors),
        ("severity", h.hpi.severity), ("progression", h.hpi.progression),
    ]:
        if val:
            hpi_bits.append(f"{label}: {val}")
    if h.hpi.associated_symptoms:
        hpi_bits.append("associated symptoms: " + ", ".join(h.hpi.associated_symptoms))

    doc_bits = []
    for d in req.documents:
        meds = ", ".join(m.name for m in d.medications) or "no medications listed"
        abnormal = [f"{l.test} {l.value} {l.unit} (ref {l.ref_range})" for l in d.lab_results if l.abnormal]
        doc_bits.append(
            f"{d.document_type.replace('_', ' ')} dated {d.date or 'unknown'}: {meds}"
            + (f"; ABNORMAL: {', '.join(abnormal)}" if abnormal else "")
        )

    lines = [
        f"Chief Complaint: {h.chief_complaint or 'None reported'}",
        f"History of Present Illness: {'; '.join(hpi_bits) or 'None reported'}",
        f"Past Medical/Surgical History: {_join(h.past_medical_history + h.past_surgical_history)}",
        f"Drug & Allergy History: medications - {_join(h.medications)}; allergies - {_join(h.allergies, 'none known')}",
        f"Family History: {_join(h.family_history)}",
        f"Personal History: {_join(h.personal_history)}",
        f"Review of Systems: {_join(h.review_of_systems, 'unremarkable / not elicited')}",
        f"Prior Investigations & Documents: {'; '.join(doc_bits) or 'No prior documents uploaded'}",
    ]
    return "\n".join(lines)


def _patient_line(req: GenerateSummaryRequest) -> str:
    p = req.patient
    if not p:
        return "unknown"
    bits = [p.name or "unknown"]
    if p.age is not None:
        bits.append(f"{p.age} years")
    if p.gender:
        bits.append(p.gender)
    return ", ".join(bits)


def generate_summary(req: GenerateSummaryRequest) -> GenerateSummaryResponse:
    prompt = prompts.GENERATE_SUMMARY.format(
        patient_line=_patient_line(req),
        history_json=req.history.model_dump_json(),
        documents_json=json.dumps([d.model_dump() for d in req.documents]) or "[]",
    )
    try:
        data = generate_json(prompt, system=prompts.SYSTEM_CLINICAL)
        sections = [SummarySection.model_validate(s) for s in data.get("sections", [])]
        summary_text = str(data.get("summary_text") or "")
        if not sections:
            raise LLMUnavailable("model returned no sections")
        if not summary_text:
            summary_text = "\n".join(f"{s.title}: {s.content}" for s in sections)
        return GenerateSummaryResponse(sections=sections, summary_text=summary_text, fallback=False)
    except (LLMUnavailable, Exception) as exc:
        logger.info("generate-summary falling back to template: %s", exc)
        return fallbacks.summary_fallback(_template_summary(req))
