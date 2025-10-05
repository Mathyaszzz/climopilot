import requests
import pandas as pd
import numpy as np
from dateutil.parser import isoparse
from typing import Tuple
from ..settings import POWER_BASE, POWER_PARAMS, POWER_COMMUNITY, POWER_START, POWER_END
from ..utils import circular_doy_mask

def _power_url(lat: float, lon: float) -> str:
    params = ",".join(POWER_PARAMS)
    return (f"{POWER_BASE}"
            f"?parameters={params}"
            f"&start={POWER_START}"
            f"&end={POWER_END}"
            f"&latitude={lat}"
            f"&longitude={lon}"
            f"&community={POWER_COMMUNITY}"
            f"&format=JSON")

def _fetch_power_json(lat: float, lon: float) -> dict:
    url = _power_url(lat, lon)
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    return r.json()

def _to_dataframe(js: dict) -> pd.DataFrame:
    # POWER daily data: js["properties"]["parameter"][VAR][YYYYMMDD] = value
    params = js.get("properties", {}).get("parameter", {})
    if not params:
        raise ValueError("POWER response missing 'properties.parameter'.")
    # build a dict of date->row
    date_set = set()
    for v in params.values():
        date_set.update(v.keys())
    # sort dates
    dates = sorted(date_set)
    records = []
    for d in dates:
        row = {"date": pd.to_datetime(d, format="%Y%m%d")}
        for p in POWER_PARAMS:
            val = params.get(p, {}).get(d, None)
            row[p] = None if val is None else float(val)
        records.append(row)
    df = pd.DataFrame.from_records(records).set_index("date").sort_index()
    return df

def fetch_series(lat: float, lon: float, date: str, window_days: int) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Returns arrays filtered by DOY window:
    tmax (°C), tmin (°C), wind (m/s), precip (mm/day)
    """
    js = _fetch_power_json(lat, lon)
    df = _to_dataframe(js)  # index=date, columns T2M_MAX,T2M_MIN,WS10M,PRECTOTCORR

    target = pd.Timestamp(isoparse(date))
    mask = circular_doy_mask(df.index, target, window_days)

    tmax = df["T2M_MAX"].to_numpy()[mask]
    tmin = df["T2M_MIN"].to_numpy()[mask]
    wind = df["WS10M"].to_numpy()[mask]
    precip = df["PRECTOTCORR"].to_numpy()[mask]
    return tmax, tmin, wind, precip
