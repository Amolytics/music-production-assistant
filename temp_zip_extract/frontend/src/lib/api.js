// Central API base for Railway / local dev

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_BACKEND_URL || // backward compat
  "http://localhost:8000";

export const WS_BASE = API_BASE
  .replace("https://", "wss://")
  .replace("http://", "ws://");

export function fetchWithApiKey(url, options = {}) {
  const apiKey = localStorage.getItem('dawguru_api_key') || '';
  const headers = {
    ...(options.headers || {}),
    'X-API-Key': apiKey,
  };
  return fetch(url, { ...options, headers });
}
