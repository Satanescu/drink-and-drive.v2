import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Button } from '../components';

export const RoleSelection: React.FC = () => {
  const { user, switchActiveRole } = useAuth();

  const handleRoleSelection = (role: 'client' | 'driver') => {
    console.log(`RoleSelection: handleRoleSelection called with role: ${role}`);
    // This component should only be visible for users who are drivers
    // but haven't chosen their active role for the session yet.
    if (user?.role === 'driver') {
        switchActiveRole(role);
    } else if (user?.role === 'client' && role === 'client') {
        // If a client lands here for some reason, let them proceed.
        switchActiveRole('client');
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.text.primary,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
  };

  const buttonContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>Select Your Mode</h1>
      <div style={buttonContainerStyles}>
        <Button onClick={() => handleRoleSelection('client')} variant="primary" size="lg">
          Passenger
        </Button>
        {/* Only show the Driver button if the user is actually a driver */}
        {user?.role === 'driver' && (
            <Button onClick={() => handleRoleSelection('driver')} variant="secondary" size="lg">
                Driver
            </Button>
        )}
      </div>
    </div>
  );
};