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
- **NumPy & Pandas**: Data processing
- **Wilson 95% CI**: Statistical confidence intervals

### Frontend
- **React**: Modern JavaScript framework
- **React Leaflet**: Interactive maps
- **Lucide React**: Beautiful icons
- **Responsive CSS**: Mobile-first design

## 🏃‍♂️ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start the backend server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup
```bash
# Install Node.js dependencies
cd frontend
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 📱 Usage

1. **Start both servers** (backend on port 8000, frontend on port 3000)
2. **Open** `http://localhost:3000` in your browser
3. **Select a location** using the map or search
4. **Choose a date** for analysis
5. **Click "Analyze Weather"** to see historical probabilities
6. **View results** in the popup with user-friendly explanations

## 🔬 API Usage

### Health Check
```bash
curl http://localhost:8000/health
```

### Weather Analysis
```bash
curl -X POST http://localhost:8000/likelihood \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 25.7617,
    "lon": -80.1918,
    "date": "2025-07-15",
    "window_days": 7,
    "units": "si",
    "vars": ["hot", "cold", "wet", "wind"]
  }'
```

## 📊 Data Sources

- **NASA POWER**: Global weather and climate data
- **Variables**: Temperature (T2M_MAX, T2M_MIN), Wind (WS10M), Precipitation (PRECTOTCORR)
- **Period**: 1981-2024 (43+ years of historical data)
- **Resolution**: 0.5° × 0.625° (~50km)

## 🧮 Methodology

1. **Data Fetching**: Retrieve historical weather data for the specified location and date
2. **Window Analysis**: Analyze weather patterns within ±7 days of the target date
3. **Threshold Application**: Apply scientific thresholds for extreme conditions
4. **Statistical Analysis**: Calculate probabilities with Wilson 95% confidence intervals
5. **User Presentation**: Display results with clear explanations and actionable advice

## 📁 Project Structure

```
climopilot-1/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── models.py           # Pydantic models
│   ├── service.py          # Business logic
│   ├── utils.py            # Utility functions
│   ├── providers/          # Data providers
│   │   └── power.py        # NASA POWER API
│   ├── tests/              # Unit tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
└── README.md               # This file
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built for NASA Space Apps Challenge** 🚀