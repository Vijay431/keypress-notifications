# Base image: Node 20 with TypeScript tooling
FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

# Install system dependencies needed for headless VS Code E2E tests
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    libnss3 \
    libasound2 \
    libgbm1 \
    libxshmfence1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*
