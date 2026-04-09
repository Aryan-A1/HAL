import os
import random
import string
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from groq import Groq
from gtts import gTTS

router = APIRouter(prefix="", tags=["chatbot"])

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
            {"role": "system", "content": "You are a helpful agriculture chatbot for Indian farmers."},
            {"role": "user", "content": "Give a Brief Of Agriculture Seasons in India"},
            {
                "role": "system",
                "content": "In India, the agricultural season consists of three major seasons: the Kharif (monsoon), the Rabi (winter), and the Zaid (summer)...",
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
    audio: Optional[UploadFile] = File(default=None),
    text: Optional[str] = Form(default=None),
):
    _ensure_dirs()

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")

    groq_client = Groq(api_key=api_key)

    if audio is not None:
        filename = _sanitize_filename(audio.filename or "audio_input.wav")
        if not _allowed_file(filename):
            raise HTTPException(status_code=400, detail="Unsupported audio file type")

        filepath = os.path.join(UPLOAD_DIR, filename)
        content = await audio.read()
        with open(filepath, "wb") as f:
            f.write(content)

        transcription = _transcribe_audio_groq(groq_client, filepath)
        answer = _get_answer_groq(groq_client, transcription)
        answer = _append_cta(transcription, answer)
        voice_filename = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        _text_to_audio(answer, voice_filename)

        return {
            "text": f"🎤 Transcribed: {transcription}\n\n🤖 Answer: {answer}",
            "voice": f"/static/audio/{voice_filename}.mp3",
        }

    if text:
        answer = _get_answer_groq(groq_client, text)
        answer = _append_cta(text, answer)
        voice_filename = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        _text_to_audio(answer, voice_filename)
        return {
            "text": answer,
            "voice": f"/static/audio/{voice_filename}.mp3",
        }

    raise HTTPException(status_code=400, detail="No valid input found")
