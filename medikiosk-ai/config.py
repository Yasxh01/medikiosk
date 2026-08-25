"""Central configuration. All secrets come from .env — never hardcode keys."""
import os
from pathlib import Path
from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(PROJECT_ROOT.parent / ".env")

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "").strip()


GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip()


OPENROUTER_VISION_MODEL: str = os.getenv(
    "OPENROUTER_VISION_MODEL", "dots-studio/dots-3-note-preview:free"
).strip()

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

try:
    LLM_TIMEOUT: float = float(os.getenv("LLM_TIMEOUT", "25"))
except ValueError:
    LLM_TIMEOUT = 25.0

SERVICE_VERSION = "1.0.0"
