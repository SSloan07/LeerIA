
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

modelo = ChatOpenAI(model="gpt-4.1-mini", temperature=0) # En este caso se pone igual a cero, buscando que se determinista

response = modelo.invoke("Hola, esto es solo una prueba. Qué tal?")
print("Resultado de la prueba: ",response)