import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationContextType {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  address: string;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
  setManualAddress: (address: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const { location, loading, error, getLocation } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 1000 * 60 * 10, // 10 minutes
  });
  const [address, setAddress] = useState<string>('');

  // Reverse geocode to get address from coordinates
  useEffect(() => {
    if (location) {
      // This would ideally use a geocoding service like Google Maps Geocoding API
      // For now, we'll just set a placeholder
      setAddress('Your current location');
      
      // Example of how you would use Google's Geocoding API:
      // const geocoder = new google.maps.Geocoder();
      // geocoder.geocode({ location: { lat: location.latitude, lng: location.longitude } }, (results, status) => {
      //   if (status === 'OK' && results[0]) {
      //     setAddress(results[0].formatted_address);
      //   }
      // });
    }
  }, [location]);

  const refreshLocation = () => {
    getLocation();
  };

  const setManualAddress = (newAddress: string) => {
    setAddress(newAddress);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        address,
        loading,
        error,
        refreshLocation,
        setManualAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
