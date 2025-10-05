# ClimoPilot Backend (NASA POWER)

## Run locally
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload

# Health
GET http://localhost:8000/health

# Example request
curl -X POST http://localhost:8000/likelihood \
 -H "Content-Type: application/json" \
 -d '{"lat":25.7617,"lon":-80.1918,"date":"2025-07-15","window_days":7,"units":"si","vars":["hot","cold","wet","wind"]}'

## Env (optional)
POWER_START=19810101
POWER_END=20241231
DEFAULT_WINDOW_DAYS=7
