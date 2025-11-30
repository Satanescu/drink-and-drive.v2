import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Button, EarningsDisplay, GoButtonSheet, LastTripCard, QuestCard } from '../components';
import { Search, User } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

type ActiveCard = 'lastTrip' | 'quest' | null;

export const DriverMap: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [activeCard, setActiveCard] = useState<ActiveCard>('lastTrip');
  
  const [viewport, setViewport] = useState({
    latitude: 44.4268, // Default to Bucharest
    longitude: 26.1025,
    zoom: 13,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewport((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 15,
          }));
        },
        () => {}, // Empty error handler
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const containerStyles: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    position: 'relative',
    backgroundColor: '#333', // Corresponds to slate gray map tones
  };

  const topBarStyles: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: theme.zIndex.sticky,
  };

  const avatarStyles: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: theme.colors.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.elevation4,
  };

  const cardSwitcherStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '30%', // Moved a little bit down
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: theme.spacing.sm,
    zIndex: 11,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  }

  return (
    <div style={containerStyles}>
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{width: '100%', height: '100%'}}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      />

      <div style={topBarStyles}>
        <Button variant="ghost" size="icon" style={avatarStyles}>
          <Search />
        </Button>
        <Button variant="ghost" size="icon" style={avatarStyles} onClick={() => navigate('/profile')}>
          <User />
        </Button>
      </div>

      <EarningsDisplay earnings="$7.75" />

      {!isOnline && (
        <>
          {activeCard === 'lastTrip' && <LastTripCard />}
          {activeCard === 'quest' && <QuestCard />}
          <div style={cardSwitcherStyles}>
            <Button 
              size="sm" 
              variant={activeCard === 'lastTrip' ? 'primary' : 'ghost'} 
              onClick={() => setActiveCard('lastTrip')}
            >
              Last Trip
            </Button>
            <Button 
              size="sm" 
              variant={activeCard === 'quest' ? 'primary' : 'ghost'} 
              onClick={() => setActiveCard('quest')}
            >
              Quests
            </Button>
          </div>
        </>
      )}
      
      <GoButtonSheet isOnline={isOnline} onToggle={() => setIsOnline(!isOnline)} />
    </div>
  );
};
