import { useState, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Location } from '../types';

interface AutocompletePrediction {
  place_id: string;
  description: string;
}

interface PlaceGeometry {
  lat: number;
  lng: number;
}

interface Place {
  place_id: string;
  name: string;
  address: string;
  geometry: PlaceGeometry;
}

export const usePlacesAutocomplete = () => {
  const placesLibrary = useMapsLibrary('places');
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);

  useEffect(() => {
    if (placesLibrary) {
      setAutocompleteService(new placesLibrary.AutocompleteService());
      const dummyDiv = document.createElement('div');
      setPlacesService(new placesLibrary.PlacesService(dummyDiv));
    }
  }, [placesLibrary]);

  const getPlacePredictions = useCallback(
    async (input: string, location: Location | null) => {
      if (!autocompleteService || !input) {
        setPredictions([]);
        return;
      }

      const request: google.maps.places.AutocompletionRequest = {
        input,
        componentRestrictions: { country: 'ro' },
      };

      if (location) {
        request.location = new google.maps.LatLng(location.lat, location.lng);
        request.radius = 50000; // 50km
      }

      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions.map(p => ({ place_id: p.place_id, description: p.description })));
        } else {
          setPredictions([]);
          console.error('Error fetching autocomplete predictions:', status);
        }
      });
    },
    [autocompleteService]
  );

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<Place | null> => {
      if (!placesService || !placeId) {
        return null;
      }

      const request = {
        placeId,
        fields: ['name', 'formatted_address', 'geometry'],
      };

      return new Promise((resolve) => {
        placesService.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              place_id: place.place_id!,
              name: place.name!,
              address: place.formatted_address!,
              geometry: {
                lat: place.geometry!.location!.lat(),
                lng: place.geometry!.location!.lng(),
              },
            });
          } else {
            console.error('Error fetching place details:', status);
            resolve(null);
          }
        });
      });
    },
    [placesService]
  );

  return { getPlacePredictions, predictions, getPlaceDetails, setPredictions };
};

