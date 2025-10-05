// API service for backend connection
const API_BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

// Fetch weather likelihood data from backend
export const fetchLikelihood = async (location, date, windowDays = 7, units = 'si', vars = ['hot', 'cold', 'wet', 'wind']) => {
  try {
    const requestBody = {
      lat: location.lat,
      lon: location.lng,
      date: `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`,
      window_days: windowDays,
      units: units,
      vars: vars
    };

    const response = await fetch(`${API_BASE_URL}/likelihood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch weather data. Please try again.');
  }
};

// Health check for backend
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Get available variables from backend
export const getAvailableVariables = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/variables`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch available variables:', error);
    return ['hot', 'cold', 'wet', 'wind']; // fallback
  }
};
