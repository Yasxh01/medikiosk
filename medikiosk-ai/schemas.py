"""Strict JSON schemas for every AI endpoint.

These Pydantic models ARE the API contract. The backend team (ai.service.js)
and Postman collection are built against exactly these shapes — do not change
field names after the 22 Aug contract freeze.
"""
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Shared building blocks
# ---------------------------------------------------------------------------


class PatientInfo(BaseModel):
    name: str = ""
    age: Optional[int] = None
    gender: str = ""


class QA(BaseModel):
    """One answered interview question."""

    question_id: str
    question: str
    answer: str


class HPI(BaseModel):
    """History of present illness (SOCRATES-style fields)."""

    onset: str = ""
    duration: str = ""
    character: str = ""
    location: str = ""
    radiation: str = ""
    aggravating_factors: str = ""
    relieving_factors: str = ""
    severity: str = ""
    associated_symptoms: List[str] = Field(default_factory=list)
    progression: str = ""


class StructuredHistory(BaseModel):
    chief_complaint: str = ""
    hpi: HPI = Field(default_factory=HPI)
    past_medical_history: List[str] = Field(default_factory=list)
    past_surgical_history: List[str] = Field(default_factory=list)
    medications: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    family_history: List[str] = Field(default_factory=list)
    personal_history: List[str] = Field(default_factory=list)
    review_of_systems: List[str] = Field(default_factory=list)


class Medication(BaseModel):
    name: str = ""
    dose: str = ""
    frequency: str = ""
    duration: str = ""


class LabResult(BaseModel):
    test: str = ""
    value: str = ""
    unit: str = ""
    ref_range: str = ""
    abnormal: bool = False


class DocumentExtraction(BaseModel):
    document_type: Literal["prescription", "lab_report", "discharge_summary", "other"] = "other"
    date: str = ""
    doctor_name: str = ""
    medications: List[Medication] = Field(default_factory=list)
    diagnoses: List[str] = Field(default_factory=list)
    lab_results: List[LabResult] = Field(default_factory=list)
    raw_text: str = ""
    confidence: float = 0.0


class RedFlag(BaseModel):
    flag: str
    category: str
    severity: Literal["HIGH", "MODERATE"] = "MODERATE"
    reason: str = ""
    confidence: float = 0.5


class SummarySection(BaseModel):
    title: str
    content: str


# ---------------------------------------------------------------------------
# /next-question
# ---------------------------------------------------------------------------


class NextQuestionRequest(BaseModel):
    chief_complaint: str
    answers: List[QA] = Field(default_factory=list)
    language: str = "en"
    max_questions: int = 6


class NextQuestionResponse(BaseModel):
    question_id: str = ""
    question: str = ""
    input_type: Literal["voice", "choice", "both"] = "both"
    options: List[str] = Field(default_factory=list)
    done: bool = False
    progress: float = 0.0
    fallback: bool = False


# ---------------------------------------------------------------------------
# /generate-history
# ---------------------------------------------------------------------------


class GenerateHistoryRequest(BaseModel):
    chief_complaint: str
    answers: List[QA] = Field(default_factory=list)
    patient: Optional[PatientInfo] = None
    free_text: str = ""


class GenerateHistoryResponse(BaseModel):
    history: StructuredHistory
    fallback: bool = False


# ---------------------------------------------------------------------------
# /red-flags
# ---------------------------------------------------------------------------


class RedFlagsRequest(BaseModel):
    text: str = ""
    history: Optional[StructuredHistory] = None


class RedFlagsResponse(BaseModel):
    red_flags: List[RedFlag] = Field(default_factory=list)
    priority: Literal["EMERGENCY", "URGENT", "ROUTINE"] = "ROUTINE"
    disclaimer: str = (
        "This is a priority-for-clinical-review signal generated from the patient's "
        "own words. It is not a diagnosis. A qualified clinician must review."
    )
    fallback: bool = False


# ---------------------------------------------------------------------------
# /generate-summary
# ---------------------------------------------------------------------------


class GenerateSummaryRequest(BaseModel):
    history: StructuredHistory
    documents: List[DocumentExtraction] = Field(default_factory=list)
    patient: Optional[PatientInfo] = None


class GenerateSummaryResponse(BaseModel):
    sections: List[SummarySection] = Field(default_factory=list)
    summary_text: str = ""
    fallback: bool = False


# ---------------------------------------------------------------------------
# /extract-document
# ---------------------------------------------------------------------------


class ExtractDocumentResponse(BaseModel):
    extraction: DocumentExtraction
    source_model: str = ""
    fallback: bool = False


# ---------------------------------------------------------------------------
# /health
# ---------------------------------------------------------------------------


class HealthResponse(BaseModel):
    status: str = "ok"
    gemini_configured: bool = False
    openrouter_configured: bool = False
    version: str = ""
