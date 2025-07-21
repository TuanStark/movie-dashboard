// Geocoder Service for Google Maps API
interface GeocoderOptions {
  provider: 'google';
  apiKey: string;
  region?: string;
  language?: string;
  formatter?: null;
}

interface GeocoderResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  country: string;
  city: string;
  state: string;
  zipcode: string;
  streetName: string;
  streetNumber: string;
  countryCode: string;
  neighbourhood: string;
}

interface GeocoderResponse {
  success: boolean;
  results: GeocoderResult[];
  error?: string;
  status?: string;
}

class Geocoder {
  private options: GeocoderOptions;

  constructor(options: GeocoderOptions) {
    this.options = options;
  }

  async geocode(address: string): Promise<GeocoderResponse> {
    if (!address.trim()) {
      return {
        success: false,
        results: [],
        error: 'Address is required'
      };
    }

    if (!this.options.apiKey) {
      return {
        success: false,
        results: [],
        error: 'API key is required'
      };
    }

    try {
      const params = new URLSearchParams({
        address: address,
        key: this.options.apiKey,
        ...(this.options.region && { region: this.options.region }),
        ...(this.options.language && { language: this.options.language })
      });

      const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;
      console.log('Geocoding URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Geocoding response:', data);

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const results = data.results.map((result: any) => {
          console.log('Raw result:', result);
          const formatted = this.formatResult(result);
          console.log('Formatted result:', formatted);
          return formatted;
        });
        return {
          success: true,
          results: results,
          status: data.status
        };
      } else {
        return {
          success: false,
          results: [],
          error: this.getErrorMessage(data.status),
          status: data.status
        };
      }
    } catch (error: any) {
      console.error('Geocoding error:', error);
      return {
        success: false,
        results: [],
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async reverse(latitude: number, longitude: number): Promise<GeocoderResponse> {
    if (!this.options.apiKey) {
      return {
        success: false,
        results: [],
        error: 'API key is required'
      };
    }

    try {
      const params = new URLSearchParams({
        latlng: `${latitude},${longitude}`,
        key: this.options.apiKey,
        ...(this.options.language && { language: this.options.language })
      });

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const results = data.results.map((result: any) => this.formatResult(result));
        return {
          success: true,
          results: results,
          status: data.status
        };
      } else {
        return {
          success: false,
          results: [],
          error: this.getErrorMessage(data.status),
          status: data.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        results: [],
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  private formatResult(result: any): GeocoderResult {
    const components = result.address_components || [];

    const getComponent = (types: string[]) => {
      const component = components.find((comp: any) =>
        types.some(type => comp.types.includes(type))
      );
      return component ? component.long_name : '';
    };

    // Ensure we get the correct coordinates
    const geometry = result.geometry;
    const location = geometry?.location;

    if (!location) {
      console.error('No location found in geometry:', geometry);
    }

    const latitude = typeof location?.lat === 'function' ? location.lat() : location?.lat;
    const longitude = typeof location?.lng === 'function' ? location.lng() : location?.lng;

    console.log('Extracted coordinates:', { latitude, longitude });
    console.log('Original location object:', location);

    return {
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      formattedAddress: result.formatted_address || '',
      country: getComponent(['country']),
      city: getComponent(['locality', 'administrative_area_level_2']),
      state: getComponent(['administrative_area_level_1']),
      zipcode: getComponent(['postal_code']),
      streetName: getComponent(['route']),
      streetNumber: getComponent(['street_number']),
      countryCode: components.find((comp: any) => comp.types.includes('country'))?.short_name || '',
      neighbourhood: getComponent(['neighborhood', 'sublocality'])
    };
  }

  private getErrorMessage(status: string): string {
    switch (status) {
      case 'ZERO_RESULTS':
        return 'Không tìm thấy địa chỉ này. Vui lòng kiểm tra lại địa chỉ.';
      case 'OVER_QUERY_LIMIT':
        return 'Đã vượt quá giới hạn truy vấn Google Maps API.';
      case 'REQUEST_DENIED':
        return 'API key không hợp lệ hoặc bị từ chối.';
      case 'INVALID_REQUEST':
        return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra địa chỉ.';
      case 'UNKNOWN_ERROR':
        return 'Lỗi không xác định từ Google Maps API.';
      default:
        return `Lỗi Google Maps API: ${status}`;
    }
  }
}

// Cấu hình geocoder (Google Maps API)
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const geocoderOptions: GeocoderOptions = {
  provider: 'google',
  apiKey: GOOGLE_API_KEY,
  region: 'vn', // Bias results to Vietnam
  language: 'vi', // Vietnamese language
  formatter: null
};

// Export configured geocoder instance
export const geocoder = new Geocoder(geocoderOptions);

// Export types for use in components
export type { GeocoderResult, GeocoderResponse, GeocoderOptions };
