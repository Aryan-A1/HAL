import os
import random
import string
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, Body, Request
from groq import Groq
from pydantic import BaseModel
from gtts import gTTS

router = APIRouter(prefix="", tags=["chatbot"])

class ChatJSONRequest(BaseModel):
    message: str

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
STATIC_AUDIO_DIR = os.path.join(BASE_DIR, "static", "audio")
ALLOWED_EXTENSIONS = {"webm", "wav", "mp3", "m4a"}

load_dotenv()


def _ensure_dirs() -> None:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(STATIC_AUDIO_DIR, exist_ok=True)


def _sanitize_filename(name: str) -> str:
    name = os.path.basename(name)
    allowed = set(string.ascii_letters + string.digits + "._-")
    cleaned = "".join(ch for ch in name if ch in allowed)
    if not cleaned:
        cleaned = "audio_input.wav"
    return cleaned


def _allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _transcribe_audio_groq(client: Groq, filepath: str) -> str:
    with open(filepath, "rb") as f:
        response = client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=f,
        )
        return response.text


def _get_answer_groq(client: Groq, question: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system", 
                "content": "You are HAL AI, a specialized agriculture assistant for Indian farmers. Answer the user's question directly and concisely. Only provide seasonal overviews or detailed guides if explicitly asked. Use friendly yet professional language."
            },
            {"role": "user", "content": question},
        ],
    )
    return response.choices[0].message.content


def _text_to_audio(text: str, filename: str) -> str:
    tts = gTTS(text)
    audio_path = os.path.join(STATIC_AUDIO_DIR, f"{filename}.mp3")
    tts.save(audio_path)
    return audio_path


def _append_cta(question: str, answer: str) -> str:
    q = (question or "").lower()
    ctas = []

    irrigation_terms = ["irrigation", "irrigate", "watering", "water schedule", "drip", "sprinkler"]
    disease_terms = ["disease", "pest", "fungus", "blight", "infection", "rust", "mildew"]

    if any(term in q for term in irrigation_terms):
        ctas.append("If you want detailed plan for your irrigation then you can visit our smart irrigation section.")
    if any(term in q for term in disease_terms):
        ctas.append("You can visit our disease detection section.")

    if not ctas:
        return answer

    return f"{answer}\n\n" + " ".join(ctas)


@router.post("/chat")
async def chat(
    request: Request,
    audio: Optional[UploadFile] = File(default=None),
    text: Optional[str] = Form(default=None),
):
    # Try to get data from JSON first
    json_data = None
    form_data = await request.form()
    
    if request.headers.get("content-type") == "application/json":
        try:
            json_data = await request.json()
        except:
            pass

    # Support 'message' or 'text' from either JSON or Form
    input_text = (
        text or 
        form_data.get("message") or 
        form_data.get("text") or 
        (json_data.get("message") if json_data else None) or
        (json_data.get("text") if json_data else None)
    )
    
    _ensure_dirs()

    api_key = os.getenv("GROQ_API_KEY")
    groq_client = None
    if api_key:
        groq_client = Groq(api_key=api_key)
    
    # Mock fallback for demonstration if API key is missing
    def _mock_answer(question: str) -> str:
        return f"I'm HAL AI. I received your question: '{question}'. (Note: Provide GROQ_API_KEY in .env for real AI responses)"

    if audio is not None:
        filename = _sanitize_filename(audio.filename or "audio_input.wav")
        if not _allowed_file(filename):
            raise HTTPException(status_code=400, detail="Unsupported audio file type")

        filepath = os.path.join(UPLOAD_DIR, filename)
        content = await audio.read()
        with open(filepath, "wb") as f:
            f.write(content)

        if groq_client:
            transcription = _transcribe_audio_groq(groq_client, filepath)
            answer = _get_answer_groq(groq_client, transcription)
        else:
            transcription = "Simulation of audio transcription"
            answer = _mock_answer(transcription)

        answer = _append_cta(transcription, answer)
        voice_filename = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        _text_to_audio(answer, voice_filename)

        return {
            "reply": answer,
            "transcription": transcription,
            "voice": f"/static/audio/{voice_filename}.mp3",
        }

    # input_text is already determined above
    if input_text:
        if groq_client:
            answer = _get_answer_groq(groq_client, input_text)
        else:
            answer = _mock_answer(input_text)

        answer = _append_cta(input_text, answer)
        voice_filename = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        _text_to_audio(answer, voice_filename)
        return {
            "reply": answer,
            "voice": f"/static/audio/{voice_filename}.mp3",
        }

    raise HTTPException(status_code=400, detail="No valid input found")
