import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin, Search } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { searchLocations, reverseGeocode } from '../services/geocoding';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationSelector = ({ onLocationSelect, selectedLocation }) => {
  const [position, setPosition] = useState([39.8283, -98.5795]); // Center of US
  const [searchQuery, setSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionRefs = useRef([]);

  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.lat, selectedLocation.lng]);
      setCoordinates({
        lat: selectedLocation.lat.toFixed(4),
        lng: selectedLocation.lng.toFixed(4)
      });
    }
  }, [selectedLocation]);

  // Handle search input changes with geocoding
  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchLocations(searchQuery, 8).then(results => {
        if (results && Array.isArray(results)) {
          setSuggestions(results);
          setShowSuggestions(true);
          setHighlightedIndex(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }).catch(error => {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || !suggestions || !Array.isArray(suggestions)) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          selectLocation(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const selectLocation = (location) => {
    const newLocation = {
      lat: location.lat,
      lng: location.lng,
      name: location.name
    };
    setPosition([location.lat, location.lng]);
    setCoordinates({
      lat: location.lat.toFixed(4),
      lng: location.lng.toFixed(4)
    });
    setSearchQuery(location.name);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    onLocationSelect(newLocation);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (suggestions && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        
        // Use reverse geocoding to get location name
        try {
          const locationInfo = await reverseGeocode(lat, lng);
          
          const newLocation = {
            lat: lat,
            lng: lng,
            name: locationInfo ? locationInfo.name : `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
          };
          
          setPosition([lat, lng]);
          setCoordinates({
            lat: lat.toFixed(4),
            lng: lng.toFixed(4)
          });
          
          // Update search box with location name or coordinates
          if (locationInfo) {
            setSearchQuery(locationInfo.name);
          } else {
            setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
          
          onLocationSelect(newLocation);
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          // Fallback to coordinates
          const newLocation = {
            lat: lat,
            lng: lng,
            name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
          };
          
          setPosition([lat, lng]);
          setCoordinates({
            lat: lat.toFixed(4),
            lng: lng.toFixed(4)
          });
          setSearchQuery(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          onLocationSelect(newLocation);
        }
      }
    });
    return null;
  };

  const handleCoordinateSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const newLocation = {
        lat: lat,
        lng: lng,
        name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      };
      setPosition([lat, lng]);
      onLocationSelect(newLocation);
    } else {
      alert('Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await searchLocations(searchQuery, 1);
      
      if (results.length > 0) {
        selectLocation(results[0]);
        // Update the map view to focus on the selected location
        setPosition([results[0].lat, results[0].lng]);
      } else {
        // Try to parse as coordinates if search fails
        const coordMatch = searchQuery.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
        if (coordMatch) {
          const lat = parseFloat(coordMatch[1]);
          const lng = parseFloat(coordMatch[2]);
          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            const newLocation = {
              lat: lat,
              lng: lng,
              name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
            };
            setPosition([lat, lng]);
            setCoordinates({
              lat: lat.toFixed(4),
              lng: lng.toFixed(4)
            });
            onLocationSelect(newLocation);
            return;
          }
        }
        alert('Location not found. Please try a different search term, coordinates (lat,lng), or use the map.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again or use coordinates.');
    }
  };

  return (
    <div className="input-group">
      <label className="input-label">
        <MapPin size={16} style={{ marginRight: '8px', display: 'inline' }} />
        Select Location
      </label>
      
      {/* Search input with autocomplete */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search cities, countries, or coordinates (e.g., New York, 40.7128,-74.0060)"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="date-input"
              style={{ width: '100%' }}
            />
            {showSuggestions && suggestions && Array.isArray(suggestions) && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.name}-${index}`}
                    ref={el => suggestionRefs.current[index] = el}
                    onClick={() => selectLocation(suggestion)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                      backgroundColor: index === highlightedIndex ? '#f7fafc' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <MapPin size={16} style={{ color: '#718096' }} />
                    <div>
                      <div style={{ fontWeight: '500', color: '#2d3748' }}>
                        {suggestion.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                        {suggestion.type || 'Location'} • {suggestion.lat.toFixed(2)}, {suggestion.lng.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="get-weather-btn"
            style={{ 
              padding: '0.75rem 1rem', 
              minWidth: 'auto',
              fontSize: '0.9rem'
            }}
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Coordinate input */}
      <form onSubmit={handleCoordinateSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Latitude"
            value={coordinates.lat}
            onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
            className="date-input"
            step="any"
            style={{ flex: 1 }}
          />
          <input
            type="number"
            placeholder="Longitude"
            value={coordinates.lng}
            onChange={(e) => setCoordinates({ ...coordinates, lng: e.target.value })}
            className="date-input"
            step="any"
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="get-weather-btn"
            style={{ 
              padding: '0.75rem 1rem', 
              minWidth: 'auto',
              fontSize: '0.9rem'
            }}
          >
            Go
          </button>
        </div>
      </form>

      {/* Map */}
      <div className="map-container">
        <MapContainer
          center={position}
          zoom={6}
          minZoom={2}
          maxZoom={18}
          maxBounds={[[-85, -180], [85, 180]]}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          <Marker position={position}>
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '150px' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {selectedLocation ? selectedLocation.name : 'Click to select location'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  {position[0].toFixed(4)}, {position[1].toFixed(4)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                  💡 Look for city names on the map, then click near them
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                  Or use search for exact city names
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      {/* Map Info */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: '#f8fafc', 
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '0.875rem',
        color: '#4a5568'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span><strong>Map Center:</strong> {position[0].toFixed(4)}, {position[1].toFixed(4)}</span>
          <span style={{ fontSize: '0.75rem', color: '#718096' }}>
            Click map to select • Use search for cities
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#718096', fontStyle: 'italic' }}>
          💡 The map shows city names and labels - click near them for better location detection
        </div>
      </div>

      {selectedLocation && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#f7fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <strong>Selected Location:</strong> {selectedLocation.name}
          <br />
          <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
