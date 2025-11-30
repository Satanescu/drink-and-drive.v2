import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesAPI } from '../api/vehicles';
import { theme } from '../theme';
import { Button, Header } from '../components';
import { Car, Zap, CheckCircle } from 'lucide-react';
import { Vehicle } from '../types';

export const DriverTypeSelection: React.FC = () => {
  const { user, addVehicle, vehicles, setActiveVehicle } = useAuth();
  const navigate = useNavigate();

  const handleSelectNew = (vehicleType: 'car' | 'scooter') => {
    if (!user) return;
    
    if (vehicleType === 'scooter') {
      navigate('/driver/onboarding/scooter-registration');
    } else {
      navigate('/driver/onboarding/car-registration');
    }
  };

  const handleSelectExisting = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    navigate('/driver/map');
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
  };

  const contentStyles: React.CSSProperties = {
    padding: theme.spacing.xl,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  };

  const sectionStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '500px',
    marginBottom: theme.spacing.xl,
  };

  const vehicleListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const vehicleCardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    border: `1px solid ${theme.colors.border.light}`,
  };

  return (
    <div style={containerStyles}>
      <Header title="Select Vehicle" />
      <div style={contentStyles}>
        {vehicles.length > 0 && (
          <div style={sectionStyles}>
            <h2 style={{...titleStyles, fontSize: theme.typography.fontSize.xl }}>Choose an Existing Vehicle</h2>
            <div style={vehicleListStyles}>
              {vehicles.map(v => (
                <div key={v.id} onClick={() => handleSelectExisting(v)} style={vehicleCardStyles}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{v.manufacturer} {v.model || v.vehicle_type}</p>
                  <p style={{ margin: '4px 0 0', color: theme.colors.text.secondary }}>{v.license_plate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={sectionStyles}>
          <h2 style={{...titleStyles, fontSize: theme.typography.fontSize.xl, borderTop: vehicles.length > 0 ? `1px solid ${theme.colors.border.medium}`: 'none', paddingTop: vehicles.length > 0 ? theme.spacing.xl : 0 }}>Add a New Vehicle</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
            <Button 
              onClick={() => handleSelectNew('car')} 
              variant="primary" 
              size="lg"
              icon={<Car />}
            >
              Register a Car
            </Button>
            <Button 
              onClick={() => handleSelectNew('scooter')} 
              variant="secondary" 
              size="lg"
              icon={<Zap />}
            >
              Register a Scooter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
