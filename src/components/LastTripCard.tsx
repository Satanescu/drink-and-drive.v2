import React from 'react';
import { theme } from '../theme';

export const LastTripCard: React.FC = () => {
  const cardStyles: React.CSSProperties = {
    position: 'absolute',
    top: '25%',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '12px',
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.elevation8,
    textAlign: 'center',
    zIndex: theme.zIndex.modal,
  };

  const headerStyles: React.CSSProperties = {
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.lg,
    marginBottom: theme.spacing.md,
  };

  const amountStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    margin: `${theme.spacing.md} 0`,
  };

  const metaStyles: React.CSSProperties = {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xl,
  };

  return (
    <div style={cardStyles}>
      <h3 style={headerStyles}>LAST TRIP</h3>
      <p style={amountStyles}>$7.75</p>
      <p style={metaStyles}>Today at 4:16 PM - UberX</p>
      <a href="#" style={{ color: theme.colors.primaryAction, fontWeight: 'bold', textDecoration: 'none' }}>
        See All Trips
      </a>
    </div>
  );
};
