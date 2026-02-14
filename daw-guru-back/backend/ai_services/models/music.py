from __future__ import annotations

import os
import json
from typing import List, Dict, Optional

import httpx


class AIMusicModel:
    """
    Works out of the box with Ollama (local).
    Optional OpenAI mode if api key is provided (via /setup or env).
    """

    def __init__(
        self,
        provider: str = "ollama",
        ollama_host: str = "http://127.0.0.1:11434",
        ollama_model: str = "llama3.1",
        openai_model: str = "gpt-4.1-mini",
        openai_api_key: Optional[str] = None,
    ):
        self.provider = (provider or "ollama").lower().strip()
        self.ollama_host = (ollama_host or "http://127.0.0.1:11434").rstrip("/")
        self.ollama_model = ollama_model or "llama3.1"
        self.openai_model = openai_model or "gpt-4.1-mini"
        self.openai_api_key = openai_api_key or os.environ.get("OPENAI_API_KEY")

    def set_openai_key(self, key: str):
        self.openai_api_key = (key or "").strip()

    async def chat_async(self, messages: List[Dict[str, str]]) -> str:
        if self.provider == "openai":
            return await self._chat_openai(messages)
        return await self._chat_ollama(messages)

    async def _chat_ollama(self, messages: List[Dict[str, str]]) -> str:
        url = f"{self.ollama_host}/api/chat"
        payload = {
            "model": self.ollama_model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": 0.7},
        }
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, json=payload)
            r.raise_for_status()
            data = r.json()

        msg = (data.get("message") or {}).get("content") or ""
        return msg.strip() or "I didn’t get a usable response from the model."

    async def _chat_openai(self, messages: List[Dict[str, str]]) -> str:
        if not self.openai_api_key:
            raise RuntimeError("OpenAI provider selected but no API key is set.")

        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.openai_api_key}"}
        payload = {
            "model": self.openai_model,
            "messages": messages,
            "temperature": 0.7,
        }

        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, headers=headers, json=payload)
            r.raise_for_status()
            data = r.json()

        choices = data.get("choices") or []
        if not choices:
            return "No response returned."
        content = (((choices[0] or {}).get("message") or {}).get("content")) or ""
        return content.strip() or "No content returned."

    async def generate_lyrics_async(
        self,
        style: str,
        topic: str,
        emotion: Optional[str] = None,
        language: str = "en",
    ) -> str:
        emo = f" Emotion: {emotion}." if emotion else ""
        prompt = (
            f"Write song lyrics in {language}. Style: {style}. Topic: {topic}.{emo}\n"
            "Return:\n"
            "- Verse 1 (8 lines)\n"
            "- Chorus (4 lines)\n"
            "- Verse 2 (8 lines)\n"
            "- Chorus (4 lines)\n"
            "Keep it natural and singable."
        )
        msgs = [
            {"role": "system", "content": "You are a professional songwriter and topliner."},
            {"role": "user", "content": prompt},
        ]
        return await self.chat_async(msgs)

    async def suggest_chord_progression_async(self, genre: str = "Pop", mood: str = "Happy"):
        prompt = (
            f"Suggest 3 chord progressions for genre={genre}, mood={mood}.\n"
            "Return JSON only in this format:\n"
            '{"progressions":[{"name":"...","chords":["..."]},{"name":"...","chords":["..."]},{"name":"...","chords":["..."]}]}'
        )
        msgs = [
            {"role": "system", "content": "You are a music theory assistant. Output strictly valid JSON."},
            {"role": "user", "content": prompt},
        ]
        text = await self.chat_async(msgs)
        try:
            data = json.loads(text)
            progs = data.get("progressions") or []
            if progs:
                return progs
        except Exception:
            pass
        return [{"name": "Safe Pop", "chords": ["C", "G", "Am", "F"]}]

    async def search_free_sample_async(self, description: str, genre: Optional[str] = None) -> str:
        g = f" Genre: {genre}." if genre else ""
        prompt = (
            f"I need a free sample: {description}.{g}\n"
            "Give me:\n"
            "1) 3 best search phrases\n"
            "2) 5 reputable free/royalty-free sample sites\n"
            "3) quick check-list to avoid licensing problems\n"
            "Keep it tight."
        )
        msgs = [
            {"role": "system", "content": "You help producers find safe-to-use samples."},
            {"role": "user", "content": prompt},
        ]
        return await self.chat_async(msgs)
