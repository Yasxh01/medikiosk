"""Canned, schema-valid responses used when both AI providers fail.

The demo rule: the frontend must NEVER see a 500 or malformed JSON. Every
fallback here validates against the schemas in app/schemas.py and carries
fallback=True so the UI can show a subtle 'offline mode' hint if it wants.
"""
from app.schemas import (
    DocumentExtraction,
    ExtractDocumentResponse,
    GenerateHistoryResponse,
    GenerateSummaryResponse,
    HPI,
    LabResult,
    Medication,
    NextQuestionResponse,
    RedFlagsResponse,
    StructuredHistory,
    SummarySection,
)


def next_question_fallback(question_id: str = "q1", progress: float = 0.0) -> NextQuestionResponse:
    return NextQuestionResponse(
        question_id=question_id,
        question="Please tell me more about your problem. When did it start?",
        input_type="both",
        options=["Today", "Yesterday", "A few days ago", "More than a week ago"],
        done=False,
        progress=progress,
        fallback=True,
    )


def history_fallback(chief_complaint: str, answers_text: str = "") -> GenerateHistoryResponse:
    return GenerateHistoryResponse(
        history=StructuredHistory(
            chief_complaint=chief_complaint or "Not recorded",
            hpi=HPI(associated_symptoms=[], progression=answers_text[:300]),
        ),
        fallback=True,
    )


def red_flags_fallback() -> RedFlagsResponse:
    return RedFlagsResponse(red_flags=[], priority="ROUTINE", fallback=True)


def summary_fallback(summary_text: str) -> GenerateSummaryResponse:
    sections = []
    for line in summary_text.splitlines():
        if ":" in line:
            title, content = line.split(":", 1)
            sections.append(SummarySection(title=title.strip(), content=content.strip() or "None reported"))
    return GenerateSummaryResponse(sections=sections, summary_text=summary_text, fallback=True)


def extract_document_fallback() -> ExtractDocumentResponse:
    """Pre-prepared extraction matching samples/prescription.png so the demo never stalls."""
    return ExtractDocumentResponse(
        extraction=DocumentExtraction(
            document_type="prescription",
            date="18-08-2026",
            doctor_name="Dr. R. Sharma, City Care Clinic",
            medications=[
                Medication(name="Paracetamol (Dolo 650)", dose="650 mg", frequency="three times daily (TDS)", duration="3 days"),
                Medication(name="Azithromycin", dose="500 mg", frequency="once daily (OD)", duration="5 days"),
                Medication(name="Pantoprazole", dose="40 mg", frequency="once daily before breakfast", duration="5 days"),
            ],
            diagnoses=["Acute febrile illness", "Suspected respiratory tract infection"],
            lab_results=[
                LabResult(test="Hemoglobin", value="10.2", unit="g/dL", ref_range="13-17", abnormal=True),
                LabResult(test="Total WBC", value="12800", unit="/cumm", ref_range="4000-11000", abnormal=True),
            ],
            raw_text="(offline sample) Rx: Dolo 650 TDS x3d, Azithromycin 500 OD x5d, Pantoprazole 40 OD.",
            confidence=0.4,
        ),
        source_model="offline-fallback",
        fallback=True,
    )
