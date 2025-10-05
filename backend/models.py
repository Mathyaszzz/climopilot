from typing import Dict, List, Tuple, Any
from pydantic import BaseModel, Field

class LikelihoodQuery(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)
    date: str  # "YYYY-MM-DD"
    window_days: int = 7
    units: str = "si"  # labels only
    vars: List[str] = ["hot","cold","wet","wind"]

class ConditionResult(BaseModel):
    prob: float                  # 0..1
    ci: Tuple[float, float]      # 0..1
    threshold: str
    n: int

class LikelihoodResponse(BaseModel):
    query: LikelihoodQuery
    results: Dict[str, ConditionResult]
    metadata: Dict[str, Any]
