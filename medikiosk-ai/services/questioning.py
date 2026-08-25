"""Adaptive interview engine for /next-question.

Primary: Gemini picks the next best SOCRATES-style question.
Fallback: deterministic static question trees (chest pain / fever / generic) so the
rehearsed demo works even fully offline.
"""
import logging

from app import fallbacks
from app.llm import prompts
from app.llm.gemini_client import LLMUnavailable, generate_json
from app.schemas import NextQuestionRequest, NextQuestionResponse

logger = logging.getLogger(__name__)

CHEST_PAIN_TREE = [
    {"question": "When did the chest pain start?", "options": ["Less than 1 hour ago", "Today", "Yesterday", "A few days ago"]},
    {"question": "What does the pain feel like?", "options": ["Heavy / pressure", "Burning", "Sharp / stabbing", "Dull ache"]},
    {"question": "Does the pain spread anywhere else?", "options": ["Left arm", "Jaw or neck", "Back", "No, only chest"]},
    {"question": "Do you have any of these along with the pain?", "options": ["Sweating", "Breathlessness", "Nausea / vomiting", "None of these"]},
    {"question": "How bad is the pain from 1 to 10?", "options": ["1-3 (mild)", "4-6 (moderate)", "7-10 (severe)"]},
    {"question": "Do you have any ongoing illness or take daily medicines?", "options": ["Diabetes", "High blood pressure", "Heart problem", "None"]},
]

FEVER_TREE = [
    {"question": "How many days have you had fever?", "options": ["Since today", "2-3 days", "4-7 days", "More than a week"]},
    {"question": "Does the fever come with shivering or chills?", "options": ["Yes, strong shivering", "Mild chills", "No"]},
    {"question": "Do you have any of these with the fever?", "options": ["Cough / cold", "Body ache", "Vomiting / loose motion", "Rash", "None"]},
    {"question": "Have you taken any medicine for the fever?", "options": ["Paracetamol", "Other medicine", "Nothing yet"]},
    {"question": "Do you have any ongoing illness or allergy to a medicine?", "options": ["Diabetes", "Blood pressure", "Medicine allergy", "None"]},
]

GENERIC_TREE = [
    {"question": "When did this problem start?", "options": ["Today", "Yesterday", "A few days ago", "More than a week ago"]},
    {"question": "Is the problem getting better, worse, or the same?", "options": ["Getting worse", "Same", "Getting better"]},
    {"question": "Does anything make it better or worse?", "options": ["Worse with activity", "Worse with food", "Better with rest", "Nothing specific"]},
    {"question": "Do you have any other symptoms along with this?", "options": ["Fever", "Weakness / tiredness", "Loss of appetite", "None"]},
    {"question": "Do you have any ongoing illness or take daily medicines?", "options": ["Diabetes", "Blood pressure", "Thyroid", "None"]},
]

_CHEST_WORDS = ("chest", "seene", "seena", "chhati", "heart pain")
_FEVER_WORDS = ("fever", "bukhar", "bukhaar", "temperature")


def _pick_tree(chief_complaint: str) -> list:
    cc = chief_complaint.lower()
    if any(w in cc for w in _CHEST_WORDS):
        return CHEST_PAIN_TREE
    if any(w in cc for w in _FEVER_WORDS):
        return FEVER_TREE
    return GENERIC_TREE


def _static_next(req: NextQuestionRequest) -> NextQuestionResponse:
    tree = _pick_tree(req.chief_complaint)
    idx = len(req.answers)
    limit = min(req.max_questions, len(tree))
    if idx >= limit:
        return NextQuestionResponse(done=True, progress=1.0, fallback=True)
    node = tree[idx]
    return NextQuestionResponse(
        question_id=f"q{idx + 1}",
        question=node["question"],
        input_type="both",
        options=node["options"],
        done=False,
        progress=round(idx / limit, 2),
        fallback=True,
    )


def next_question(req: NextQuestionRequest) -> NextQuestionResponse:
    asked = len(req.answers)
    if asked >= req.max_questions:
        return NextQuestionResponse(done=True, progress=1.0)

    answers_block = "\n".join(f"- Q: {a.question}\n  A: {a.answer}" for a in req.answers) or "(none yet)"
    prompt = prompts.NEXT_QUESTION.format(
        chief_complaint=req.chief_complaint,
        answers_block=answers_block,
        max_questions=req.max_questions,
        asked=asked,
        next_index=asked + 1,
    )
    try:
        data = generate_json(prompt, system=prompts.SYSTEM_CLINICAL)
        resp = NextQuestionResponse(
            question_id=str(data.get("question_id") or f"q{asked + 1}"),
            question=str(data.get("question") or ""),
            input_type=data.get("input_type") if data.get("input_type") in ("voice", "choice", "both") else "both",
            options=[str(o) for o in (data.get("options") or [])][:5],
            done=bool(data.get("done", False)),
            progress=round(asked / req.max_questions, 2),
        )
        if not resp.done and not resp.question:
            raise LLMUnavailable("model returned empty question")
        if resp.done:
            resp.progress = 1.0
        return resp
    except LLMUnavailable as exc:
        logger.info("next-question falling back to static tree: %s", exc)
        return _static_next(req)
