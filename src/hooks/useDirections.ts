import { useState, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Location } from '../types';

interface Directions {
  distance: string;
  duration: string;
  distanceValue: number;
  durationValue: number;
}

export const useDirections = () => {
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);

  useEffect(() => {
    if (routesLibrary) {
      setDirectionsService(new routesLibrary.DirectionsService());
    }
  }, [routesLibrary]);

  const getDirections = useCallback(
    async (origin: Location, destination: Location): Promise<Directions | null> => {
      if (!directionsService) {
        return null;
      }

      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      return new Promise((resolve) => {
        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0].legs[0];
            resolve({
              distance: route.distance!.text,
              duration: route.duration!.text,
              distanceValue: route.distance!.value,
              durationValue: route.duration!.value,
            });
          } else {
            console.error('Error fetching directions:', status);
            resolve(null);
          }
        });
      });
    },
    [directionsService]
  );

  return { getDirections };
};
