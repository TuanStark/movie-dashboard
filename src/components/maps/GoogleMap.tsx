import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, ExternalLink } from 'lucide-react';

interface GoogleMapComponentProps {
  latitude: number;
  longitude: number;
  name?: string;
  location?: string;
  height?: string;
  zoom?: number;
  showInfoWindow?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  latitude,
  longitude,
  name,
  location,
  height = '300px',
  zoom = 15,
  showInfoWindow = true
}) => {
  const [showInfo, setShowInfo] = React.useState(showInfoWindow);
  const [mapError, setMapError] = React.useState(false);

  const center = {
    lat: latitude,
    lng: longitude
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Fallback component when map fails to load
  const MapFallback = () => (
    <div
      className="bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center p-6"
      style={{ height }}
    >
      <MapPin className="text-gray-400 mb-3" size={48} />
      <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
        {name && <span className="font-medium block">{name}</span>}
        {location && <span className="text-sm block">{location}</span>}
        <span className="text-xs text-gray-500 block mt-2">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
      </p>
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <ExternalLink size={16} />
        Xem trên Google Maps
      </a>
    </div>
  );

  if (!apiKey || mapError) {
    return <MapFallback />;
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <LoadScript
        googleMapsApiKey={apiKey}
        onError={() => setMapError(true)}
        loadingElement={
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-500 dark:text-gray-400">Đang tải bản đồ...</p>
            </div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          <Marker
            position={center}
            onClick={() => setShowInfo(!showInfo)}
          />

          {showInfo && (name || location) && (
            <InfoWindow
              position={center}
              onCloseClick={() => setShowInfo(false)}
            >
              <div className="p-2">
                {name && <h3 className="font-medium text-gray-900">{name}</h3>}
                {location && <p className="text-sm text-gray-600 mt-1">{location}</p>}
                <div className="text-xs text-gray-500 mt-2">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
