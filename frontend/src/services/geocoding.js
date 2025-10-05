// Geocoding service using OpenStreetMap Nominatim API
// This allows us to convert any city name to coordinates without a static database

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

// Search for a location by name and return coordinates
export const geocodeLocation = async (query, limit = 5) => {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: limit.toString(),
      addressdetails: '1',
      countrycodes: '', // Search globally
      bounded: '0',
      dedupe: '1'
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}?${params}`, {
      headers: {
        'User-Agent': 'ClimoPilot/1.0' // Required by Nominatim
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const results = await response.json();
    
    return results.map(result => ({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      type: result.type || 'location',
      importance: result.importance || 0
    })).sort((a, b) => b.importance - a.importance); // Sort by importance

  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};

// Reverse geocoding - convert coordinates to location name
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=10`,
      {
        headers: {
          'User-Agent': 'ClimoPilot/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Create a cleaner location name
    let locationName = '';
    
    if (result.address) {
      const addr = result.address;
      
      // Priority order for location naming
      if (addr.city) {
        locationName = addr.city;
        if (addr.state) locationName += `, ${addr.state}`;
        if (addr.country) locationName += `, ${addr.country}`;
      } else if (addr.town) {
        locationName = addr.town;
        if (addr.state) locationName += `, ${addr.state}`;
        if (addr.country) locationName += `, ${addr.country}`;
      } else if (addr.village) {
        locationName = addr.village;
        if (addr.state) locationName += `, ${addr.state}`;
        if (addr.country) locationName += `, ${addr.country}`;
      } else if (addr.state) {
        locationName = addr.state;
        if (addr.country) locationName += `, ${addr.country}`;
      } else if (addr.country) {
        locationName = addr.country;
      } else {
        // For ocean or remote areas, use coordinates
        return null;
      }
    } else {
      // If no address details, check if it's in the ocean
      const isOcean = await checkIfOcean(lat, lng);
      if (isOcean) {
        return null; // Don't name ocean locations
      }
      locationName = result.display_name;
    }
    
    return {
      name: locationName,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      type: 'location'
    };

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Simple check to see if coordinates are in the ocean
const checkIfOcean = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`,
      {
        headers: {
          'User-Agent': 'ClimoPilot/1.0'
        }
      }
    );
    
    if (!response.ok) return true;
    
    const result = await response.json();
    
    // Check if the result indicates ocean/water
    if (result.display_name && (
      result.display_name.toLowerCase().includes('ocean') ||
      result.display_name.toLowerCase().includes('sea') ||
      result.display_name.toLowerCase().includes('water') ||
      result.display_name.toLowerCase().includes('atlantic') ||
      result.display_name.toLowerCase().includes('pacific') ||
      result.display_name.toLowerCase().includes('indian ocean')
    )) {
      return true;
    }
    
    return false;
  } catch (error) {
    return true; // Assume ocean if we can't determine
  }
};

// Search for locations with debouncing
let searchTimeout;
export const searchLocations = (query, limit = 8) => {
  return new Promise((resolve) => {
    clearTimeout(searchTimeout);
    
    if (!query || query.length < 2) {
      resolve([]);
      return;
    }

    searchTimeout = setTimeout(async () => {
      try {
        const results = await geocodeLocation(query, limit);
        resolve(results || []);
      } catch (error) {
        console.error('Search error:', error);
        resolve([]);
      }
    }, 300); // 300ms debounce
  });
};
