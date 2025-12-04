import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Modal } from '../components';
import AppMap from '../components/MapConfig';
import { ridesAPI } from '../api';
import { AlertTriangle } from 'lucide-react';
import { Ride, Driver } from '../types';

interface ActiveRideState {
  ride: Ride;
  driver: Driver;
}

export const DriverActiveRide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ActiveRideState;

  const ride = state?.ride;
  const driver = state?.driver;

  const [showSOSModal, setShowSOSModal] = useState(false);
  const [isRideStarted, setIsRideStarted] = useState(false);

  if (!ride || !driver) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: theme.colors.text.primary }}>Eroare</div>;
  }

  const handleStartRide = async () => {
    await ridesAPI.updateRideStatus(ride.id, 'in-progress');
    setIsRideStarted(true);
  };

  const handleFinishRide = async () => {
    await ridesAPI.updateRideStatus(ride.id, 'completed');
    navigate('/map');
  };

  const handleSOS = (type: 'call' | 'contact') => {
    if (type === 'call') {
      window.location.href = 'tel:112';
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.lg,
    textAlign: 'center',
  };

  const statusStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.success,
  };

  const mapContainerStyles: React.CSSProperties = {
    flex: 1,
  };

  const sosButtonStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '120px',
    right: theme.spacing.lg,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: theme.colors.error,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.text.primary,
    boxShadow: theme.shadows.lg,
    zIndex: 100,
  };

  const buttonGroupStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTop: `1px solid ${theme.colors.border.light}`,
  };

  const sosModalContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  };

  const sosOptionStyles: React.CSSProperties = {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    textAlign: 'center',
    border: `1px solid ${theme.colors.border.light}`,
  };

  const sosOptionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  };

  const sosOptionDescStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={statusStyles}>Cursa Activa</div>
      </div>

      <div style={mapContainerStyles}>
        <AppMap
          center={driver.currentLocation}
          origin={driver.currentLocation}
          destination={ride.destination}
        />
      </div>

      <button style={sosButtonStyles} onClick={() => setShowSOSModal(true)}>
        <AlertTriangle size={24} />
      </button>

      <div style={buttonGroupStyles}>
        {isRideStarted ? (
          <Button
            onClick={handleFinishRide}
            variant="primary"
            size="lg"
            fullWidth
          >
            Finalizeaza
          </Button>
        ) : (
          <Button
            onClick={handleStartRide}
            variant="primary"
            size="lg"
            fullWidth
          >
            Start Cursa
          </Button>
        )}
      </div>

      <Modal isOpen={showSOSModal} onClose={() => setShowSOSModal(false)} title="SOS - Urgență">
        <div style={sosModalContentStyles}>
          <div
            style={sosOptionStyles}
            onClick={() => handleSOS('call')}
          >
            <div style={sosOptionTitleStyles}>Sună 112</div>
            <div style={sosOptionDescStyles}>Apelează autoritățile locale</div>
          </div>

          <div style={sosOptionStyles} onClick={() => alert('Contactul de urgență a fost anunțat')}>
            <div style={sosOptionTitleStyles}>Anunță contact de urgență</div>
            <div style={sosOptionDescStyles}>Te veți fi anunțat pe contact salvat</div>
          </div>

          <Button
            onClick={() => setShowSOSModal(false)}
            variant="ghost"
            size="md"
            fullWidth
          >
            Anulează
          </Button>
        </div>
      </Modal>
    </div>
  );
};
