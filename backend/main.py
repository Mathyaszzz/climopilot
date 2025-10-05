from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import LikelihoodQuery, LikelihoodResponse
from .service import run_likelihood

app = FastAPI(title="ClimoPilot Backend (POWER)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/likelihood", response_model=LikelihoodResponse)
def likelihood(q: LikelihoodQuery):
    try:
        return run_likelihood(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
