
from fastapi import FastAPI, WebSocket, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from ai_services.models.music import AIMusicModel
from backend.daw_adapter import DAWAdapter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store user DAW selection (in production, use DB/session)
user_daw = None
user_daw_version = None
ai = AIMusicModel()
daw_adapter = None
chat_messages = []  # In-memory store for demo; use DB in production

# --- Real-time collaboration chat and file sharing ---
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        chat_messages.append(data)
        await websocket.send_text(f"Message received: {data}")

@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    # Save file to disk or cloud storage
    content = await file.read()
    filename = file.filename
    with open(f"uploads/{filename}", "wb") as f:
        f.write(content)
    return {"filename": filename, "status": "uploaded"}

@app.post("/setup")
async def setup(request: Request):
    global user_daw, user_daw_version, daw_adapter, api_key
    data = await request.json()
    name = data.get("name")
    daw = data.get("daw")
    daw_version = data.get("daw_version")
    api_key = data.get("api_key")
    user_daw = daw
    user_daw_version = daw_version
    if daw and daw != "Other":
        daw_adapter = DAWAdapter(daw, daw_version)
        daw_adapter.connect()
    else:
        daw_adapter = None
    status = "setup complete"
    if api_key:
        status += " (API key saved)"
    return {"status": status, "daw": daw, "daw_version": daw_version, "api_key": api_key}

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
