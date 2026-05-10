from openai import OpenAI

from app.core.config import OPENAI_API_KEY

CHAT_MODEL = "gpt-4.1-mini"

client = OpenAI(api_key=OPENAI_API_KEY)