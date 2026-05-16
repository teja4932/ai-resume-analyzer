from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import pdfplumber
import os

# Load environment variables
load_dotenv()

# Groq client
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer Running"}

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    text = ""

    # Extract PDF text
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()

            if extracted:
                text += extracted

    prompt = f"""
Analyze this resume and provide:

1. ATS Score
2. Technical Skills
3. Strengths
4. Weaknesses
5. Improvement Suggestions
6. Recommended Job Roles

Resume:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    analysis = response.choices[0].message.content

    return {
        "resume_text": text[:1000],
        "analysis": analysis
    }