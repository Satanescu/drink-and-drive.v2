import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { theme } from '../theme';
import { MapPin, Navigation } from 'lucide-react';
import { Location } from '../types';
import { renderToString } from 'react-dom/server';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  center?: Location;
  markers?: Array<{ location: Location; type: 'user' | 'driver' | 'pickup' | 'destination'; label?: string }>;
  height?: string;
  showUserLocation?: boolean;
}

const getIconSvgString = (IconComponent: React.ElementType) => {
  return renderToString(<IconComponent size={20} />);
};

export const Map: React.FC<MapProps> = ({
  center = { lat: 44.4268, lng: 26.1025 },
  markers = [],
  height = '400px',
  showUserLocation = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom: 12,
    });

    map.current.on('load', () => {
      // Add user location marker if showUserLocation is true
      if (showUserLocation) {
        const el = document.createElement('div');
        el.className = 'user-marker';
        el.style.backgroundColor = theme.colors.primary;
        el.style.borderRadius = '50%';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = theme.colors.text.primary;
        el.style.boxShadow = theme.shadows.lg;
        el.innerHTML = getIconSvgString(Navigation);

        new mapboxgl.Marker(el).setLngLat([center.lng, center.lat]).addTo(map.current!);
      }

      // Add other markers
      markers.forEach((marker) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor =
          marker.type === 'driver'
            ? theme.colors.success
            : marker.type === 'destination'
            ? theme.colors.error
            : theme.colors.primary;
        el.style.borderRadius = '50%';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = theme.colors.text.primary;
        el.style.boxShadow = theme.shadows.lg;
        el.innerHTML = getIconSvgString(MapPin);

        new mapboxgl.Marker(el).setLngLat([marker.location.lng, marker.location.lat]).addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [center, markers, showUserLocation]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
      }}
    />
  );
};