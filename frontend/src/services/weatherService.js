// Mock NASA weather data service
// In a real implementation, this would connect to NASA APIs

const getWeatherProbabilities = async (location, date) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock data based on location and date
  // In reality, this would query NASA MERRA-2 and GPM IMERG datasets
  
  const { lat, lng } = location;
  const { month } = date;
  
  // Simulate seasonal and geographical variations
  const seasonalFactor = getSeasonalFactor(month);
  const geographicalFactor = getGeographicalFactor(lat, lng);
  
  // Base probabilities with some randomness
  const baseProbabilities = {
    veryHot: Math.max(5, Math.min(95, 20 + seasonalFactor.heat + geographicalFactor.heat + (Math.random() - 0.5) * 20)),
    veryCold: Math.max(5, Math.min(95, 15 + seasonalFactor.cold + geographicalFactor.cold + (Math.random() - 0.5) * 15)),
    veryWet: Math.max(5, Math.min(95, 25 + seasonalFactor.precipitation + geographicalFactor.precipitation + (Math.random() - 0.5) * 25)),
    veryWindy: Math.max(5, Math.min(95, 30 + seasonalFactor.wind + geographicalFactor.wind + (Math.random() - 0.5) * 20)),
    heavyRain: Math.max(5, Math.min(95, 20 + seasonalFactor.precipitation + geographicalFactor.precipitation + (Math.random() - 0.5) * 20)),
    extremeHeat: Math.max(5, Math.min(95, 10 + seasonalFactor.heat + geographicalFactor.heat + (Math.random() - 0.5) * 15))
  };

  // Round to nearest integer
  Object.keys(baseProbabilities).forEach(key => {
    baseProbabilities[key] = Math.round(baseProbabilities[key]);
  });

  return baseProbabilities;
};

const getSeasonalFactor = (month) => {
  // Simulate seasonal patterns
  const factors = {
    heat: 0,
    cold: 0,
    precipitation: 0,
    wind: 0
  };

  // Summer months (June-August)
  if (month >= 6 && month <= 8) {
    factors.heat = 30;
    factors.cold = -20;
    factors.precipitation = 10;
    factors.wind = 5;
  }
  // Winter months (December-February)
  else if (month === 12 || month <= 2) {
    factors.heat = -20;
    factors.cold = 30;
    factors.precipitation = 5;
    factors.wind = 15;
  }
  // Spring months (March-May)
  else if (month >= 3 && month <= 5) {
    factors.heat = 10;
    factors.cold = -10;
    factors.precipitation = 15;
    factors.wind = 10;
  }
  // Fall months (September-November)
  else {
    factors.heat = 5;
    factors.cold = 5;
    factors.precipitation = 10;
    factors.wind = 8;
  }

  return factors;
};

const getGeographicalFactor = (lat, lng) => {
  const factors = {
    heat: 0,
    cold: 0,
    precipitation: 0,
    wind: 0
  };

  // Latitude effects
  if (lat > 60) {
    // High latitude (Arctic/Subarctic)
    factors.heat = -30;
    factors.cold = 40;
    factors.precipitation = 20;
    factors.wind = 25;
  } else if (lat > 40) {
    // Mid-latitude (Temperate)
    factors.heat = 0;
    factors.cold = 10;
    factors.precipitation = 10;
    factors.wind = 15;
  } else if (lat > 20) {
    // Subtropical
    factors.heat = 20;
    factors.cold = -20;
    factors.precipitation = 15;
    factors.wind = 5;
  } else {
    // Tropical
    factors.heat = 30;
    factors.cold = -40;
    factors.precipitation = 25;
    factors.wind = 10;
  }

  // Longitude effects (simplified)
  if (lng > -100 && lng < -80) {
    // Eastern US - more precipitation
    factors.precipitation += 10;
  } else if (lng > -120 && lng < -100) {
    // Western US - more wind
    factors.wind += 10;
  }

  return factors;
};

// Mock function to get historical climate data
export const getHistoricalClimateData = async (location, date) => {
  // This would connect to NASA APIs in a real implementation
  return {
    dataSource: 'NASA MERRA-2 & GPM IMERG',
    analysisPeriod: '1980-2023',
    dataPoints: Math.floor(Math.random() * 1000) + 500,
    lastUpdated: new Date().toISOString()
  };
};

// Mock function to get climate trends
export const getClimateTrends = async (location) => {
  return {
    temperatureTrend: '+0.8°C per decade',
    precipitationTrend: '+2.1% per decade',
    extremeEventsTrend: '+15% per decade',
    confidenceLevel: 'High (95%)'
  };
};

export { getWeatherProbabilities };
