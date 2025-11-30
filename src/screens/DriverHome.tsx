import React, { useState } from 'react';
import { theme } from '../theme';
import { Map } from '../components';
import { ViewState } from 'react-map-gl';

export const DriverHome: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    latitude: 45.7606,
    longitude: 21.2267,
    zoom: 12,
  });

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  };

  const toggleContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const toggleStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '60px',
    height: '34px',
  };

  const toggleInputStyles: React.CSSProperties = {
    opacity: 0,
    width: 0,
    height: 0,
  };

  const sliderStyles: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isAvailable ? theme.colors.primary : theme.colors.surfaceLight,
    transition: '.4s',
    borderRadius: '34px',
  };

  const sliderBeforeStyles: React.CSSProperties = {
    position: 'absolute',
    content: '""',
    height: '26px',
    width: '26px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%',
    transform: isAvailable ? 'translateX(26px)' : 'translateX(0)',
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Driver Dashboard</h1>
        <div style={toggleContainerStyles}>
          <span>{isAvailable ? 'Available' : 'Offline'}</span>
          <label style={toggleStyles}>
            <input type="checkbox" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} style={toggleInputStyles} />
            <span style={sliderStyles}>
              <span style={sliderBeforeStyles}></span>
            </span>
          </label>
        </div>
      </div>
      <Map
        height="calc(100vh - 80px)"
        viewState={viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        markers={[]}
        onMarkerDragEnd={() => {}}
      />
    </div>
  );
};