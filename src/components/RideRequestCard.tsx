import React from 'react';
import { theme } from '../theme';
import { Button } from './Button';
import { User, Star, MapPin, DollarSign } from 'lucide-react';

interface RideRequest {
  clientName: string;
  clientRating: number;
  pickupDistance: string;
  destination: string;
  estimatedFare: number;
}

interface RideRequestCardProps {
  request: RideRequest;
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
        <User size={20} color={theme.colors.text.secondary} />
        <p>{request.clientName}</p>
        <Star size={16} color={theme.colors.warning} style={{ marginLeft: 'auto' }} />
        <p>{request.clientRating.toFixed(1)}</p>
      </div>

      <div style={detailRowStyles}>
        <MapPin size={20} color={theme.colors.text.secondary} />
        <p>{request.pickupDistance} away</p>
      </div>

       <div style={detailRowStyles}>
        <MapPin size={20} color={theme.colors.primary} />
        <p>To: {request.destination}</p>
      </div>

      <div style={detailRowStyles}>
        <DollarSign size={20} color={theme.colors.success} />
        <p style={{fontWeight: 'bold'}}>Estimated Fare: ${request.estimatedFare.toFixed(2)}</p>
      </div>

      <div style={buttonContainerStyles}>
        <Button onClick={onDecline} variant="danger" fullWidth>Decline</Button>
        <Button onClick={onAccept} variant="primary" fullWidth>Accept</Button>
      </div>
    </div>
  );
};
