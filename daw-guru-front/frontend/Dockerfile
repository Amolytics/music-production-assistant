# Dockerfile for Vite/React frontend with Express server for nonce-based CSP
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080
CMD ["node", "server.js"]
