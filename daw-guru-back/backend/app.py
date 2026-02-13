
import os
import openai
from fastapi import FastAPI, WebSocket, UploadFile, File, Request, Body
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

# Store persona and user_name globally for session
persona = os.environ.get("AI_PERSONA", "You are a friendly, creative, supportive music production assistant.")
user_name = None

# --- Setup endpoint for persona and user_name ---
@app.post("/setup")
async def setup_user(data: dict = Body(...)):
    global persona, user_name
    persona = data.get("persona", persona)
    user_name = data.get("user_name", user_name)
    return {"status": "ok", "persona": persona, "user_name": user_name}

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
 



# Use the single app instance from the top
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
            # Accept a variety of name introductions and also single-word replies
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
            # If user just replies with a single word (likely their name), accept it
            if not found_name and len(user_message.split()) == 1 and user_message.isalpha():
                found_name = user_message.strip().title()
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

        # --- Conversational, open-ended AI ---
        import random
        # Greeting detection
        greetings = ["hi", "hello", "hey", "yo", "hiya", "greetings", "good morning", "good afternoon", "good evening"]
        if any(greet in user_message_lower for greet in greetings):
            greet_responses = [
                f"Hey {user_name}! How's your music going today?",
                f"Hello {user_name}! Ready to make some tunes?",
                f"Hi {user_name}! What are you working on?",
                f"Yo {user_name}! Need any inspiration or just want to chat?"
            ]
            ai_reply = random.choice(greet_responses)
        # If the user asks about a drum roll, give a helpful answer
        elif 'drum roll' in user_message_lower or 'drom roll' in user_message_lower:
            ai_reply = (
                f"To make a drum roll, {user_name}, try this: \n"
                "1. Add a snare or percussion sample to a new MIDI or audio track.\n"
                "2. Draw or record a series of fast, evenly spaced notes (16th or 32nd notes work well).\n"
                "3. Gradually increase the note velocity or volume for a rising effect.\n"
                "4. Optionally, automate pitch or add reverb for drama!\n"
                "Let me know your DAW for step-by-step details."
            )
        # If the user asks about chords, give a helpful answer
        elif "chord progression" in user_message_lower or "chords" in user_message_lower or "suggest chords" in user_message_lower:
            import re
            genre = None
            mood = None
            genre_match = re.search(r"(pop|rock|jazz|edm|hip hop|trap|house|metal|country|blues|folk)", user_message_lower)
            if genre_match:
                genre = genre_match.group(1).title()
            mood_match = re.search(r"(happy|sad|moody|dark|bright|uplifting|chill|energetic|romantic|melancholy)", user_message_lower)
            if mood_match:
                mood = mood_match.group(1).title()
            progression = ai.suggest_chord_progression(genre or "Pop", mood or "Happy")
            ai_reply = f"Here’s a {genre or 'Pop'} {mood or 'Happy'} chord progression you can try, {user_name}: {' - '.join(progression)}. Want more options or a different style? Just ask!"
        @app.websocket("/ws/chat")
        async def websocket_chat(websocket: WebSocket):
            await websocket.accept()
            context = []
            user_skill_level = None
            user_name = None
            asked_name = False
            persona = os.environ.get("AI_PERSONA", "You are a friendly, creative, supportive music production assistant.")
            openai_api_key = os.environ.get("OPENAI_API_KEY")
            if not openai_api_key:
                await websocket.send_text("[Error] No OpenAI API key set on server.")
                return
            openai.api_key = openai_api_key
            while True:
                data = await websocket.receive_text()
                import json
                try:
                    payload = json.loads(data)
                    user_message = payload.get("message", "").strip()
                    incoming_user_name = payload.get("user_name")
                    incoming_persona = payload.get("persona")
                    if incoming_user_name:
                        user_name = incoming_user_name
                    if incoming_persona:
                        persona = incoming_persona
                except Exception:
                    user_message = data.strip()
                chat_messages.append(user_message)
                context.append({"user": user_message})
                user_message_lower = user_message.lower()

                # Name detection (same as before)
                if user_name is None:
                    import re
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
                    if not found_name and len(user_message.split()) == 1 and user_message.isalpha():
                        found_name = user_message.strip().title()
                    if found_name:
                        user_name = found_name
                        asked_name = False
                    elif not asked_name:
                        ai_reply = "Hey! Before we get started, what should I call you?"
                        context.append({"ai": ai_reply})
                        await websocket.send_text(ai_reply)
                        asked_name = True
                        continue

                # Compose chat history for GPT
                chat_history = []
                chat_history.append({"role": "system", "content": persona})
                if user_name:
                    chat_history.append({"role": "system", "content": f"The user's name is {user_name}."})
                for turn in context[-10:]:
                    if "user" in turn:
                        chat_history.append({"role": "user", "content": turn["user"]})
                    if "ai" in turn:
                        chat_history.append({"role": "assistant", "content": turn["ai"]})
                # Call OpenAI API
                try:
                    completion = openai.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=chat_history,
                        temperature=0.8,
                        max_tokens=200
                    )
                    ai_reply = completion.choices[0].message.content.strip()
                except Exception as e:
                    ai_reply = f"[Error] AI backend error: {e}"
                context.append({"ai": ai_reply})
                await websocket.send_text(ai_reply)
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
