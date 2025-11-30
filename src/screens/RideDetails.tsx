import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card, Map } from '../components';
import { useAuth } from '../context/AuthContext';
import { ridesAPI } from '../api';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { Location, ServiceType } from '../types';
import { ViewState } from 'react-map-gl';

interface RideDetailsState {
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  serviceType: ServiceType;
}

export const RideDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { pickup, destination, serviceType } = location.state as RideDetailsState;

  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    latitude: (pickup.lat + destination.lat) / 2,
    longitude: (pickup.lng + destination.lng) / 2,
    zoom: 10,
  });

  useEffect(() => {
    // In a real app, you would call an API to get fare and time estimates
    // based on pickup, destination, and serviceType.
    // For now, we'll use mock data.
    setEstimatedFare(25.50);
    setEstimatedTime(15);
  }, [pickup, destination, serviceType]);

  const handleConfirmRide = async () => {
    if (!user) {
      alert('You must be logged in to request a ride.');
      return;
    }

    try {
      // In a real app, this would create a ride request in the database
      // and trigger driver matching.
      const rideRequest = {
        passenger_id: user.id,
        pickup_address: pickup.address,
        pickup_location: `POINT(${pickup.lng} ${pickup.lat})`,
        destination_address: destination.address,
        destination_location: `POINT(${destination.lng} ${destination.lat})`,
        service_type: serviceType,
        estimated_fare: estimatedFare,
        estimated_time: estimatedTime,
      };
      console.log('Ride request:', rideRequest);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate('/ride/searching');
    } catch (error) {
      console.error('Error confirming ride:', error);
      alert('Failed to confirm ride. Please try again.');
    }
  };

  const markers = [
    { location: { lat: pickup.lat, lng: pickup.lng }, type: 'pickup' },
    { location: { lat: destination.lat, lng: destination.lng }, type: 'destination' },
  ];

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
  };

  const backButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  };

  const contentStyles: React.CSSProperties = {
    padding: theme.spacing.xl,
  };

  const detailRowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  };

  const detailLabelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginRight: theme.spacing.md,
  };

  const detailValueStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button onClick={() => navigate(-1)} style={backButtonStyles}>
          <ArrowLeft />
        </button>
        <h1 style={titleStyles}>Ride Details</h1>
      </div>

      <div style={{ height: '300px', marginBottom: theme.spacing.xl }}>
        <Map
          height="300px"
          markers={markers}
          viewState={viewState}
          onViewStateChange={(e) => setViewState(e.viewState)}
          onMarkerDragEnd={() => {}}
        />
      </div>

      <div style={contentStyles}>
        <Card style={{ marginBottom: theme.spacing.xl }}>
          <div style={detailRowStyles}>
            <MapPin size={20} style={{ marginRight: theme.spacing.md }} />
            <div style={detailLabelStyles}>Pickup:</div>
            <div style={detailValueStyles}>{pickup.address}</div>
          </div>
          <div style={detailRowStyles}>
            <MapPin size={20} style={{ marginRight: theme.spacing.md }} />
            <div style={detailLabelStyles}>Destination:</div>
            <div style={detailValueStyles}>{destination.address}</div>
          </div>
          <div style={detailRowStyles}>
            <Clock size={20} style={{ marginRight: theme.spacing.md }} />
            <div style={detailLabelStyles}>Estimated Time:</div>
            <div style={detailValueStyles}>{estimatedTime} mins</div>
          </div>
          <div style={detailRowStyles}>
            <DollarSign size={20} style={{ marginRight: theme.spacing.md }} />
            <div style={detailLabelStyles}>Estimated Fare:</div>
            <div style={detailValueStyles}>${estimatedFare?.toFixed(2)}</div>
          </div>
        </Card>

        <Button onClick={handleConfirmRide} variant="primary" size="lg" fullWidth>
          Confirm Ride
        </Button>
      </div>
    </div>
  );
};
