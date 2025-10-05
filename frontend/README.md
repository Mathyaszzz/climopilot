# ClimoPilot 🌤️

A React web application that helps users understand extreme weather probabilities using NASA Earth observation data. Unlike short-term weather forecasts, ClimoPilot relies on historical climate records from NASA datasets (MERRA-2 and GPM IMERG) to compute the likelihood of extreme weather conditions.

## 🎯 Features

- **Interactive Map**: Select any location worldwide using an interactive map or coordinates
- **Smart Location Search**: Autocomplete dropdown with comprehensive database of cities and countries
- **Date Selection**: Choose any date (month, day, year) for analysis
- **Weather Probabilities**: View probabilities for:
  - Very Hot conditions (>90°F/32°C)
  - Very Cold conditions (<32°F/0°C)
  - Very Wet conditions (heavy precipitation)
  - Very Windy conditions (>25 mph/40 km/h)
  - Heavy Rain (>1 inch/25mm per day)
  - Extreme Heat (heat index >105°F/40°C)
- **Results Popup**: Beautiful modal displaying results in JSON format with confidence intervals
- **Data Export**: Download results as CSV or JSON files
- **Backend API Integration**: Connects to weather likelihood API with fallback to mock data
- **NASA Data Integration**: Based on decades of NASA climate data

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a package manager like Chocolatey: `choco install nodejs`

2. **Navigate to the project directory**:
   ```bash
   cd climopilot
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
climopilot/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── LocationSelector.js
│   │   ├── DateSelector.js
│   │   ├── WeatherResults.js
│   │   └── ResultsPopup.js
│   ├── services/
│   │   ├── weatherService.js
│   │   └── api.js
│   ├── data/
│   │   └── locations.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎨 Key Components

### LocationSelector
- Interactive map using React Leaflet
- Smart autocomplete search with 100+ cities and countries
- Coordinate input for precise location selection
- Keyboard navigation support
- Real-time location updates

### DateSelector
- Month, day, and year selection
- Dynamic day calculation based on month/year
- Date validation and formatting

### WeatherResults
- Probability cards with color-coded risk levels
- Data source information
- Export functionality (CSV/JSON)
- Responsive design for all screen sizes

### ResultsPopup
- Modal popup displaying results in JSON format
- Confidence intervals and sample sizes
- Copy to clipboard functionality
- CSV and JSON download options
- Professional data presentation

## 🔬 Data Sources

- **NASA MERRA-2**: Modern-Era Retrospective Analysis for Research and Applications
- **NASA GPM IMERG**: Global Precipitation Measurement Integrated Multi-satellitE Retrievals
- **Analysis Period**: 1980-2023 (43+ years of climate data)

## 🎯 Target Users

- **Hikers**: Plan outdoor activities months in advance
- **Event Organizers**: Assess weather risks for future events
- **Travelers**: Understand climate patterns for destination planning
- **Researchers**: Access historical climate probability data

## 🚀 Future Enhancements

- Real NASA API integration
- Historical climate trend analysis
- Seasonal pattern visualization
- Custom date range analysis
- Mobile app version
- Advanced filtering options

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🤝 Contributing

This is a demo application showcasing NASA climate data integration. For production use, integrate with real NASA APIs and add proper error handling.

## 📄 License

This project is for educational and demonstration purposes.
