
import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultLocation?: { lat: number; lng: number };
}

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.375rem'
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194 // Default to San Francisco
};

const LocationPicker = ({ onLocationSelect, defaultLocation = defaultCenter }: LocationPickerProps) => {
  const [marker, setMarker] = useState(defaultLocation);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    
    // Get address from coordinates using Geocoding API
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results[0]) {
        onLocationSelect({ 
          lat, 
          lng, 
          address: response.results[0].formatted_address 
        });
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      onLocationSelect({ lat, lng, address: `${lat}, ${lng}` });
    }
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultLocation}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationPicker;
