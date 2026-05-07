from dotenv import load_dotenv 
from supabase import create_client
import os

load_dotenv() # Con esto cargamos las variables de entorno 

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

response = supabase.table("subjects").select("*").execute() # Esto es sol una prueba . Aquí estamos trayendo Todas las materias que tengamos en supabase. Pero pues, como apenas la creamos debería salir vacía. 

print(response.data)