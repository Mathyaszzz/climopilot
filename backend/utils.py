import math
import numpy as np
import pandas as pd

def wilson_ci(p: float, n: int, z: float = 1.96):
    if n <= 0 or not np.isfinite(p): return float("nan"), (float("nan"), float("nan"))
    denom = 1 + z**2 / n
    center = (p + z**2/(2*n)) / denom
    half = z * math.sqrt((p*(1-p)/n) + (z**2/(4*n**2))) / denom
    lo = max(0.0, center - half)
    hi = min(1.0, center + half)
    return center, (lo, hi)

def circular_doy_mask(times: pd.DatetimeIndex, target: pd.Timestamp, k: int):
    doy = target.dayofyear
    d = times.dayofyear.values
    diff = np.minimum(np.abs(d - doy), 366 - np.abs(d - doy))
    return diff <= k
