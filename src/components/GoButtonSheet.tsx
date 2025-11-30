import React from 'react';
import { theme } from '../theme';

interface GoButtonSheetProps {
  isOnline: boolean;
  onToggle: () => void;
}

export const GoButtonSheet: React.FC<GoButtonSheetProps> = ({ isOnline, onToggle }) => {
  const sheetStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'white',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.elevation8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.lg,
  };

  const goButtonStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: isOnline ? theme.colors.surface : theme.colors.primaryAction,
    border: `8px solid ${isOnline ? theme.colors.surface : theme.colors.primaryAction}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    boxShadow: theme.shadows.elevation8,
    zIndex: 10,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const statusTextStyles: React.CSSProperties = {
    color: 'black',
    margin: 0,
    fontSize: theme.typography.fontSize['xl'],
    fontWeight: theme.typography.fontWeight.bold,
  };

  const subtextStyles: React.CSSProperties = {
    color: 'gray',
    margin: 0,
  };

  return (
    <>
      <div style={sheetStyles}>
        <h2 style={statusTextStyles}>{isOnline ? "You're Online" : 'Offline'}</h2>
        {!isOnline && <p style={subtextStyles}>5 min to request</p>}
      </div>
      <div style={goButtonStyles} onClick={onToggle}>
        {isOnline ? 'END' : 'GO'}
      </div>
    </>
  );
};
