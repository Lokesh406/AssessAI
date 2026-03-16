from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
import re
import requests
import os
import json
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Regex for MCQ extraction
MCQ_REGEX = r"(\d+\.\s*.+?)\s*A\)(.+?)\s*B\)(.+?)\s*C\)(.+?)\s*D\)(.+?)(?=\n?\d+\.|$)"

@app.post("/extract-mcqs/")
async def extract_mcqs(file: UploadFile = File(...)):
    contents = await file.read()
    with open("temp.pdf", "wb") as f:
        f.write(contents)
    text = ""
    with pdfplumber.open("temp.pdf") as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    matches = re.findall(MCQ_REGEX, text, re.DOTALL)
    questions = []
    for match in matches:
        questions.append({
            "question": match[0].strip(),
            "options": [match[1].strip(), match[2].strip(), match[3].strip(), match[4].strip()]
        })
    return {"count": len(questions), "questions": questions}

# --- New Section: Scenario-based Question Generation ---
class GenRequest(BaseModel):
    topics: str
    num_questions: int

@app.post("/generate-questions/")
async def generate_questions(req: GenRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return {"error": "OPENROUTER_API_KEY not configured"}
    
    topics = [t.strip() for t in req.topics.replace('\n', ',').split(',') if t.strip()]
    prompt = (
        f"Generate {req.num_questions} scenario-based questions for a quiz. "
        f"Each question should mix at least two of these topics: {', '.join(topics)}. "
        f"Each question must have at least three sub-questions (subproblems), "
        f"and sub-questions should be scenario-based, not just factual. "
        f"Format as JSON: [{{'main': '...', 'subs': ['...', '...', ...]}}]"
    )
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Question Generator",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "openrouter/auto",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            return {"error": f"OpenRouter API error: {response.status_code} - {response.text}"}
        
        data = response.json()
        
        # Safely extract content from response
        if 'choices' not in data or len(data['choices']) == 0:
            return {"error": f"Invalid API response: {data}"}
        
        content = data['choices'][0].get('message', {}).get('content', '')
        
        if not content:
            return {"error": "Empty response from API"}
        
        # Clean up markdown code blocks
        cleaned_content = content
        if "```json" in cleaned_content:
            cleaned_content = cleaned_content.replace("```json", "").replace("```", "")
        elif "```" in cleaned_content:
            cleaned_content = cleaned_content.replace("```", "")
        
        cleaned_content = cleaned_content.strip()
        
        # Try to parse as JSON
        try:
            questions = json.loads(cleaned_content)
        except json.JSONDecodeError as e:
            return {
                "error": f"Could not parse AI response as JSON: {str(e)}",
                "raw_response": content
            }
        
        # Ensure questions is a list
        if not isinstance(questions, list):
            questions = [questions]
        
        # Validate structure
        for q in questions:
            if not isinstance(q, dict) or 'main' not in q or 'subs' not in q:
                return {
                    "error": "Invalid question structure",
                    "expected": "[{\"main\": \"...\", \"subs\": [\"...\", \"...\"]}]",
                    "received": questions
                }
        
        return {
            "questions": questions
        }
    except requests.exceptions.Timeout:
        return {"error": "API request timed out"}
    except Exception as e:
        return {"error": f"Error generating questions: {str(e)}"}
