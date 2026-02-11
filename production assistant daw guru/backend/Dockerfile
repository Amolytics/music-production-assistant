# Dockerfile for FastAPI backend on Railway
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


# Copy backend code
COPY . .
# Copy ai_services from parent directory
COPY ../ai_services ./ai_services

# Expose FastAPI default port
EXPOSE 8000

# Run FastAPI app with uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
