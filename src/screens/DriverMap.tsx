import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppMap from '../components/MapConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Button, EarningsDisplay, GoButtonSheet, LastTripCard, QuestCard, RideRequestCard } from '../components';
import { Search, User } from 'lucide-react';
import { authAPI } from '../api/auth';
import { ridesAPI } from '../api';
import { Location, Ride } from '../types';
import { supabase } from '../lib/supabase';

type ActiveCard = 'lastTrip' | 'quest' | null;

export const DriverMap: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(user?.is_online || false);
  const [activeCard, setActiveCard] = useState<ActiveCard>('lastTrip');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [rideRequest, setRideRequest] = useState<Ride | null>(null);

  useEffect(() => {
    if (user) {
      setIsOnline(user.is_online || false);
      if (user.current_location_lat && user.current_location_lng) {
        setCurrentLocation({ lat: user.current_location_lat, lng: user.current_location_lng });
      }
    }
  }, [user]);

  useEffect(() => {
    if (isOnline && user && user.vehicle_type) {
      const channel = supabase.channel(`new-ride-requests-${user.vehicle_type}`);

      channel
        .on('broadcast', { event: 'new-ride' }, (payload) => {
          console.log('New ride request received:', payload);
          setRideRequest(payload.payload as Ride);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOnline, user]);

  const handleToggleOnline = async () => {
    if (!user) return;
    const newStatus = !isOnline;

    if (newStatus) {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await authAPI.updateUser(user.id, {
              is_online: newStatus,
              current_location_lat: latitude,
              current_location_lng: longitude,
            });
            setCurrentLocation({ lat: latitude, lng: longitude });
            setIsOnline(newStatus);
          } catch (error) {
            console.error('Failed to update online status with location:', error);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          alert('Could not get your location. Please enable location services.');
        }
      );
    } else {
      try {
        await authAPI.updateUser(user.id, { is_online: newStatus });
        setIsOnline(newStatus);
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    }
  };

  const handleAcceptRide = async () => {
    if (!rideRequest || !user) return;
    try {
      const { ride } = await ridesAPI.acceptRideRequest(rideRequest.id, user.id);
      setRideRequest(null);
      navigate('/ride/active', { state: { ride, driver: user } });
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert('A aparut o eroare. Te rugam sa incerci din nou.');
    }
  };

  const handleDeclineRide = () => {
    console.log('Ride declined:', rideRequest);
    setRideRequest(null);
  };

  const containerStyles: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    position: 'relative',
    backgroundColor: '#333',
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
    bottom: '30%',
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
      <AppMap center={currentLocation} />

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
      
      <GoButtonSheet isOnline={isOnline} onToggle={handleToggleOnline} />

      {rideRequest && (
        <RideRequestCard 
          request={rideRequest}
          onAccept={handleAcceptRide}
          onDecline={handleDeclineRide}
        />
      )}
    </div>
  );
};
