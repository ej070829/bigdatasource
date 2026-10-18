from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = "AIzaSyC-f5F7zZqWCEUTyfW04ql2a8wbECJ9cF8"

if not api_key:
    raise ValueError("GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.")

client = genai.Client(api_key=api_key)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data:
        return jsonify({"error": "요청 데이터가 없습니다."}), 400

    user_input = data.get("message", "").strip()

    if not user_input:
        return jsonify({"error": "메시지가 비어 있습니다."}), 400

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_input
        )

        reply_text = response.text if response.text else "응답을 생성하지 못했습니다."

        return jsonify({"reply": reply_text})

    except Exception as e:
        return jsonify({"error": f"Gemini 호출 중 오류 발생: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)