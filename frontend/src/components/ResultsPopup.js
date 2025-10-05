import React, { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';

const ResultsPopup = ({ isOpen, onClose, data, location, date }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const formatDate = (dateObj) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[dateObj.month - 1]} ${dateObj.day}, ${dateObj.year}`;
  };

  const formatResultsForJSON = () => {
    return {
      location: {
        name: location?.name || 'Unknown Location',
        coordinates: {
          latitude: location?.lat || 0,
          longitude: location?.lng || 0
        }
      },
      date: formatDate(date),
      analysis_date: new Date().toISOString(),
      data_source: 'NASA MERRA-2 & GPM IMERG',
      results: data.results || data
    };
  };

  const copyToClipboard = async () => {
    try {
      const jsonData = formatResultsForJSON();
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadJSON = () => {
    const jsonData = formatResultsForJSON();
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const locationName = location?.name || 'location';
    const safeLocationName = locationName.replace(/\s+/g, '-').toLowerCase();
    a.download = `climopilot-${safeLocationName}-${date.year}-${date.month}-${date.day}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const results = data.results || data;
    const csvContent = [
      'condition,probability,ci_low,ci_high,threshold,n',
      ...Object.entries(results).map(([key, value]) => {
        // Handle both API format (with prob, ci, threshold, n) and mock format (just numbers)
        if (typeof value === 'number') {
          // Mock data format - just probability
          return `${key},${value.toFixed(1)},0,0,N/A,0`;
        } else {
          // API format - has prob, ci, threshold, n
          const ci = value.ci || [0, 0];
          return `${key},${(value.prob * 100).toFixed(1)},${(ci[0] * 100).toFixed(1)},${(ci[1] * 100).toFixed(1)},${value.threshold || 'N/A'},${value.n || 0}`;
        }
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const locationName = location?.name || 'location';
    const safeLocationName = locationName.replace(/\s+/g, '-').toLowerCase();
    a.download = `climopilot-${safeLocationName}-${date.year}-${date.month}-${date.day}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const jsonData = formatResultsForJSON();

  // User-friendly weather condition labels
  const weatherLabels = {
    hot: 'Extreme Heat',
    cold: 'Freezing Weather', 
    wet: 'Heavy Rain',
    wind: 'Strong Winds'
  };

  const weatherDescriptions = {
    hot: 'Dangerously hot weather above 90°F (32°C)',
    cold: 'Temperatures below freezing (32°F/0°C)',
    wet: 'More than 0.4 inches of rain per day',
    wind: 'Winds over 16 mph (25 km/h)'
  };

  const weatherAdvice = {
    hot: 'Stay indoors, drink water, check on elderly',
    cold: 'Dress warmly, protect pipes, watch for ice',
    wet: 'Avoid driving, check for flooding',
    wind: 'Secure outdoor items, avoid high areas'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#2d3748' }}>
              Weather Analysis Results
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#718096', fontSize: '0.875rem' }}>
              {location.name} • {formatDate(date)}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              color: '#718096',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', maxHeight: '60vh', overflow: 'auto' }}>
          {/* Results Cards */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.125rem' }}>
              Weather Risk Assessment
            </h3>
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              background: '#f0f9ff', 
              borderRadius: '8px',
              border: '1px solid #0ea5e9',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              <strong>📈 What do these percentages mean?</strong><br/>
              These show how often extreme weather has occurred on this date in the past. 
              For example, "25%" means extreme weather happened about 1 in 4 years historically.
            </div>
            
            {/* Low Risk Message */}
            {(() => {
              const results = data.results || data;
              const allRisks = Object.values(results).map(value => {
                const isApiFormat = typeof value === 'object' && value.prob !== undefined;
                return isApiFormat ? value.prob * 100 : value;
              });
              const maxRisk = Math.max(...allRisks);
              
              if (maxRisk < 20) {
                return (
                  <div style={{ 
                    marginBottom: '1.5rem', 
                    padding: '1rem', 
                    background: '#f0fdf4', 
                    borderRadius: '8px',
                    border: '1px solid #22c55e',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    <strong>✅ Great Weather Expected!</strong><br/>
                    All weather risks are low for this date and location. This means historically, 
                    the weather has been mild and stable - perfect for outdoor activities!
                  </div>
                );
              }
              return null;
            })()}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {Object.entries(data.results || data).map(([key, value]) => {
                // Handle both API format and mock format
                const isApiFormat = typeof value === 'object' && value.prob !== undefined;
                const probability = isApiFormat ? value.prob : value;
                const ci = isApiFormat ? (value.ci || [0, 0]) : [0, 0];
                const threshold = isApiFormat ? (value.threshold || 'N/A') : 'N/A';
                const n = isApiFormat ? (value.n || 0) : 0;
                
                return (
                  <div key={key} style={{
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc'
                  }}>
                    <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                      {weatherLabels[key] || key}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3182ce', marginBottom: '0.25rem' }}>
                      {isApiFormat ? (probability * 100).toFixed(1) : probability.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '0.5rem' }}>
                      {weatherDescriptions[key]}
                    </div>
                    {isApiFormat && ci[0] !== 0 && ci[1] !== 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.5rem' }}>
                        CI: {(ci[0] * 100).toFixed(1)}% - {(ci[1] * 100).toFixed(1)}%
                      </div>
                    )}
                    {isApiFormat && (probability * 100) >= 20 && (
                      <div style={{ fontSize: '0.75rem', color: '#2d3748', fontWeight: '500', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f0f9ff', borderRadius: '4px', border: '1px solid #0ea5e9' }}>
                        💡 <strong>Advice:</strong> {weatherAdvice[key]}
                      </div>
                    )}
                    <div style={{ fontSize: '0.7rem', color: '#a0aec0', marginTop: '0.5rem' }}>
                      {threshold} • n={n}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* JSON Display */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.125rem' }}>
                JSON Data
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={copyToClipboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#4a5568'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadJSON}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3182ce',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'white'
                  }}
                >
                  <Download size={16} />
                  JSON
                </button>
                <button
                  onClick={downloadCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#38a169',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'white'
                  }}
                >
                  <Download size={16} />
                  CSV
                </button>
              </div>
            </div>
            <pre style={{
              backgroundColor: '#f7fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '0.875rem',
              overflow: 'auto',
              maxHeight: '300px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              color: '#2d3748'
            }}>
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
            Data source: NASA MERRA-2 & GPM IMERG
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPopup;
