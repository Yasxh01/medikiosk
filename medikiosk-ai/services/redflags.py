"""/red-flags — emergency symptom screening.

Two layers:
1. Deterministic keyword rules (below) — these can only ADD flags, never remove,
   so the rehearsed demo case (chest pain + sweating) fires EVERY time, offline or not.
2. Gemini screening for anything the rules miss.
"""
import logging

from app import fallbacks
from app.llm import prompts
from app.llm.gemini_client import LLMUnavailable, generate_json
from app.schemas import RedFlag, RedFlagsRequest, RedFlagsResponse

logger = logging.getLogger(__name__)

# (flag name, category, severity, primary keywords, supporting keywords)
# A rule fires when a primary keyword is present AND (no supporting list, or one matches).
_RULES = [
    ("Possible cardiac chest pain", "cardiac", "HIGH",
     ["chest pain", "seene me dard", "chest heaviness", "heavy / pressure", "chest pressure"],
     ["sweating", "left arm", "jaw", "breathless", "pasina", "nausea"]),
    ("Chest pain (unspecified)", "cardiac", "MODERATE",
     ["chest pain", "seene me dard", "chhati me dard"], []),
    ("Possible stroke signs", "neuro", "HIGH",
     ["face drooping", "slurred speech", "one side weak", "weakness on one side", "cannot move arm", "sudden confusion"], []),
    ("Severe breathing difficulty", "respiratory", "HIGH",
     ["cannot breathe", "severe breathless", "gasping", "saans nahi", "difficulty breathing at rest", "blue lips"], []),
    ("Severe bleeding", "bleeding", "HIGH",
     ["heavy bleeding", "blood not stopping", "vomiting blood", "khoon", "blood in stool", "coughing blood"], []),
    ("Loss of consciousness", "neuro", "HIGH",
     ["unconscious", "fainted", "fits", "seizure", "behosh"], []),
    ("High fever with rigors", "infection", "MODERATE",
     ["fever", "bukhar"],
     ["shivering", "rigors", "104", "103", "very high", "strong shivering"]),
    ("Self-harm risk", "mental_health", "HIGH",
     ["suicide", "kill myself", "end my life", "self harm"], []),
]


def _rule_scan(text: str) -> list[RedFlag]:
    t = text.lower()
    flags: list[RedFlag] = []
    for name, category, severity, primary, supporting in _RULES:
        if not any(k in t for k in primary):
            continue
        if supporting and not any(k in t for k in supporting):
            continue
        flags.append(RedFlag(
            flag=name, category=category, severity=severity,
            reason="Patient's words matched known emergency pattern (rule check).",
            confidence=0.95,
        ))
    # Keep the strongest cardiac flag only (HIGH beats MODERATE for the same category).
    if any(f.category == "cardiac" and f.severity == "HIGH" for f in flags):
        flags = [f for f in flags if not (f.category == "cardiac" and f.severity == "MODERATE")]
    return flags


def _merge(rule_flags: list[RedFlag], ai_flags: list[RedFlag]) -> list[RedFlag]:
    seen = {f.flag.lower() for f in rule_flags}
    merged = list(rule_flags)
    for f in ai_flags:
        if f.flag.lower() not in seen:
            merged.append(f)
            seen.add(f.flag.lower())
    return merged


def _priority(flags: list[RedFlag]) -> str:
    if any(f.severity == "HIGH" for f in flags):
        return "EMERGENCY"
    if flags:
        return "URGENT"
    return "ROUTINE"


def detect_red_flags(req: RedFlagsRequest) -> RedFlagsResponse:
    text = req.text or ""
    if req.history:
        text += " " + req.history.model_dump_json()
    if not text.strip():
        return fallbacks.red_flags_fallback()

    rule_flags = _rule_scan(text)

    ai_flags: list[RedFlag] = []
    used_fallback = False
    try:
        data = generate_json(prompts.RED_FLAGS.format(text=text[:6000]), system=prompts.SYSTEM_CLINICAL)
        for item in data.get("red_flags", []):
            try:
                ai_flags.append(RedFlag.model_validate(item))
            except Exception:
                continue
    except LLMUnavailable as exc:
        logger.info("red-flags AI layer unavailable, rules-only: %s", exc)
        used_fallback = True

    flags = _merge(rule_flags, ai_flags)
    return RedFlagsResponse(red_flags=flags, priority=_priority(flags), fallback=used_fallback)
