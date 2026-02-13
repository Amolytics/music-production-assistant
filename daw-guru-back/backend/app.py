
# --- WebSocket signaling for real-time collaboration and screen sharing ---
from fastapi import FastAPI, WebSocket, UploadFile, File, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from ai_services.models.music import AIMusicModel
from daw_adapter import DAWAdapter
import sys
import asyncio
sys.path.append("./routes")
from routes.tutorials import router as tutorials_router

app = FastAPI()

active_connections = set()

@app.websocket("/ws/collab")
async def websocket_collab(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast received message to all other connections
            for conn in active_connections:
                if conn != websocket:
                    await conn.send_text(data)
    except Exception:
        pass
    finally:
        active_connections.remove(websocket)

import time
session_history = []
current_session = {"goal": None, "progress": None, "start_time": None, "end_time": None, "uploads": 0, "reminders": 0}
analytics = {"total_sessions": 0, "total_time": 0, "total_uploads": 0, "total_reminders": 0, "goals_completed": 0}

@app.get("/session-info")
def get_session_info():
    last_summary = session_history[-1]["progress"] if session_history else ""
    return {"current_goal": current_session["goal"], "last_summary": last_summary}

@app.get("/analytics")
def get_analytics():
    return analytics

@app.post("/session-start")
def start_session():
    global current_session
    current_session = {"goal": session_goal, "progress": None, "start_time": time.time(), "end_time": None, "uploads": 0, "reminders": 0}
    return {"status": "started", "goal": current_session["goal"]}

@app.post("/session-end")
async def end_session(request: Request):
    global current_session, session_history, session_goal, analytics
    data = await request.json()
    progress = data.get("progress", "")
    current_session["end_time"] = time.time()
    session_time = (current_session["end_time"] or 0) - (current_session["start_time"] or 0)
    analytics["total_sessions"] += 1
    analytics["total_time"] += max(0, session_time)
    analytics["total_uploads"] += current_session.get("uploads", 0)
    analytics["total_reminders"] += current_session.get("reminders", 0)
    if progress.strip():
        analytics["goals_completed"] += 1
    session_history.append({"goal": current_session["goal"], "progress": progress, "duration": session_time, "uploads": current_session.get("uploads", 0)})
    session_goal = None
    current_session = {"goal": None, "progress": None, "start_time": None, "end_time": None, "uploads": 0, "reminders": 0}
    return {"status": "ended", "summary": progress}
# --- DAW Workflow Update Endpoint ---
workflow_state = {}

@app.post("/workflow-update")
async def workflow_update(request: Request):
    global workflow_state
    data = await request.json()
    workflow_state = data
    return {"status": "received", "workflow_state": workflow_state}

from fastapi import FastAPI, WebSocket, UploadFile, File, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from ai_services.models.music import AIMusicModel
from daw_adapter import DAWAdapter
import sys
sys.path.append("./routes")
 


app = FastAPI()
app.include_router(tutorials_router)


# Add root route for health check and frontend requests
@app.get("/")
def read_root():
    return {"status": "ok"}

# Serve favicon.ico
@app.get("/favicon.ico")
def favicon():
    return FileResponse("favicon.ico")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_daw = None
user_daw_version = None
user_name = None
reminder_enabled = True
reminder_interval = 15  # minutes
session_goal = None
favorite_genres = []
ai = AIMusicModel()
daw_adapter = None
# chat_messages is an in-memory store for demo purposes.
# For production, use persistent storage (database, Redis, etc.) for chat and file uploads.
chat_messages = []

# --- Real-time collaboration chat and file sharing ---

# --- AI Teacher/Producer Chat ---

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    context = []
    user_skill_level = None
    user_name = None
    asked_name = False
    while True:
        data = await websocket.receive_text()
        chat_messages.append(data)
        context.append({"user": data})
        user_message = data.strip()
        user_message_lower = user_message.lower()

        # --- Name Detection (free-form) ---
        if user_name is None:
            import re
            # Accept a variety of name introductions
            name_patterns = [
                r"my name is ([a-zA-Z0-9_\- ]+)",
                r"i'?m ([a-zA-Z0-9_\- ]+)",
                r"call me ([a-zA-Z0-9_\- ]+)",
                r"it'?s ([a-zA-Z0-9_\- ]+)",
                r"you can call me ([a-zA-Z0-9_\- ]+)",
                r"name[:]? ([a-zA-Z0-9_\- ]+)"
            ]
            found_name = None
            for pat in name_patterns:
                match = re.search(pat, user_message_lower)
                if match:
                    found_name = match.group(1).strip().title()
                    break
            if found_name:
                user_name = found_name
                asked_name = False
            elif not asked_name:
                ai_reply = "Hey! Before we get started, what should I call you?"
                context.append({"ai": ai_reply})
                await websocket.send_text(ai_reply)
                asked_name = True
                continue

        # --- Skill Level Detection (simple heuristic) ---
        if any(word in user_message for word in ["just started", "beginner", "first time", "new to", "not sure how", "what does this do"]):
            user_skill_level = "beginner"
        elif any(word in user_message for word in ["advanced", "pro", "been using", "years", "expert", "workflow", "template"]):
            user_skill_level = "advanced"
        elif user_skill_level is None:
            user_skill_level = "intermediate"

        # --- Intent/Topic Detection ---
        if any(word in user_message for word in ["help", "how do i", "what's the best way", "stuck", "advice"]):
            if user_skill_level == "beginner":
                ai_reply = f"Of course, {user_name}! Since you’re just starting out, I can walk you through each step. Would you like button-by-button instructions for your DAW? If so, just tell me what you’re trying to do."
            else:
                ai_reply = f"No worries, {user_name}! If you want a hand, just let me know what you’re working on and I’ll offer some relaxed tips. Take your time, I’m here when you need me."

        elif "chord progression" in user_message or "chords" in user_message or "suggest chords" in user_message:
            # Try to extract genre and mood if mentioned
            import re
            genre = None
            mood = None
            genre_match = re.search(r"(pop|rock|jazz|edm|hip hop|trap|house|metal|country|blues|folk)", user_message)
            if genre_match:
                genre = genre_match.group(1).title()
            mood_match = re.search(r"(happy|sad|moody|dark|bright|uplifting|chill|energetic|romantic|melancholy)", user_message)
            if mood_match:
                mood = mood_match.group(1).title()
            progression = ai.suggest_chord_progression(genre or "Pop", mood or "Happy")
            ai_reply = f"Here’s a {genre or 'Pop'} {mood or 'Happy'} chord progression you can try, {user_name}: {' - '.join(progression)}. Want more options or a different style? Just ask!"
        elif "mix" in user_message:
            ai_reply = ai.suggest_plugin("mix") + f" Mixing can be a vibe—start with levels, then add a touch of EQ or compression if you feel like it, {user_name}. If you want a walkthrough, just ask."
        elif "master" in user_message:
            ai_reply = ai.suggest_plugin("loudness") + f" Mastering? Keep it chill: a limiter and a quick A/B with your favorite tracks goes a long way, {user_name}. More details if you want them, just say the word."
        elif any(word in user_message for word in ["button by button", "step by step", "walkthrough"]):
            daw = user_daw or ""
            task = ""
            for t in ["add track", "export", "mix", "record", "plugin", "midi", "audio", "save", "render"]:
                if t in user_message:
                    task = t
                    break
            if daw and task:
                ai_reply = ai.button_by_button_instructions(daw, task)
            else:
                ai_reply = f"Happy to help, {user_name}! Please tell me your DAW (e.g., Ableton, FL Studio, Logic, etc.) and exactly what you want to do, and I’ll give you button-by-button instructions."
        elif user_skill_level == "beginner":
            ai_reply = f"If you ever want a step-by-step guide for anything in your DAW, just ask, {user_name}! I’m here to make things easy."
        else:
            ai_reply = f"Hey {user_name}, I’m just hanging out in the background. If you want advice or feedback, just ask—no pressure!"

        # --- Maintain context (last 10 exchanges) ---
        if len(context) > 20:
            context = context[-20:]
        context.append({"ai": ai_reply})
        await websocket.send_text(ai_reply)


# --- TTS: Text-to-Speech ---
from fastapi.responses import StreamingResponse
import io

@app.post("/tts")
async def tts(request: Request):
    data = await request.json()
    text = data.get("text")
    voice = data.get("voice", "default")
    audio_data = ai.text_to_speech(text, voice)
    return StreamingResponse(io.BytesIO(audio_data), media_type="audio/wav")

# --- STT: Speech-to-Text ---
@app.post("/stt")
async def stt(file: UploadFile = File(...), language: str = "en"):
    audio_data = await file.read()
    text = ai.speech_to_text(audio_data, language)
    return {"text": text}

@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    # Save file to disk or cloud storage
    import os
    content = await file.read()
    filename = file.filename
    os.makedirs("uploads", exist_ok=True)
    with open(f"uploads/{filename}", "wb") as f:
        f.write(content)
    # AI instant feedback (audio or text)
    feedback = None
    if filename.lower().endswith(('.wav', '.mp3', '.flac', '.ogg')):
        feedback = ai.analyze_audio(content) or "Upload received! (Audio analysis coming soon.)"
    elif filename.lower().endswith(('.txt', '.lyric', '.lyrics')):
        feedback = ai.generate_lyrics(audio_data=content) or "Upload received! (Lyric analysis coming soon.)"
    else:
        feedback = "Upload received! (Unsupported file type for instant feedback.)"
    # Track upload in current session
    try:
        current_session["uploads"] += 1
    except Exception:
        pass
    return {"filename": filename, "status": "uploaded", "feedback": feedback}

@app.post("/setup")
async def setup(request: Request):
    global user_daw, user_daw_version, daw_adapter, api_key, user_name, reminder_enabled, reminder_interval, session_goal, favorite_genre
    data = await request.json()
    name = data.get("name")
    daw = data.get("daw")
    daw_version = data.get("daw_version")
    api_key = data.get("api_key")
    reminder = data.get("reminder_enabled")
    interval = data.get("reminder_interval")
    goal = data.get("session_goal")
    fav_genres = data.get("favorite_genres")
    if name:
        user_name = name
    user_daw = daw
    user_daw_version = daw_version
    if reminder is not None:
        reminder_enabled = bool(reminder)
    if interval is not None:
        try:
            reminder_interval = int(interval)
        except Exception:
            reminder_interval = 15
    if goal is not None:
        session_goal = goal
    if fav_genres is not None:
        if isinstance(fav_genres, list):
            favorite_genres.clear()
            favorite_genres.extend(fav_genres)
        elif isinstance(fav_genres, str):
            favorite_genres.clear()
            favorite_genres.extend([g.strip() for g in fav_genres.split(",") if g.strip()])
    if daw and daw != "Other":
        daw_adapter = DAWAdapter(daw, daw_version)
        daw_adapter.connect()
    else:
        daw_adapter = None
    status = "setup complete"
    if api_key:
        status += " (API key saved)"
    return {"status": status, "daw": daw, "daw_version": daw_version, "api_key": api_key, "name": user_name, "reminder_enabled": reminder_enabled, "reminder_interval": reminder_interval, "session_goal": session_goal, "favorite_genres": favorite_genres}

@app.get("/user-info")
def get_user_info():
    return {"name": user_name, "daw": user_daw, "daw_version": user_daw_version, "reminder_enabled": reminder_enabled, "reminder_interval": reminder_interval, "session_goal": session_goal, "favorite_genres": favorite_genres}
@app.post("/generate-lyrics")
def generate_lyrics(style: str, emotion: str, language: str, vocal_type: str, ethnicity: str, genre: str, topic: str, output_type: str, song_file: UploadFile = File(None)):
    # Use DAW adapter if available
    if daw_adapter:
        project_info = daw_adapter.get_project_info()
    if output_type == "lyrics":
        return {"lyrics": ai.generate_lyrics(style=style, topic=topic)}
    else:
        # Placeholder: handle song_file and generate sung vocals
        lyrics = ai.generate_lyrics(style=style, topic=topic)
        sung_audio = ai.generate_sung_lyrics(lyrics, emotion=emotion, ethnicity=ethnicity, language=language, style=style, voice=vocal_type)
        return {"lyrics": lyrics, "audio": "SUNG_AUDIO_PLACEHOLDER"}

@app.get("/chord-progression")
def chord_progression(genre: str = "Pop", mood: str = "Happy"):
    return {"progression": ai.suggest_chord_progression(genre, mood)}

@app.get("/search-sample")
def search_sample(description: str, genre: str = None):
    return {"sample_url": ai.search_free_sample(description, genre)}

# Add more endpoints as needed for TTS, STT, plugin scan, etc.


# Plugin management endpoints
plugins_list = ["EQ", "Compressor", "Reverb", "Delay", "Synth", "Limiter"]

@app.get("/scan-plugins")
def scan_plugins():
    return {"plugins": plugins_list}

@app.post("/add-plugin")
async def add_plugin(request: Request):
    data = await request.json()
    name = data.get("name")
    if name and name not in plugins_list:
        plugins_list.append(name)
    return {"plugins": plugins_list}

# DAW-agnostic endpoint to send sample to DAW
@app.post("/send-to-daw")
async def send_to_daw(request: Request):
    global daw_adapter
    data = await request.json()
    sample_url = data.get("sample_url")
    if daw_adapter:
        # DAW-agnostic: perform action for any DAW
        result = daw_adapter.perform_action("add_sample", {"url": sample_url})
        return {"status": "sent", "daw": daw_adapter.daw_name, "result": result}
    else:
        return {"status": "no DAW connected", "sample_url": sample_url}
