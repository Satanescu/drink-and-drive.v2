import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button } from '../components';
import { ridesAPI } from '../api';
import { Loader } from 'lucide-react';

interface SearchingRideState {
  rideId: string;
}

export const SearchingRide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SearchingRideState;
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    const findDriver = async () => {
      try {
        const rideId = state?.rideId;
        if (rideId) {
          const result = await ridesAPI.findDriver(rideId);
          setTimeout(() => {
            navigate('/ride/driver-found', { state: { ride: result.ride, driver: result.driver } });
          }, 1000);
        }
      } catch (error) {
        console.error('Error finding driver:', error);
        setSearching(false);
      }
    };

    findDriver();
  }, [state?.rideId, navigate]);

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

  return (
    <div style={containerStyles}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      {searching ? (
        <>
          <Loader size={48} color={theme.colors.primary} style={loaderStyles} />
          <h1 style={titleStyles}>Căutăm un șofer pentru tine...</h1>
          <p style={textStyles}>Asta nu durează mult. Te vom anunța când găsim pe cineva.</p>
        </>
      ) : (
        <>
          <h1 style={titleStyles}>Eroare</h1>
          <p style={textStyles}>Nu am putut găsi un șofer. Încearcă din nou.</p>
          <Button onClick={() => navigate('/home')} variant="primary" size="lg">
            Înapoi la Acasă
          </Button>
        </>
      )}
    </div>
  );
};
