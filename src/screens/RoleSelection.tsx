import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Button } from '../components';

export const RoleSelection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = async (role: 'client' | 'driver') => {
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating role:', error);
      } else {
        // After role is set, update user in context
        // You might want to refresh the user data here
        if (role === 'driver') {
          navigate('/driver/home');
        } else {
          navigate('/home');
        }
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
      <h1 style={titleStyles}>Are you a...</h1>
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