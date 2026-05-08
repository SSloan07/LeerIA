import os
import re
import unicodedata
from pathlib import Path
from uuid import uuid4
from datetime import datetime


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