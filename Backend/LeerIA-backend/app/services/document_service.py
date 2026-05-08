import os
import re
import unicodedata
from pathlib import Path
from uuid import uuid4
from datetime import datetime


ALLOWED_EXTENSIONS = {".pdf", ".docx", ".pptx", ".txt"}


def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()


def is_allowed_file(filename: str) -> bool:
    return get_file_extension(filename) in ALLOWED_EXTENSIONS


def clean_filename(filename: str) -> str:
    filename = os.path.basename(filename)

    path = Path(filename)
    stem = path.stem
    extension = path.suffix.lower()

    stem = unicodedata.normalize("NFKD", stem)
    stem = stem.encode("ascii", "ignore").decode("ascii")

    stem = stem.lower()
    stem = re.sub(r"[\s\-]+", "_", stem)
    stem = re.sub(r"[^a-z0-9_]", "", stem)
    stem = re.sub(r"_+", "_", stem).strip("_")

    if not stem:
        stem = "documento"

    date_prefix = datetime.utcnow().strftime("%Y-%m-%d")
    short_id = uuid4().hex[:8]

    return f"{date_prefix}_{stem}_{short_id}{extension}"


def build_storage_path(subject_id: str, filename: str) -> str:
    safe_filename = clean_filename(filename)
    return f"subjects/{subject_id}/{safe_filename}"