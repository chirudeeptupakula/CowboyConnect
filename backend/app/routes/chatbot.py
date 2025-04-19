from fastapi import APIRouter, Request
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

@router.post("/chatbot")
async def chatbot(request: Request):
    data = await request.json()
    user_message = data.get("message", "")

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistralai/mistral-7b-instruct",  # free-tier model
        "messages": [
            {"role": "system", "content": "You are CowboyConnect Assistant, helping users with courses, events, and more."},
            {"role": "user", "content": user_message}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code == 200:
        reply = response.json()["choices"][0]["message"]["content"]
        return {"reply": reply}
    else:
        return {"reply": "Sorry, something went wrong."}
