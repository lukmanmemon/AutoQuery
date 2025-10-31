from fastapi import FastAPI
from app.api.cars import router as car_router
from app.api.search import router as search_router
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Car Search API",
    description="Semantic search API for cars"
)

# Get environment variables for CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Configure CORS with environment variable for production
origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(car_router, prefix="/api/cars", tags=["Cars"])
app.include_router(search_router, prefix="/api/search")

@app.get("/")
def root():
    return {"message": "Welcome to the Car Search API!"}
