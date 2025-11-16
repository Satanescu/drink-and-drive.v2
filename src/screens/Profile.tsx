import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card } from '../components';
import { useAuth } from '../context/auth.hooks';
import { ArrowLeft, LogOut, User } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [isDriver, setIsDriver] = useState(user?.role === 'driver');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRoleChange = async () => {
    const newRole = isDriver ? 'client' : 'driver';
    await updateUser({ role: newRole as UserRole });
    setIsDriver(!isDriver);
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
    paddingBottom: theme.spacing.xl,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  };

  const backButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    flex: 1,
  };

  const profileSectionStyles: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const profileAvatarStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  };

  const userNameStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  const userDetailsStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  };

  const toggleContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  };

  const toggleLabelStyles: React.CSSProperties = {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  };

  const toggleSwitchStyles = (active: boolean): React.CSSProperties => ({
    width: '60px',
    height: '32px',
    backgroundColor: active ? theme.colors.primary : theme.colors.border.medium,
    borderRadius: theme.borderRadius.full,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    border: 'none',
    position: 'relative',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: active ? '32px' : '4px',
  });

  const toggleCircleStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    backgroundColor: theme.colors.text.primary,
    borderRadius: '50%',
    transition: theme.transitions.fast,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button style={backButtonStyles} onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={titleStyles}>Profil</h1>
      </div>

      <div style={profileSectionStyles}>
        <div style={profileAvatarStyles}>
          <User size={40} color={theme.colors.text.primary} />
        </div>
        <h2 style={userNameStyles}>{user.fullName}</h2>
        <div style={userDetailsStyles}>Email: {user.email}</div>
        <div style={userDetailsStyles}>Telefon: {user.phone}</div>
        {user.rating && <div style={userDetailsStyles}>Rating: {user.rating} ★</div>}
      </div>

      <h3 style={sectionTitleStyles}>Mod Aplicație</h3>

      <Card padding="md" style={{ marginBottom: theme.spacing.lg }}>
        <div style={toggleContainerStyles}>
          <span style={toggleLabelStyles}>
            {isDriver ? 'Mod șofer' : 'Mod client'}
          </span>
          <button
            style={toggleSwitchStyles(isDriver)}
            onClick={handleRoleChange}
          >
            <div style={toggleCircleStyles} />
          </button>
        </div>
        <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
          {isDriver
            ? 'Ești conectat ca șofer. Comută pentru a primi curse.'
            : 'Ești conectat ca pasager. Comută pentru a oferi curse.'}
        </p>
      </Card>

      <h3 style={sectionTitleStyles}>Notificări</h3>

      <Card padding="md" style={{ marginBottom: theme.spacing.lg }}>
        <div style={toggleContainerStyles}>
          <span style={toggleLabelStyles}>Notificări push</span>
          <button
            style={toggleSwitchStyles(notificationsEnabled)}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <div style={toggleCircleStyles} />
          </button>
        </div>
      </Card>

      <h3 style={sectionTitleStyles}>Acțiuni</h3>

      <Button
        onClick={() => navigate('/safety')}
        variant="secondary"
        size="md"
        fullWidth
        style={{ marginBottom: theme.spacing.md }}
      >
        Informații de Siguranță
      </Button>

      <Button
        onClick={handleLogout}
        variant="danger"
        size="md"
        fullWidth
        icon={<LogOut size={18} />}
      >
        Deconectare
      </Button>
    </div>
  );
};
