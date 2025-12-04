import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Button } from '../components';
import { authAPI } from '../api/auth';

export const RoleSelection: React.FC = () => {
  const { user, switchActiveRole } = useAuth();

  const handleRoleSelection = async (role: 'client' | 'driver') => {
    console.log(`RoleSelection: handleRoleSelection called with role: ${role}`);
    if (!user) return;

    // Workaround for new users whose role is null in the database
    const currentRole = user.role || 'client'; 

    // Existing driver switching modes
    if (currentRole === 'driver') {
        switchActiveRole(role);
    } 
    // Client choosing to stay a client
    else if (currentRole === 'client' && role === 'client') {
        switchActiveRole('client');
    }
    // Client (or new user) choosing to become a driver
    else if (currentRole === 'client' && role === 'driver') {
        try {
            await authAPI.updateUser(user.id, { role: 'driver' });
            // The onAuthStateChange listener in AuthContext should pick up the change,
            // but we call switchActiveRole here for a smoother UX.
            switchActiveRole('driver');
        } catch (error) {
            console.error("Failed to update user role:", error);
            // Here you might want to show an error to the user
        }
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
        <Button onClick={() => handleRoleSelection('driver')} variant="secondary" size="lg">
                Driver
            </Button>
      </div>
    </div>
  );
};