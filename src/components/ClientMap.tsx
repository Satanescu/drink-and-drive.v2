import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Location } from '../types';

const API_KEY = 'AIzaSyA-B-FQ1h6dPN1jDESTmM291xMD55QfLCo';

interface ClientMapProps {
  pickup: Location | null;
  destination: Location | null;
  height?: string;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent, type: 'pickup' | 'destination') => void;
}

export const ClientMap: React.FC<ClientMapProps> = ({ pickup, destination, height = '300px', onMarkerDragEnd }) => {
  if (!pickup) {
    return (
      <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading map...
      </div>
    );
  }

  const center = destination || pickup;

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height, width: '100%' }}>
        <Map
          defaultCenter={center}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {pickup && <Marker position={pickup} draggable={true} onDragEnd={(e) => onMarkerDragEnd(e, 'pickup')} />}
          {destination && <Marker position={destination} draggable={true} onDragEnd={(e) => onMarkerDragEnd(e, 'destination')} />}
        </Map>
      </div>
    </APIProvider>
  );
};