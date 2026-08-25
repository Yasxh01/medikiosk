"""Free OpenRouter vision model — primary document reader.

Note: OpenRouter retired the free Qwen-VL tier (paid-only since ~Aug 2026), so we
use the best free document-capable vision model instead (configurable via
OPENROUTER_VISION_MODEL in .env). Gemini vision remains the automatic backup.
"""
import base64
import json
import logging

from app import config
from app.llm.gemini_client import LLMUnavailable, _parse_json

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    if _client is None:
        if not config.OPENROUTER_API_KEY:
            raise LLMUnavailable("OPENROUTER_API_KEY is not configured")
        from openai import OpenAI

        _client = OpenAI(
            base_url=config.OPENROUTER_BASE_URL,
            api_key=config.OPENROUTER_API_KEY,
            timeout=config.LLM_TIMEOUT,
            max_retries=1,
        )
    return _client


def extract_json_from_image(prompt: str, image_bytes: bytes, mime_type: str) -> dict:
    """Send an image + extraction prompt to the vision model, return the parsed JSON dict."""
    client = _get_client()
    data_url = f"data:{mime_type};base64,{base64.b64encode(image_bytes).decode()}"
    try:
        resp = client.chat.completions.create(
            model=config.OPENROUTER_VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": data_url}},
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
            temperature=0.1,
        )
        text = resp.choices[0].message.content or ""
        return _parse_json(text)
    except LLMUnavailable:
        raise
    except (json.JSONDecodeError, Exception) as exc:
        logger.warning("OpenRouter vision call failed: %s", exc)
        raise LLMUnavailable(str(exc))
