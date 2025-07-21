import React, { useState } from 'react';
import { MapPin, Search, RotateCcw } from 'lucide-react';
import { geocoder, type GeocoderResult } from '../../services/geocoder';

const GeocoderDemo: React.FC = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [result, setResult] = useState<GeocoderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');

  const handleForwardGeocode = async () => {
    if (!address.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await geocoder.geocode(address);
      
      if (response.success && response.results.length > 0) {
        const firstResult = response.results[0];
        setResult(firstResult);
        setCoordinates({
          lat: firstResult.latitude.toString(),
          lng: firstResult.longitude.toString()
        });
      } else {
        setError(response.error || 'Không tìm thấy kết quả');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const handleReverseGeocode = async () => {
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Vui lòng nhập tọa độ hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await geocoder.reverse(lat, lng);
      
      if (response.success && response.results.length > 0) {
        const firstResult = response.results[0];
        setResult(firstResult);
        setAddress(firstResult.formattedAddress);
      } else {
        setError(response.error || 'Không tìm thấy địa chỉ');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setAddress('');
    setCoordinates({ lat: '', lng: '' });
    setResult(null);
    setError('');
  };

  const testAddresses = [
    '116 Nguyễn Du, Quận 1, TP.HCM',
    'Vincom Center Đồng Khởi, TP.HCM',
    'CGV Vincom Đà Nẵng',
    'Galaxy Cinema Hà Nội',
    'Lotte Cinema Landmark 81'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <MapPin className="text-blue-500" />
        Geocoder Service Demo
      </h2>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
          <button
            onClick={() => setMode('forward')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'forward'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Địa chỉ → Tọa độ
          </button>
          <button
            onClick={() => setMode('reverse')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'reverse'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Tọa độ → Địa chỉ
          </button>
        </div>
      </div>

      {/* Forward Geocoding */}
      {mode === 'forward' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nhập địa chỉ:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: 116 Nguyễn Du, Quận 1, TP.HCM"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                onKeyPress={(e) => e.key === 'Enter' && handleForwardGeocode()}
              />
              <button
                onClick={handleForwardGeocode}
                disabled={loading || !address.trim()}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search size={16} />
                )}
                Tìm tọa độ
              </button>
            </div>
          </div>

          {/* Test Addresses */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Hoặc thử các địa chỉ mẫu:
            </p>
            <div className="flex flex-wrap gap-2">
              {testAddresses.map((testAddr, index) => (
                <button
                  key={index}
                  onClick={() => setAddress(testAddr)}
                  className="btn btn-outline btn-sm"
                  disabled={loading}
                >
                  {testAddr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reverse Geocoding */}
      {mode === 'reverse' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nhập tọa độ:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.000001"
                value={coordinates.lat}
                onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                placeholder="Latitude (VD: 10.762622)"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              />
              <input
                type="number"
                step="0.000001"
                value={coordinates.lng}
                onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                placeholder="Longitude (VD: 106.660172)"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => setCoordinates({ lat: '10.762622', lng: '106.660172' })}
                className="btn btn-outline btn-sm"
              >
                Sài Gòn mẫu
              </button>
              <button
                onClick={handleReverseGeocode}
                disabled={loading || !coordinates.lat || !coordinates.lng}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search size={16} />
                )}
                Tìm địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={clearAll}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Xóa tất cả
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-medium text-green-800 dark:text-green-200 mb-3">
            ✅ Kết quả Geocoding:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Tọa độ:</strong> {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}</p>
              <p><strong>Địa chỉ đầy đủ:</strong> {result.formattedAddress}</p>
              <p><strong>Thành phố:</strong> {result.city}</p>
              <p><strong>Quận/Huyện:</strong> {result.state}</p>
            </div>
            <div>
              <p><strong>Quốc gia:</strong> {result.country} ({result.countryCode})</p>
              <p><strong>Mã bưu điện:</strong> {result.zipcode}</p>
              <p><strong>Đường:</strong> {result.streetName} {result.streetNumber}</p>
              <p><strong>Khu vực:</strong> {result.neighbourhood}</p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
            <a
              href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline"
            >
              📍 Xem trên Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeocoderDemo;
