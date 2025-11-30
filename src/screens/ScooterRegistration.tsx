import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesAPI } from '../api/vehicles';
import { theme } from '../theme';
import { Button, Input, Header } from '../components';

export const ScooterRegistration: React.FC = () => {
  const { user, addVehicle } = useAuth();
  const navigate = useNavigate();

  const [licensePlate, setLicensePlate] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in.');
      return;
    }

    if (!licensePlate || !manufacturer || !model) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newVehicle = await vehiclesAPI.createVehicle({
        driver_id: user.id,
        vehicle_type: 'scooter',
        license_plate: licensePlate,
        manufacturer,
        model,
        year: year ? parseInt(year, 10) : undefined,
        color,
      });

      addVehicle(newVehicle);
      navigate('/driver/map');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, color: theme.colors.text.primary }}>
      <Header title="Register Your Scooter" />
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: theme.spacing.xl }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="License Plate Number"
            value={licensePlate}
            onChange={setLicensePlate}
            placeholder="e.g., S 123 ABC"
            required
          />
          <Input
            label="Scooter Manufacturer"
            value={manufacturer}
            onChange={setManufacturer}
            placeholder="e.g., Xiaomi, Segway"
            required
          />
          <Input
            label="Scooter Model"
            value={model}
            onChange={setModel}
            placeholder="e.g., Mi Electric Scooter Pro 2"
            required
          />
          <Input
            label="Year"
            value={year}
            onChange={setYear}
            type="number"
          />
          <Input
            label="Color"
            value={color}
            onChange={setColor}
            placeholder="e.g., Black"
          />
          
          {error && <p style={{ color: theme.colors.error, textAlign: 'center', marginBottom: theme.spacing.md }}>{error}</p>}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} style={{ marginTop: theme.spacing.lg }}>
            {loading ? 'Saving...' : 'Submit Scooter'}
          </Button>
        </form>
      </div>
    </div>
  );
};
