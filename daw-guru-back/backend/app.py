from fastapi import Depends
from fastapi.security import APIKeyHeader

# API key authentication
API_KEY = os.environ.get("DAWGURU_API_KEY", "changeme")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

def verify_api_key(key: str = Depends(api_key_header)):
    if key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

from __future__ import annotations

import os
from typing import Optional, Dict, List

from fastapi import FastAPI, WebSocket, UploadFile, File, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_services.models.music import AIMusicModel
from daw_adapter import DAWAdapter

# -----------------------------------------------------------------------------
# FastAPI app
# -----------------------------------------------------------------------------
app = FastAPI(title="DAW Guru Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_ORIGIN", "*")],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.environ.get("DAWGURU_UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Store user DAW selection (simple in-memory; for production use DB/session)
user_daw: Optional[str] = None
user_daw_version: Optional[str] = None
daw_adapter: Optional[DAWAdapter] = None

# AI: defaults to Ollama local (no key needed)
ai = AIMusicModel(
    provider=os.environ.get("DAWGURU_PROVIDER", "ollama"),
    ollama_host=os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434"),
    ollama_model=os.environ.get("OLLAMA_MODEL", "llama3.1"),
    openai_model=os.environ.get("OPENAI_MODEL", "gpt-4.1-mini"),
)

# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class SetupPayload(BaseModel):
    name: Optional[str] = None
    daw: Optional[str] = None
    daw_version: Optional[str] = None
    api_key: Optional[str] = None  # if provided => switch to OpenAI


class ChatPayload(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    history: Optional[List[Dict[str, str]]] = None  # [{"role":"user/assistant","content":"..."}]


# -----------------------------------------------------------------------------
# Health
# -----------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "provider": ai.provider,
        "ollama_host": ai.ollama_host,
        "ollama_model": ai.ollama_model,
        "openai_model": ai.openai_model,
    }


# -----------------------------------------------------------------------------
# WebSocket chat (NOW REAL AI, not echo)
# -----------------------------------------------------------------------------
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()

    convo: List[Dict[str, str]] = [
        {
            "role": "system",
            "content": (
                "You are DAW Guru, a practical music production assistant. "
                "Be concise, actionable, and DAW-friendly. Ask 1 short question "
                "only when truly needed."
            ),
        }
    ]

    try:
        while True:
            user_text = await websocket.receive_text()
            user_text = (user_text or "").strip()

            if not user_text:
                await websocket.send_text("Say something and I’ll help.")
                continue

            if len(user_text) > 4000:
                await websocket.send_text("That message is too long (max 4000 chars).")
                continue

            convo.append({"role": "user", "content": user_text})

            try:
                reply = await ai.chat_async(convo)
            except Exception as e:
                await websocket.send_text(f"AI error: {type(e).__name__}: {e}")
                continue

            convo.append({"role": "assistant", "content": reply})
            await websocket.send_text(reply)

    except Exception:
        return


# -----------------------------------------------------------------------------
# REST chat (easy to test)
# -----------------------------------------------------------------------------
@app.post("/chat")
async def chat(payload: ChatPayload, key: str = Depends(verify_api_key)):
    msg = payload.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="message is required")

    base = [
        {
            "role": "system",
            "content": (
                "You are DAW Guru, a practical music production assistant. "
                "Be concise, actionable, and DAW-friendly."
            ),
        }
    ]

    history = payload.history or []
    trimmed: List[Dict[str, str]] = []
    for item in history[-20:]:
        r = (item.get("role") or "").strip()
        c = (item.get("content") or "").strip()
        if r in ("user", "assistant") and c:
            trimmed.append({"role": r, "content": c})

    convo = base + trimmed + [{"role": "user", "content": msg}]

    try:
        reply = await ai.chat_async(convo)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")

    return {"reply": reply}


# -----------------------------------------------------------------------------
# Uploads
# -----------------------------------------------------------------------------
@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...), key: str = Depends(verify_api_key)):
    MAX_BYTES = 20 * 1024 * 1024  # 20MB
    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 20MB).")

    filename = file.filename or "upload.bin"
    safe_name = filename.replace("\\", "_").replace("/", "_").strip()
    path = os.path.join(UPLOAD_DIR, safe_name)

    with open(path, "wb") as f:
        f.write(content)

    return {"filename": safe_name, "status": "uploaded", "path": path}


# -----------------------------------------------------------------------------
# Setup
# -----------------------------------------------------------------------------
@app.post("/setup")
async def setup(payload: SetupPayload, key: str = Depends(verify_api_key)):
    global user_daw, user_daw_version, daw_adapter

    user_daw = payload.daw
    user_daw_version = payload.daw_version

    if payload.api_key:
        ai.set_openai_key(payload.api_key)
        ai.provider = "openai"

    if user_daw and user_daw != "Other":
        daw_adapter = DAWAdapter(user_daw, user_daw_version)
        try:
            daw_adapter.connect()
        except Exception:
            daw_adapter = None
    else:
        daw_adapter = None

    return {
        "status": "setup complete",
        "daw": user_daw,
        "daw_version": user_daw_version,
        "provider": ai.provider,
    }


# -----------------------------------------------------------------------------
# Existing endpoints preserved
# -----------------------------------------------------------------------------
@app.post("/generate-lyrics")
async def generate_lyrics(request: Request, key: str = Depends(verify_api_key)):
    data = await request.json()
    style = data.get("style", "pop")
    topic = data.get("topic", "love")
    emotion = data.get("emotion", None)
    language = data.get("language", "en")
    vocal_type = data.get("vocal_type", "default")

    lyrics = await ai.generate_lyrics_async(style=style, topic=topic, emotion=emotion, language=language)
    return {"lyrics": lyrics, "voice": vocal_type, "style": style}


@app.get("/chord-progression")
async def chord_progression(genre: str = "Pop", mood: str = "Happy", key: str = Depends(verify_api_key)):
    prog = await ai.suggest_chord_progression_async(genre=genre, mood=mood)
    return {"progression": prog}


@app.get("/search-sample")
async def search_sample(description: str, genre: str = None, key: str = Depends(verify_api_key)):
    result = await ai.search_free_sample_async(description, genre)
    return {"result": result}


plugins_list = ["EQ", "Compressor", "Reverb", "Delay", "Synth", "Limiter"]


@app.get("/scan-plugins")
async def scan_plugins(key: str = Depends(verify_api_key)):
    return {"plugins": plugins_list}


@app.post("/add-plugin")
async def add_plugin(request: Request, key: str = Depends(verify_api_key)):
    data = await request.json()
    name = (data.get("name") or "").strip()
    if name and name not in plugins_list:
        plugins_list.append(name)
    return {"plugins": plugins_list}


@app.post("/send-to-daw")
async def send_to_daw(request: Request, key: str = Depends(verify_api_key)):
    data = await request.json()
    sample_url = data.get("sample_url")

    if daw_adapter:
        result = daw_adapter.perform_action("add_sample", {"url": sample_url})
        return {"status": "sent", "daw": daw_adapter.daw_name, "result": result}

    return {"status": "no DAW connected", "sample_url": sample_url}
