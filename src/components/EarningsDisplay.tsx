import React from 'react';
import { theme } from '../theme';

interface EarningsDisplayProps {
  earnings: string;
}

export const EarningsDisplay: React.FC<EarningsDisplayProps> = ({ earnings }) => {
  const styles: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.lg,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#000000', // As per description
    color: theme.colors.text.primary,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    boxShadow: theme.shadows.elevation8,
    zIndex: theme.zIndex.sticky,
  };

  return (
    <div style={styles}>
      {earnings}
    </div>
  );
};
