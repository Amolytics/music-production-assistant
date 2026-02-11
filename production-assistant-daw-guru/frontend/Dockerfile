## IMPORTANT: Build context for this Dockerfile must be the frontend directory (where package.json is located)
# Example build command:
# docker build -f production-assistant-daw-guru/frontend/Dockerfile production-assistant-daw-guru/frontend
#
# Dockerfile for Vite/React frontend with Express server for nonce-based CSP
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080
CMD ["node", "server.js"]
