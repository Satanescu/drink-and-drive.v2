import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  useMap,
} from '@vis.gl/react-google-maps';
import { Location } from '../types';

const API_KEY = 'AIzaSyA-B-FQ1h6dPN1jDESTmM291xMD55QfLCo';

interface AppMapProps {
  center?: Location | null;
  origin?: Location | null;
  destination?: Location | null;
}

function Directions({ origin, destination }: { origin: Location, destination: Location }) {
  const map = useMap();
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map) return;
    setDirectionsService(new google.maps.DirectionsService());
    setDirectionsRenderer(new google.maps.DirectionsRenderer({ map }));
  }, [map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

export default function AppMap({ center, origin, destination }: AppMapProps) {
  const defaultCenter = { lat: 44.4268, lng: 26.1025 }; // Bucharest
  
  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: '100vh', width: '100%' }}>
        <Map
          center={center || defaultCenter}
          defaultZoom={13}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {origin && destination && <Directions origin={origin} destination={destination} />}
        </Map>
      </div>
    </APIProvider>
  );
}
