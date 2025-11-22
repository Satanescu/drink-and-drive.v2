import React from 'react';
import MapGL, { Marker, NavigationControl, ViewState, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { theme } from '../theme';
import { MapPin, Navigation } from 'lucide-react';
import { Location } from '../types';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2F0YW5lc2N1IiwiYSI6ImNtaTFydHUxdDBlOTcybXF3aHZkOHUwemsifQ.Rgn2P0SNUxd8uys4XTBZOw';

interface MapProps {
  markers?: Array<{ location: Location; type: 'user' | 'driver' | 'pickup' | 'destination'; label?: string }>;
  height?: string;
  viewState: Partial<ViewState>;
  onViewStateChange: (e: { viewState: ViewState }) => void;
}

export const Map: React.FC<MapProps> = ({
  markers = [],
  height = '400px',
  viewState,
  onViewStateChange,
}) => {
  const mapRef = React.useRef<MapRef>(null);

  const otherMarkers = markers.map((marker, index) => (
    <Marker key={index} longitude={marker.location.lng} latitude={marker.location.lat}>
      <div
        style={{
          background:
            marker.type === 'driver'
              ? theme.colors.success
              : marker.type === 'destination'
              ? theme.colors.error
              : marker.type === 'pickup'
              ? theme.colors.primary
              : theme.colors.primary,
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.text.primary,
          boxShadow: theme.shadows.lg,
        }}
      >
        {marker.type === 'user' ? <Navigation size={20} /> : <MapPin size={20} />}
      </div>
    </Marker>
  ));

  return (
    <div style={{ height, borderRadius: theme.borderRadius.lg, overflow: 'hidden' }}>
      <MapGL
        ref={mapRef}
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(e) => onViewStateChange(e)}
      >
        <NavigationControl position="top-right" />
        {otherMarkers}
      </MapGL>
    </div>
  );
};