import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# CORS allows your Vite app (usually port 5173) to talk to this Python server
CORS(app) 

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

@app.route('/redact', methods=['POST'])
def redact():
    try:
        data = request.json
        user_input = data.get("text", "")

        model = "gemini-2.0-flash" # Use the latest stable model
        
        generate_content_config = types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
            system_instruction="You are a strict Data Anonymization Engine. Replace names, addresses, and phone numbers with [REDACTED]. At the end, add an 'NGO SUMMARY' section in English.",
        )

        response = client.models.generate_content(
            model=model,
            contents=user_input,
            config=generate_content_config,
        )

        return jsonify({"redactedText": response.text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)