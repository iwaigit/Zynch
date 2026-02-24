import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
print(f"Probando API Key: {api_key[:10]}...")

try:
    genai.configure(api_key=api_key)
    print("Listando modelos disponibles:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - {m.name}")
except Exception as e:
    print(f"Error detectado: {e}")
