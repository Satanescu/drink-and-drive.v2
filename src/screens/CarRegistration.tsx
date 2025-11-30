import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesAPI } from '../api/vehicles';
import { theme } from '../theme';
import { Button, Input, Header } from '../components';

export const CarRegistration: React.FC = () => {
  const { user, addVehicle } = useAuth();
  const navigate = useNavigate();

  const [licensePlate, setLicensePlate] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [category, setCategory] = useState('');
  const [insurance, setInsurance] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in.');
      return;
    }

    // Basic validation
    if (!licensePlate || !manufacturer || !model || !year || !color) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newVehicle = await vehiclesAPI.createVehicle({
        driver_id: user.id,
        vehicle_type: 'car',
        license_plate: licensePlate,
        manufacturer,
        model,
        year: parseInt(year, 10),
        color,
        category,
        insurance_details: insurance,
      });

      addVehicle(newVehicle);
      navigate('/driver/map');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
  };

  const formContainerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: theme.spacing.xl,
  };

  const errorStyles: React.CSSProperties = {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  };

  return (
    <div style={containerStyles}>
      <Header title="Register Your Car" />
      <div style={formContainerStyles}>
        <form onSubmit={handleSubmit}>
          <Input
            label="License Plate Number"
            value={licensePlate}
            onChange={setLicensePlate}
            placeholder="B 123 ABC"
            required
          />
          <Input
            label="Car Manufacturer"
            value={manufacturer}
            onChange={setManufacturer}
            placeholder="e.g., Volkswagen, Toyota"
            required
          />
          <Input
            label="Car Model"
            value={model}
            onChange={setModel}
            placeholder="e.g., Passat, Corolla"
            required
          />
          <Input
            label="Year of Manufacture"
            value={year}
            onChange={setYear}
            placeholder="e.g., 2021"
            type="number"
            required
          />
          <Input
            label="Car Color"
            value={color}
            onChange={setColor}
            placeholder="e.g., Blue"
            required
          />
          <Input
            label="Vehicle Category"
            value={category}
            onChange={setCategory}
            placeholder="e.g., Sedan, SUV, Hatchback"
          />
          <Input
            label="Insurance Details"
            value={insurance}
            onChange={setInsurance}
            placeholder="e.g., Policy Number"
          />
          
          {error && <p style={errorStyles}>{error}</p>}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} style={{ marginTop: theme.spacing.lg }}>
            {loading ? 'Saving...' : 'Submit Vehicle'}
          </Button>
        </form>
      </div>
    </div>
  );
};