import os

POWER_BASE = "https://power.larc.nasa.gov/api/temporal/daily/point"
POWER_PARAMS = ["T2M_MAX","T2M_MIN","WS10M","PRECTOTCORR"]
POWER_COMMUNITY = "AG"

POWER_START = os.getenv("POWER_START", "19810101")
POWER_END   = os.getenv("POWER_END",   "20241231")

DEFAULT_WINDOW_DAYS = int(os.getenv("DEFAULT_WINDOW_DAYS", "7"))

# Thresholds (SI units)
SI_THRESHOLDS = {
    "hot":  32.0,  # Tmax > 32 °C
    "cold": 0.0,   # Tmin < 0 °C
    "wind": 7.0,   # WS10M > 7 m/s
    "wet":  10.0,  # PRECTOTCORR > 10 mm/day
}