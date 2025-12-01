import React, { useState, useEffect } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Location } from '../types';

const API_KEY = 'AIzaSyA-B-FQ1h6dPN1jDESTmM291xMD55QfLCo';

interface RideDetailsMapProps {
  pickup: Location;
  destination: Location;
}

const Directions = ({ pickup, destination }: RideDetailsMapProps) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: pickup,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then(response => {
        directionsRenderer.setDirections(response);
      });
  }, [directionsService, directionsRenderer, pickup, destination]);
  
  return null;
}

export const RideDetailsMap: React.FC<RideDetailsMapProps> = ({ pickup, destination }) => {
  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: '300px', width: '100%' }}>
        <Map
          defaultCenter={pickup}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <Directions pickup={pickup} destination={destination} />
        </Map>
      </div>
    </APIProvider>
  );
};