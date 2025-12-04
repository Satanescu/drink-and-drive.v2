import React from 'react';
import { theme } from '../theme';
import { Button } from './Button';
import { User, Star, MapPin, DollarSign } from 'lucide-react';
import { Ride } from '../types';

interface RideRequestCardProps {
  request: Ride;
  onAccept: () => void;
  onDecline: () => void;
}

export const RideRequestCard: React.FC<RideRequestCardProps> = ({ request, onAccept, onDecline }) => {
  const cardStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.xl,
    borderTop: `4px solid ${theme.colors.primary}`,
    zIndex: 1000,
  };

  const detailRowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  };

  return (
    <div style={cardStyles}>
      <h2 style={{marginTop: 0}}>New Ride Request</h2>
      
      <div style={detailRowStyles}>
        <MapPin size={20} color={theme.colors.text.secondary} />
        <p>From: {request.pickup.address}</p>
      </div>

      <div style={detailRowStyles}>
        <MapPin size={20} color={theme.colors.primary} />
        <p>To: {request.destination.address}</p>
      </div>

      <div style={detailRowStyles}>
        <DollarSign size={20} color={theme.colors.success} />
        <p style={{fontWeight: 'bold'}}>Estimated Fare: {request.estimatedCost.min.toFixed(2)} - {request.estimatedCost.max.toFixed(2)} RON</p>
      </div>

      <div style={buttonContainerStyles}>
        <Button onClick={onDecline} variant="danger" fullWidth>Decline</Button>
        <Button onClick={onAccept} variant="primary" fullWidth>Accept</Button>
      </div>
    </div>
  );
};