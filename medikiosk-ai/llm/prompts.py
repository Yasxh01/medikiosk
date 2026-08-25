"""Every prompt in one place. Each prompt spells out the exact JSON shape so the
models return predictable, schema-valid output even when uncertain."""

SYSTEM_CLINICAL = (
    "You are the AI engine of MediKiosk, a hospital self-service intake kiosk in India. "
    "You structure what the PATIENT says — you never diagnose, never suggest treatment, "
    "and never invent facts the patient did not state. Patients may mix Hindi and English "
    "(Hinglish, e.g. 'seene me dard' = chest pain, 'bukhar' = fever); understand it and "
    "output in simple English. When a field is unknown, use an empty string or empty list. "
    "Always return ONLY the requested JSON object — no prose, no markdown."
)

NEXT_QUESTION = """A patient at the kiosk reported this chief complaint: "{chief_complaint}"

Questions already answered:
{answers_block}

You are conducting a clinical history interview like a doctor would (SOCRATES framework:
Site, Onset, Character, Radiation, Associated symptoms, Timing, Exacerbating/relieving
factors, Severity — plus relevant past/drug/allergy history).

Ask the SINGLE next most useful question. Rules:
- Simple words a first-time, low-literacy patient understands. One question only.
- Provide 3-5 tap-to-answer options covering the most likely answers, when natural.
- Maximum {max_questions} questions total; {asked} already asked. Set "done": true when
  enough history is collected or the limit is reached.

Return ONLY this JSON:
{{
  "question_id": "q{next_index}",
  "question": "<the question>",
  "input_type": "both",
  "options": ["<option1>", "<option2>", "..."],
  "done": false
}}"""

GENERATE_HISTORY = """Structure this kiosk interview into a clinical history.

Patient: {patient_line}
Chief complaint: "{chief_complaint}"
Extra free text from patient: "{free_text}"

Interview answers:
{answers_block}

Return ONLY this JSON (empty string/list when the patient gave no information — do NOT guess):
{{
  "chief_complaint": "<short clinical phrasing>",
  "hpi": {{
    "onset": "", "duration": "", "character": "", "location": "", "radiation": "",
    "aggravating_factors": "", "relieving_factors": "", "severity": "",
    "associated_symptoms": [], "progression": ""
  }},
  "past_medical_history": [],
  "past_surgical_history": [],
  "medications": [],
  "allergies": [],
  "family_history": [],
  "personal_history": [],
  "review_of_systems": []
}}"""

RED_FLAGS = """Screen this patient-reported information for EMERGENCY warning signs
(red flags) that need priority clinical review — e.g. possible cardiac chest pain,
stroke signs, severe breathing difficulty, severe bleeding, altered consciousness,
very high fever with rigors, suicidal thoughts.

Patient information:
{text}

Rules:
- Flag only what the text supports. This is triage prioritisation, NOT a diagnosis.
- severity "HIGH" = needs emergency attention now; "MODERATE" = should be seen soon.

Return ONLY this JSON:
{{
  "red_flags": [
    {{"flag": "<short name>", "category": "<cardiac|neuro|respiratory|bleeding|infection|mental_health|other>",
      "severity": "HIGH", "reason": "<which patient words triggered this>", "confidence": 0.9}}
  ],
  "priority": "EMERGENCY"
}}
priority: "EMERGENCY" if any HIGH flag, "URGENT" if only MODERATE flags, else "ROUTINE".
If there are no red flags return {{"red_flags": [], "priority": "ROUTINE"}}."""

GENERATE_SUMMARY = """Write a concise physician-ready clinical intake summary from this
structured data. The doctor will read it in under 30 seconds before seeing the patient.

Patient: {patient_line}
Structured history JSON:
{history_json}

Digitized prior documents JSON:
{documents_json}

Return ONLY this JSON — every section 1-3 short sentences, "None reported" when empty:
{{
  "sections": [
    {{"title": "Chief Complaint", "content": "..."}},
    {{"title": "History of Present Illness", "content": "..."}},
    {{"title": "Past Medical/Surgical History", "content": "..."}},
    {{"title": "Drug & Allergy History", "content": "..."}},
    {{"title": "Family History", "content": "..."}},
    {{"title": "Personal History", "content": "..."}},
    {{"title": "Review of Systems", "content": "..."}},
    {{"title": "Prior Investigations & Documents", "content": "..."}}
  ],
  "summary_text": "<all sections rendered as plain text, one 'Title: content' line each>"
}}"""

EXTRACT_DOCUMENT = """This image is a patient's medical document from India (prescription,
lab report, or discharge summary — possibly low quality). Read it carefully and extract
structured data. Transcribe what is written; do not invent values.

Return ONLY this JSON:
{
  "document_type": "prescription",
  "date": "<date on the document, DD-MM-YYYY, or empty>",
  "doctor_name": "<doctor/hospital name or empty>",
  "medications": [
    {"name": "<medicine>", "dose": "<e.g. 500 mg>", "frequency": "<e.g. twice daily (BD)>", "duration": "<e.g. 5 days>"}
  ],
  "diagnoses": ["<diagnosis or clinical note>"],
  "lab_results": [
    {"test": "<test name>", "value": "<number>", "unit": "<unit>", "ref_range": "<e.g. 13-17>", "abnormal": false}
  ],
  "raw_text": "<full transcription of the document>",
  "confidence": 0.9
}
document_type must be one of: prescription, lab_report, discharge_summary, other.
Expand Indian frequency shorthand: OD=once daily, BD=twice daily, TDS=three times daily,
QID=four times daily, HS=at bedtime, SOS=when needed.
Mark lab_results abnormal=true when the value is outside the reference range."""
