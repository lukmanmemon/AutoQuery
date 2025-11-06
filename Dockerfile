# Use lightweight Python image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app/backend

# Copy only requirements first for caching
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY backend/ .

# Expose port (Railway will override this with $PORT)
EXPOSE 8080

# Run FastAPI app with Uvicorn
# Use $PORT env var provided by Railway
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080} --forwarded-allow-ips='*'"]
