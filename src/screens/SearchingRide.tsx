import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button } from '../components';
import { ridesAPI } from '../api';
import { Loader } from 'lucide-react';
import { Ride } from '../types';
import { supabase } from '../lib/supabase';

interface SearchingRideState {
  ride: Ride;
}

export const SearchingRide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SearchingRideState;
  const ride = state?.ride;
  const [error, setError] = useState<string | null>(null);
  const [rideId, setRideId] = useState<string | null>(null);

  useEffect(() => {
    if (ride?.id) {
      setRideId(ride.id);
    }
  }, [ride]);

  useEffect(() => {
    if (!rideId) {
      if (!ride) {
        console.log('SearchingRide: No ride object found in state, navigating to home.');
        navigate('/home');
      }
      return;
    }
  
    console.log(`SearchingRide: Setting up subscription for ride id: ${rideId}`);
  
    const channel = supabase
      .channel(`ride-${rideId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rides', filter: `id=eq.${rideId}` }, async (payload) => {
        console.log('SearchingRide: Received payload:', payload);
        const updatedRide = payload.new as Ride;
        if (updatedRide.status === 'driver-found' && updatedRide.driver_id) {
          console.log('SearchingRide: Ride status is driver-found, fetching driver profile.');
          const { data: driver, error: driverError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', updatedRide.driver_id)
            .single();
  
          if (driverError) {
            console.error('SearchingRide: Error fetching driver profile:', driverError);
            setError('A aparut o eroare in timpul gasirii soferului. Te rugam sa incerci din nou.');
          } else {
            console.log('SearchingRide: Driver profile fetched, navigating to /ride/driver-found.');
            navigate('/ride/driver-found', { state: { ride: updatedRide, driver } });
          }
        } else {
            console.log(`SearchingRide: Received update, but status is not 'driver-found'. Status: ${updatedRide.status}`);
        }
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`SearchingRide: Successfully subscribed to ride-${rideId}`);
        } else {
          console.error(`SearchingRide: Subscription failed with status: ${status}`, err);
          setError('Nu am putut urmari statusul cursei. Te rugam sa incerci din nou.');
        }
      });
  
    return () => {
      console.log(`SearchingRide: Unsubscribing from ride-${rideId}`);
      supabase.removeChannel(channel);
    };
  }, [rideId, navigate]);

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
    textAlign: 'center',
  };

  const loaderStyles: React.CSSProperties = {
    animation: 'spin 2s linear infinite',
    marginBottom: theme.spacing.xl,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  };

  const textStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  };

  const errorStyles: React.CSSProperties = {
    color: theme.colors.danger,
    marginBottom: theme.spacing.lg,
  };

  if (error) {
    return (
      <div style={containerStyles}>
        <h1 style={titleStyles}>Error</h1>
        <p style={errorStyles}>{error}</p>
        <Button onClick={() => navigate('/home')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <Loader size={48} color={theme.colors.primary} style={loaderStyles} />
      <h1 style={titleStyles}>Căutăm un șofer pentru tine...</h1>
      <p style={textStyles}>Asta nu durează mult. Te vom anunța când găsim pe cineva.</p>
    </div>
  );
};
