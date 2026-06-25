from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import contextlib

from backend.api import placement, learning_path
from backend.services.model_loader import load_models

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML models and metrics at startup
    load_models()
    yield
    # Cleanup (if needed) on shutdown

app = FastAPI(title="CodePulse AI Module", lifespan=lifespan)

# Allow CORS for frontend
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(placement.router)
app.include_router(learning_path.router)

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
