# 🌍 ClimoPilot

**NASA Climate Data for Extreme Weather Planning**

ClimoPilot helps users understand extreme weather probabilities using 43+ years of NASA Earth observation data. Built for the NASA Space Apps Challenge.

## 🚀 Features

- **Real NASA Data**: Uses NASA POWER API for temperature, wind, and precipitation data
- **Historical Analysis**: 43+ years of climate data (1981-2024)
- **User-Friendly**: Clear, actionable weather risk assessments
- **Mobile Ready**: Fully responsive design
- **Scientific Accuracy**: Wilson 95% confidence intervals

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **NASA POWER API**: Real climate data source
- **Pydantic**: Data validation
- **NumPy/Pandas**: Data processing

### Frontend
- **React**: Modern JavaScript framework
- **React Leaflet**: Interactive maps
- **Lucide React**: Beautiful icons
- **Responsive CSS**: Mobile-first design

## 📊 Weather Conditions

- **🔥 Extreme Heat**: Temperature above 90°F (32°C)
- **❄️ Freezing Weather**: Temperature below 32°F (0°C)
- **🌧️ Heavy Rain**: More than 0.4 inches per day
- **💨 Strong Winds**: Winds over 16 mph (25 km/h)

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🌐 Live Demo

- **Frontend**: https://climopilot.earth
- **Backend API**: https://api.climopilot.earth
- **Health Check**: https://api.climopilot.earth/health

## 📡 API Endpoints

### POST /likelihood
Get weather probability data for a location and date.

**Request:**
```json
{
  "lat": 25.7617,
  "lon": -80.1918,
  "date": "2025-07-15",
  "window_days": 7,
  "units": "si",
  "vars": ["hot", "cold", "wet", "wind"]
}
```

**Response:**
```json
{
  "query": { ... },
  "results": {
    "hot": {
      "prob": 0.85,
      "ci": [0.78, 0.91],
      "threshold": "Tmax > 32 °C",
      "n": 1200
    }
  },
  "metadata": { ... }
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

## 📈 Data Source

- **NASA POWER**: Prediction of Worldwide Energy Resources
- **Variables**: T2M_MAX, T2M_MIN, WS10M, PRECTOTCORR
- **Period**: 1981-2024 (43+ years)
- **Methodology**: Day-of-year ±k window analysis with Wilson 95% CI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛰️ NASA Space Apps

Built for the NASA Space Apps Challenge - helping communities prepare for extreme weather using Earth observation data.

## 🔗 Links

- **NASA POWER API**: https://power.larc.nasa.gov/
- **NASA Space Apps**: https://www.spaceappschallenge.org/
- **Project Repository**: https://github.com/yourusername/climopilot
