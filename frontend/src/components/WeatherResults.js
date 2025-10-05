import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Download,
  FileText,
  BarChart3
} from 'lucide-react';

const WeatherResults = ({ data, location, date }) => {
  const formatDate = (dateObj) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[dateObj.month - 1]} ${dateObj.day}, ${dateObj.year}`;
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return '#e53e3e'; // Red for very high
    if (probability >= 60) return '#dd6b20'; // Orange for high
    if (probability >= 40) return '#d69e2e'; // Yellow for moderate
    if (probability >= 20) return '#38a169'; // Green for low
    return '#4299e1'; // Blue for very low
  };

  const getProbabilityLabel = (probability) => {
    if (probability >= 80) return 'Very High';
    if (probability >= 60) return 'High';
    if (probability >= 40) return 'Moderate';
    if (probability >= 20) return 'Low';
    return 'Very Low';
  };

  const downloadData = (format) => {
    const dataToDownload = {
      location: {
        name: location.name,
        coordinates: {
          latitude: location.lat,
          longitude: location.lng
        }
      },
      date: formatDate(date),
      analysis_date: new Date().toISOString(),
      data_source: 'NASA MERRA-2 & GPM IMERG',
      weather_probabilities: data
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `climopilot-${location.name.replace(/\s+/g, '-').toLowerCase()}-${date.year}-${date.month}-${date.day}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvContent = [
        'Weather Condition,Probability (%),Risk Level',
        ...weatherConditions.map(condition => {
          const isApiFormat = data.results && typeof data.results[condition.key] === 'object' && data.results[condition.key].prob !== undefined;
          const rawValue = isApiFormat ? data.results[condition.key] : data[condition.key];
          const probability = isApiFormat ? rawValue.prob * 100 : rawValue;
          return `${condition.title},${probability.toFixed(1)},${getProbabilityLabel(probability)}`;
        })
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `climopilot-${location.name.replace(/\s+/g, '-').toLowerCase()}-${date.year}-${date.month}-${date.day}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const weatherConditions = [
    {
      key: 'hot',
      title: 'Extreme Heat',
      description: 'Dangerously hot weather above 90°F (32°C)',
      icon: Thermometer,
      color: '#e53e3e',
      advice: 'Stay indoors, drink water, check on elderly'
    },
    {
      key: 'cold',
      title: 'Freezing Weather',
      description: 'Temperatures below freezing (32°F/0°C)',
      icon: Thermometer,
      color: '#3182ce',
      advice: 'Dress warmly, protect pipes, watch for ice'
    },
    {
      key: 'wet',
      title: 'Heavy Rain',
      description: 'More than 0.4 inches of rain per day',
      icon: Droplets,
      color: '#3182ce',
      advice: 'Avoid driving, check for flooding'
    },
    {
      key: 'wind',
      title: 'Strong Winds',
      description: 'Winds over 16 mph (25 km/h)',
      icon: Wind,
      color: '#805ad5',
      advice: 'Secure outdoor items, avoid high areas'
    }
  ];

  return (
    <div className="results-section">
      <div className="results-header">
        <h2 className="results-title">Weather Risk Assessment</h2>
        <p className="results-subtitle">
          Historical weather patterns for {location.name} on {formatDate(date)}
        </p>
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #0ea5e9',
          fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
          lineHeight: '1.4'
        }}>
          <strong>📈 What do these percentages mean?</strong><br/>
          These show how often extreme weather has occurred on this date in the past. 
          For example, "25%" means extreme weather happened about 1 in 4 years historically.
        </div>
      </div>

      <div className="weather-cards">
        {weatherConditions.map((condition) => {
          const IconComponent = condition.icon;
          // Handle both API format (with prob, ci, threshold, n) and mock format (just numbers)
          const isApiFormat = data.results && typeof data.results[condition.key] === 'object' && data.results[condition.key].prob !== undefined;
          const rawValue = isApiFormat ? data.results[condition.key] : data[condition.key];
          const probability = isApiFormat ? rawValue.prob * 100 : rawValue;
          const color = getProbabilityColor(probability);
          const riskLevel = getProbabilityLabel(probability);

          return (
            <div key={condition.key} className="weather-card">
              <div className="weather-card-header">
                <div 
                  className="weather-icon"
                  style={{ backgroundColor: color }}
                >
                  <IconComponent size={20} />
                </div>
                <div className="weather-title">{condition.title}</div>
              </div>
              <div 
                className="weather-probability"
                style={{ color: color }}
              >
                {probability}%
              </div>
              <div className="weather-description">
                {condition.description}
                <br />
                <strong>Risk Level:</strong> {riskLevel}
                {probability >= 20 && (
                  <>
                    <br />
                    <strong>💡 Advice:</strong> {condition.advice}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="download-section">
        <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>
          <BarChart3 size={20} style={{ marginRight: '8px', display: 'inline' }} />
          Download Results
        </h3>
        <p style={{ marginBottom: '1.5rem', color: '#4a5568' }}>
          Save your weather probability analysis for future reference
        </p>
        <button
          onClick={() => downloadData('csv')}
          className="download-btn"
        >
          <Download size={16} style={{ marginRight: '8px' }} />
          Download CSV
        </button>
        <button
          onClick={() => downloadData('json')}
          className="download-btn"
        >
          <FileText size={16} style={{ marginRight: '8px' }} />
          Download JSON
        </button>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: '#f7fafc', 
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>
          📊 Data Source & Methodology
        </h4>
        <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '0.5rem' }}>
          <strong>Data Source:</strong> NASA's global weather database with temperature, wind, and rainfall measurements
        </p>
        <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '0.5rem' }}>
          <strong>Analysis Period:</strong> Based on 43+ years of historical weather data (1981-2024)
        </p>
        <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
          <strong>How it works:</strong> We look at weather patterns around the same date across many years to predict what's likely to happen
        </p>
      </div>
    </div>
  );
};

export default WeatherResults;
