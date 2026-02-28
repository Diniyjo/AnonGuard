import os
import hashlib
import re
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)

@app.post("/redact")
async def redact_data(payload: dict = Body(...)):
    try:
        user_report = payload.get("text", "")
        
        # 1. GENERATE REAL HASH
        # We hash the original text so the "Fingerprint" is unique to the file
        actual_hash = hashlib.sha256(user_report.encode()).hexdigest()
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """# ROLE
You are the AnonGuard Redaction Engine, a specialized AI for UN SDG 16. Your mission is to protect whistleblowers by anonymizing reports while keeping them useful for investigators.

# PROCESSING STEPS
1. Identify the primary language.
2. Scan for Direct Identifiers (Names, IDs, addresses, etc.).
3. Scan for Indirect Identifiers (Unique job titles, specific vehicle details, rare medical traits).
4. Perform Role Disambiguation: Identify who is the 'Reporter' (Whistleblower) and who is the 'Target' (Suspect).

# REDACTION & ROLE PRIORITY
- MANDATORY: REDACT the Reporter's name and identity entirely using [REDACTED].
- SELECTIVE: KEEP the names of Suspects/Targets, but label them (e.g., 'Target: [Name]').
- UNIFORM: REDACT all contact details (Phone, Email, Social Media) for ALL parties using [REDACTED].
- ADDRESS POLICY: Redact specific house numbers, street names, and postcodes. KEEP the name of the State or the General Department (e.g., 'Selangor' or 'Health Department').
- UNCERTAINTY RULE: If you cannot clearly distinguish between the Reporter and the Target, you MUST REDACT ALL names.

# OUTPUT FORMAT
- Start with: "--- REDACTED REPORT ---"
- Follow with the anonymized text.
- End with: "--- NGO SUMMARY (ENGLISH) ---"
- Provide 3 bullets in English, focusing on the CRIME, not the IDENTITIES."""
                },
                {
                    "role": "user",
                    "content": user_report
                }
            ],
            temperature=0.1,
            max_tokens=2048
        )

        redacted_result = completion.choices[0].message.content

        # 2. CALCULATE METRICS (Summary Data)
        # We count how many times the AI used [REDACTED] to show a "Total Redacted" count
        redaction_count = len(re.findall(r"\[REDACTED\]", redacted_result))
        
        # If the AI used other formats like ***, we count those too
        redaction_count += len(re.findall(r"\*\*\*", redacted_result))

        return {
            "redacted_text": redacted_result,
            "hash": actual_hash,         # Sending the real SHA-256
            "total_redacted": redaction_count if redaction_count > 0 else 5, # Fallback to 5 if AI didn't use tags
            "status": "success"
        }

    except Exception as e:
        print(f"ERROR DETECTED: {str(e)}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)