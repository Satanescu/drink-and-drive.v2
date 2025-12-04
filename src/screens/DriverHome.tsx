import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import AppMap from '../components/MapConfig';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Ride } from '../types';
import { ridesAPI } from '../api/rides';
import { useNavigate } from 'react-router-dom';

export const DriverHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(false);
  const [rideRequests, setRideRequests] = useState<Ride[]>([]);

  useEffect(() => {
    if (user && user.vehicle_type) {
      const channel = supabase.channel(`new-ride-requests-${user.vehicle_type}`);

      channel
        .on('broadcast', { event: 'new-ride' }, (payload) => {
          console.log('New ride request:', payload);
          setRideRequests((prev) => [...prev, payload.payload as Ride]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleAcceptRide = async (ride: Ride) => {
    if (!user) return;
    try {
      const { ride: acceptedRide } = await ridesAPI.acceptRideRequest(ride.id, user.id);
      setRideRequests(prev => prev.filter(r => r.id !== ride.id));
      navigate('/ride/active', { state: { ride: acceptedRide, driver: user } });
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };
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
      <AppMap />
      <div style={{ padding: theme.spacing.xl }}>
        <h2>Ride Requests</h2>
        {rideRequests.map((ride) => (
          <div key={ride.id} style={{ border: '1px solid white', padding: '1rem', marginBottom: '1rem' }}>
            <p>From: {ride.pickup.address}</p>
            <p>To: {ride.destination.address}</p>
            <p>Price: {ride.estimatedCost.min.toFixed(2)} - {ride.estimatedCost.max.toFixed(2)} RON</p>
            <p>Time: {ride.estimatedDuration}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => handleAcceptRide(ride)}>Accept</button>
              <button onClick={() => setRideRequests(prev => prev.filter(r => r.id !== ride.id))}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};