import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Header } from '../components';
import { Vehicle } from '../types';

export const VehicleSelection: React.FC = () => {
  const { vehicles, setActiveVehicle, activeVehicle } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (vehicle: Vehicle) => {
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
  }

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  };

  const listStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const vehicleCardStyles = (isActive: boolean): React.CSSProperties => ({
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    border: `2px solid ${isActive ? theme.colors.primary : 'transparent'}`,
    cursor: 'pointer',
  });

  return (
    <div style={containerStyles}>
      <Header title="Select Your Vehicle" />
      <div style={contentStyles}>
        <div style={listStyles}>
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              style={vehicleCardStyles(vehicle.id === activeVehicle?.id)}
              onClick={() => handleSelect(vehicle)}
            >
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                {vehicle.manufacturer} {vehicle.model} ({vehicle.year})
              </p>
              <p style={{ margin: '4px 0 0', color: theme.colors.text.secondary }}>
                {vehicle.license_plate} - {vehicle.color}
              </p>
            </div>
          ))}
          {vehicles.length === 0 && <p>No vehicles registered.</p>}
        </div>
        <Button 
          onClick={() => navigate('/driver/onboarding/type-selection')} 
          variant="secondary" 
          style={{ marginTop: theme.spacing.xl, maxWidth: '500px', margin: '2rem auto 0' }}
          fullWidth
        >
          Add a New Vehicle
        </Button>
      </div>
    </div>
  );
};
