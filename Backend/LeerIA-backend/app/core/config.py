
from dotenv import load_dotenv
import os
load_dotenv()

SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")

if not SUPABASE_BUCKET:
    raise ValueError("No se encontró SUPABASE_BUCKET en .env")