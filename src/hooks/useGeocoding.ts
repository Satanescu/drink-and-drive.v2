import { useState, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Location } from '../types';

export const useGeocoding = () => {
  const geocodingLibrary = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLibrary) {
      setGeocoder(new geocodingLibrary.Geocoder());
    }
  }, [geocodingLibrary]);

  const reverseGeocode = useCallback(
    async (location: Location): Promise<string | null> => {
      if (!geocoder) {
        return null;
      }

      return new Promise((resolve) => {
        geocoder.geocode({ location }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            console.error('Error during reverse geocoding:', status);
            resolve(null);
          }
        });
      });
    },
    [geocoder]
  );

  return { reverseGeocode };
};
