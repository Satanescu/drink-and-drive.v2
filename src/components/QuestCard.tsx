import React from 'react';
import { theme } from '../theme';
import { Star } from 'lucide-react';

export const QuestCard: React.FC = () => {
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
    marginTop: '40px', // Make space for the overlapping icon
  };
  
  const iconContainerStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-40px', // Overlap
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: theme.colors.primaryAction,
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.elevation4,
  };

  const headerStyles: React.CSSProperties = {
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xl,
    marginTop: '40px', // Adjust for icon
  };

  const amountStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryAction,
    margin: `${theme.spacing.sm} 0`,
  };

  const progressContainer: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.lg,
  };
  
  const progressBar: React.CSSProperties = {
    width: '100%',
    height: '10px',
    backgroundColor: theme.colors.primaryAction,
    borderRadius: theme.borderRadius.full,
  };


  return (
    <div style={cardStyles}>
      <div style={iconContainerStyles}>
        <Star size={40} color="white" />
      </div>
      <h3 style={headerStyles}>You complete your Quest!</h3>
      <p style={amountStyles}>$100.00</p>
      
      <div style={progressContainer}>
        <div style={progressBar}></div>
      </div>
      <p style={{ color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>80/80 trips</p>
    </div>
  );
};
