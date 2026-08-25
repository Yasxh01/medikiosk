"""Gemini client wrapper.

Every call returns a parsed dict or raises LLMUnavailable. Callers decide the
fallback — this module never invents clinical content on its own.
"""
import json
import logging
from app import config

logger = logging.getLogger(__name__)


class LLMUnavailable(Exception):
    """Raised when the model cannot produce usable JSON (no key / network / bad output)."""


_client = None


def _get_client():
    global _client
    if not config.GEMINI_API_KEY:
        logger.warning("[GEMINI CLIENT] GEMINI_API_KEY is missing in medikiosk-ai/.env!")
        raise LLMUnavailable("GEMINI_API_KEY is not configured in medikiosk-ai/.env")

    if _client is None:
        from google import genai
        logger.info("[GEMINI CLIENT] Initializing Google Gemini Client with API Key...")
        _client = genai.Client(api_key=config.GEMINI_API_KEY)
    return _client


def _parse_json(text: str) -> dict:
    text = (text or "").strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise LLMUnavailable(f"no JSON object in model output: {text[:200]!r}")
    return json.loads(text[start : end + 1])


def generate_json(prompt: str, system: str = "") -> dict:
    """Text in → dict out. One retry, then LLMUnavailable."""
    return _generate(contents=prompt, system=system)


def generate_json_vision(prompt: str, image_bytes: bytes, mime_type: str, system: str = "") -> dict:
    """Image + text in → dict out (used as backup document reader)."""
    from google.genai import types

    parts = [
        types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
        types.Part.from_text(text=prompt),
    ]
    return _generate(contents=parts, system=system)


def _generate(contents, system: str) -> dict:
    from google.genai import types

    client = _get_client()
    logger.info("[GEMINI CLIENT] Calling Google Gemini API (Model: %s)...", config.GEMINI_MODEL)
    
    cfg = types.GenerateContentConfig(
        response_mime_type="application/json",
        system_instruction=system or None,
        temperature=0.2,
        http_options=types.HttpOptions(timeout=int(config.LLM_TIMEOUT * 1000)),
    )
    last_err = None
    for attempt in range(2):
        try:
            resp = client.models.generate_content(
                model=config.GEMINI_MODEL, contents=contents, config=cfg
            )
            logger.info("[GEMINI CLIENT] Gemini Response Received Successfully!")
            return _parse_json(resp.text)
        except Exception as exc:
            last_err = exc
            logger.warning("[GEMINI CLIENT] Gemini attempt %d failed: %s", attempt + 1, exc)
    raise LLMUnavailable(str(last_err))
