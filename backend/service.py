from typing import Dict
import numpy as np
from .models import LikelihoodQuery, LikelihoodResponse, ConditionResult
from .settings import SI_THRESHOLDS, DEFAULT_WINDOW_DAYS
from .utils import wilson_ci
from .providers.power import fetch_series

def _prob(arr: np.ndarray, thr: float, cmp: str):
    vals = arr[np.isfinite(arr)]
    n = len(vals)
    if n == 0: return float("nan"), (float("nan"), float("nan")), 0
    hits = (vals > thr).sum() if cmp == ">" else (vals < thr).sum()
    p = hits / n if n else float("nan")
    center, ci = wilson_ci(p, n)
    return center, ci, n

def run_likelihood(q: LikelihoodQuery) -> LikelihoodResponse:
    # Fetch once from POWER and split per variable
    tmax, tmin, wind, precip = fetch_series(q.lat, q.lon, q.date, q.window_days)

    results: Dict[str, ConditionResult] = {}

    if "hot" in q.vars:
        thr = SI_THRESHOLDS["hot"]
        p, ci, n = _prob(tmax, thr, ">")
        results["hot"] = ConditionResult(prob=p, ci=ci, threshold=f"Tmax > {thr} °C", n=n)

    if "cold" in q.vars:
        thr = SI_THRESHOLDS["cold"]
        p, ci, n = _prob(tmin, thr, "<")
        results["cold"] = ConditionResult(prob=p, ci=ci, threshold=f"Tmin < {thr} °C", n=n)

    if "wind" in q.vars:
        thr = SI_THRESHOLDS["wind"]
        p, ci, n = _prob(wind, thr, ">")
        results["wind"] = ConditionResult(prob=p, ci=ci, threshold=f"WS10M > {thr} m/s", n=n)

    if "wet" in q.vars:
        thr = SI_THRESHOLDS["wet"]
        p, ci, n = _prob(precip, thr, ">")
        results["wet"] = ConditionResult(prob=p, ci=ci, threshold=f"Precip > {thr} mm/day", n=n)

    meta = {
        "datasets": ["NASA POWER: T2M_MAX, T2M_MIN, WS10M, PRECTOTCORR"],
        "window_days": q.window_days,
        "period": f"{q.date} ±{q.window_days}d across years {__import__('os').getenv('POWER_START','19810101')}–{__import__('os').getenv('POWER_END','20241231')}",
        "method": "Day-of-year ±k window across archive; Wilson 95% CI",
    }
    return LikelihoodResponse(query=q, results=results, metadata=meta)
