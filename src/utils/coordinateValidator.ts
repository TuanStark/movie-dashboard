// Coordinate validation utilities for Vietnam

interface CoordinateBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// Vietnam coordinate bounds (approximate)
const VIETNAM_BOUNDS: CoordinateBounds = {
  minLat: 8.5,    // Southernmost point (Ca Mau)
  maxLat: 23.5,   // Northernmost point (Dong Van)
  minLng: 102.0,  // Westernmost point (Dien Bien)
  maxLng: 110.0   // Easternmost point (Con Co Island)
};

// Major Vietnamese cities with known coordinates for validation
const MAJOR_CITIES = {
  'ho-chi-minh': {
    name: 'TP. Hồ Chí Minh',
    lat: 10.7769,
    lng: 106.7009,
    tolerance: 0.5 // degrees
  },
  'hanoi': {
    name: 'Hà Nội',
    lat: 21.0285,
    lng: 105.8542,
    tolerance: 0.3
  },
  'da-nang': {
    name: 'Đà Nẵng',
    lat: 16.0544,
    lng: 108.2022,
    tolerance: 0.2
  },
  'can-tho': {
    name: 'Cần Thơ',
    lat: 10.0452,
    lng: 105.7469,
    tolerance: 0.2
  },
  'hai-phong': {
    name: 'Hải Phòng',
    lat: 20.8449,
    lng: 106.6881,
    tolerance: 0.2
  }
};

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
  nearestCity?: string;
  distanceFromCity?: number;
}

export function validateVietnamCoordinates(lat: number, lng: number, address?: string): ValidationResult {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let nearestCity: string | undefined;
  let distanceFromCity: number | undefined;

  // Check if coordinates are within Vietnam bounds
  const isInVietnam = lat >= VIETNAM_BOUNDS.minLat && 
                     lat <= VIETNAM_BOUNDS.maxLat && 
                     lng >= VIETNAM_BOUNDS.minLng && 
                     lng <= VIETNAM_BOUNDS.maxLng;

  if (!isInVietnam) {
    warnings.push('Tọa độ nằm ngoài lãnh thổ Việt Nam');
    suggestions.push('Kiểm tra lại địa chỉ hoặc nhập tọa độ thủ công');
  }

  // Check against major cities if address is provided
  if (address) {
    const addressLower = address.toLowerCase();
    let closestCity: { name: string; distance: number } | null = null;

    Object.entries(MAJOR_CITIES).forEach(([key, city]) => {
      const distance = calculateDistance(lat, lng, city.lat, city.lng);
      
      // Check if address mentions this city
      const cityMentioned = addressLower.includes(city.name.toLowerCase()) ||
                           addressLower.includes(key.replace('-', ' ')) ||
                           (key === 'ho-chi-minh' && (addressLower.includes('sài gòn') || addressLower.includes('hcm')));

      if (cityMentioned) {
        if (distance > city.tolerance * 111000) { // Convert degrees to meters (rough)
          warnings.push(`Tọa độ cách xa trung tâm ${city.name} (${(distance/1000).toFixed(1)}km)`);
          suggestions.push(`Kiểm tra lại địa chỉ trong ${city.name}`);
        }
      }

      // Track closest city
      if (!closestCity || distance < closestCity.distance) {
        closestCity = { name: city.name, distance };
      }
    });

    if (closestCity) {
      nearestCity = closestCity.name;
      distanceFromCity = closestCity.distance;
    }
  }

  // Check for obviously wrong coordinates
  if (lat === 0 && lng === 0) {
    warnings.push('Tọa độ (0, 0) không hợp lệ');
    suggestions.push('Thử geocoding lại hoặc nhập tọa độ thủ công');
  }

  // Check for coordinates that might be swapped
  if (lng < 100 && lat > 100) {
    warnings.push('Có thể latitude và longitude bị hoán đổi');
    suggestions.push('Kiểm tra lại thứ tự latitude/longitude');
  }

  // Check precision (too many decimal places might indicate error)
  const latDecimals = (lat.toString().split('.')[1] || '').length;
  const lngDecimals = (lng.toString().split('.')[1] || '').length;
  
  if (latDecimals > 8 || lngDecimals > 8) {
    warnings.push('Tọa độ có độ chính xác quá cao (có thể không cần thiết)');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
    nearestCity,
    distanceFromCity
  };
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function isValidCoordinate(value: number): boolean {
  return !isNaN(value) && isFinite(value) && value !== 0;
}

// Common coordinate formats for parsing
export function parseCoordinateString(coordStr: string): { lat: number; lng: number } | null {
  // Remove whitespace and common separators
  const cleaned = coordStr.replace(/\s+/g, '').replace(/[,;]/g, ',');
  
  // Try different patterns
  const patterns = [
    /^(-?\d+\.?\d*),(-?\d+\.?\d*)$/, // "lat,lng"
    /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/, // "lat lng"
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      
      if (isValidCoordinate(lat) && isValidCoordinate(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
}
