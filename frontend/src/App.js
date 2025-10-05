import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import LocationSelector from './components/LocationSelector';
import DateSelector from './components/DateSelector';
import ResultsPopup from './components/ResultsPopup';
import { fetchLikelihood } from './services/api';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    year: new Date().getFullYear()
  });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResultsPopup, setShowResultsPopup] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setWeatherData(null); // Clear previous results
    setError(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setWeatherData(null); // Clear previous results
    setError(null);
  };

  const handleGetWeatherData = async () => {
    if (!selectedLocation) {
      setError('Please select a location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use real NASA POWER backend data
      const data = await fetchLikelihood(selectedLocation, selectedDate);
      setWeatherData(data);
      setShowResultsPopup(true);
    } catch (err) {
      setError(`Failed to fetch weather data: ${err.message}. Please check if the backend is running.`);
      console.error('Weather data error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="input-section">
            <LocationSelector 
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
            <DateSelector 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
            <div className="action-section">
              <button 
                className="get-weather-btn"
                onClick={handleGetWeatherData}
                disabled={!selectedLocation || loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Weather'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

        </div>
      </main>

      {/* Results Popup */}
      <ResultsPopup
        isOpen={showResultsPopup}
        onClose={() => setShowResultsPopup(false)}
        data={weatherData}
        location={selectedLocation}
        date={selectedDate}
      />
    </div>
  );
}

export default App;
