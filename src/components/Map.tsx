import React from 'react';
import { theme } from '../theme';
import { MapPin, Navigation } from 'lucide-react';
import { Location } from '../types';

interface MapProps {
  center?: Location;
  markers?: Array<{ location: Location; type: 'user' | 'driver' | 'pickup' | 'destination'; label?: string }>;
  height?: string;
  showUserLocation?: boolean;
}

export const Map: React.FC<MapProps> = ({
  center = { lat: 44.4268, lng: 26.1025 },
  markers = [],
  height = '400px',
  showUserLocation = true,
}) => {
  const mapStyles: React.CSSProperties = {
    width: '100%',
    height,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: `linear-gradient(${theme.colors.border.light} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.border.light} 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
  };

  const markerContainerStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const markerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    color: theme.colors.text.primary,
    boxShadow: theme.shadows.lg,
  };

  const placeholderTextStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: theme.colors.surface,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.primary,
  };

  return (
    <div style={mapStyles}>
      <div style={markerContainerStyles}>
        {showUserLocation && (
          <div style={markerStyles}>
            <Navigation size={20} />
          </div>
        )}
        {markers.map((marker, index) => (
          <div
            key={index}
            style={{
              ...markerStyles,
              backgroundColor:
                marker.type === 'driver'
                  ? theme.colors.success
                  : marker.type === 'destination'
                  ? theme.colors.error
                  : theme.colors.primary,
            }}
          >
            <MapPin size={20} />
          </div>
        ))}
      </div>
      <div style={placeholderTextStyles}>
        Hartă (Mock) - {center.address || `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`}
      </div>
    </div>
  );
};
