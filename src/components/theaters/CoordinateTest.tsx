import React, { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { geocoder } from '../../services/geocoder';

const CoordinateTest: React.FC = () => {
  const [address, setAddress] = useState('116 Nguyễn Du, Quận 1, TP.HCM');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testGeocode = async () => {
    setLoading(true);
    try {
      const response = await geocoder.geocode(address);
      setResult(response);
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const knownLocations = [
    {
      name: 'Bitexco Financial Tower',
      address: '2 Hải Triều, Bến Nghé, Quận 1, TP.HCM',
      expectedLat: 10.7717,
      expectedLng: 106.7041
    },
    {
      name: 'Landmark 81',
      address: '720A Điện Biên Phủ, Vinhomes Central Park, Bình Thạnh, TP.HCM',
      expectedLat: 10.7953,
      expectedLng: 106.7218
    },
    {
      name: 'Nhà hát Thành phố',
      address: '7 Công Trường Lam Sơn, Bến Nghé, Quận 1, TP.HCM',
      expectedLat: 10.7769,
      expectedLng: 106.7009
    },
    {
      name: 'Chợ Bến Thành',
      address: 'Chợ Bến Thành, Quận 1, TP.HCM',
      expectedLat: 10.7720,
      expectedLng: 106.6981
    }
  ];

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in meters
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <MapPin className="text-red-500" />
        Coordinate Accuracy Test
      </h2>

      {/* Test Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Test Address:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
          />
          <button
            onClick={testGeocode}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Testing...' : 'Test'}
          </button>
        </div>
      </div>

      {/* Known Locations Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Test với địa điểm nổi tiếng:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {knownLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => setAddress(location.address)}
              className="p-3 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{location.address}</div>
              <div className="text-xs text-gray-500">
                Expected: {location.expectedLat.toFixed(4)}, {location.expectedLng.toFixed(4)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {result.success ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-3">
                ✅ Geocoding Success
              </h3>
              
              {result.results.map((res: any, index: number) => {
                const knownLocation = knownLocations.find(loc => 
                  address.toLowerCase().includes(loc.name.toLowerCase()) ||
                  loc.address.toLowerCase().includes(address.toLowerCase())
                );
                
                const distance = knownLocation ? 
                  calculateDistance(res.latitude, res.longitude, knownLocation.expectedLat, knownLocation.expectedLng) : null;

                return (
                  <div key={index} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Latitude:</strong> {res.latitude.toFixed(6)}</p>
                        <p><strong>Longitude:</strong> {res.longitude.toFixed(6)}</p>
                        <p><strong>Formatted Address:</strong> {res.formattedAddress}</p>
                      </div>
                      <div>
                        <p><strong>City:</strong> {res.city}</p>
                        <p><strong>Country:</strong> {res.country}</p>
                        {knownLocation && (
                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <p><strong>Expected:</strong> {knownLocation.expectedLat.toFixed(6)}, {knownLocation.expectedLng.toFixed(6)}</p>
                            {distance !== null && (
                              <p><strong>Distance:</strong> {distance.toFixed(1)}m {distance < 100 ? '✅' : '⚠️'}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <a
                        href={`https://www.google.com/maps?q=${res.latitude},${res.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        Google Maps
                      </a>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${res.latitude}&mlon=${res.longitude}&zoom=16`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        OpenStreetMap
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                ❌ Geocoding Failed
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                {result.error}
              </p>
            </div>
          )}

          {/* Raw Response */}
          <details className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <summary className="cursor-pointer font-medium">Raw Response (Debug)</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Cách kiểm tra độ chính xác:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Test với các địa điểm nổi tiếng có tọa độ đã biết</li>
          <li>So sánh kết quả với Google Maps và OpenStreetMap</li>
          <li>Khoảng cách dưới 100m được coi là chính xác</li>
          <li>Kiểm tra console logs để debug chi tiết</li>
        </ul>
      </div>
    </div>
  );
};

export default CoordinateTest;
