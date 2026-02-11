# Dockerfile for FastAPI backend on Railway
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt



# Copy backend code and ai_services
COPY . .

# Debug: List contents of /app to verify app.py is present
RUN ls -l /app

# Expose FastAPI default port
EXPOSE 8000

# Run FastAPI app with uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
