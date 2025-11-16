import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import { Button, Card, Badge } from '../components';
import { useAuth } from '../context/auth.hooks';
import { ridesAPI } from '../api';
import { MapPin, TrendingUp, Star, DollarSign, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RideRequest {
  id: string;
  rideId: string;
  driverId: string;
  distanceToClient: number;
  estimatedEarnings: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
}

export const DriverHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [stats] = useState({
    completedRides: 47,
    averageRating: 4.9,
    estimatedEarnings: 245,
  });

  useEffect(() => {
    const loadRequests = async () => {
      if (isOnline && user) {
        const reqs = await ridesAPI.getNearbyRideRequests(user.id);
        setRequests(reqs);
      }
    };

    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, [isOnline, user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAccept = async (requestId: string) => {
    if (user) {
      await ridesAPI.acceptRideRequest(requestId, user.id);
      setRequests(requests.filter((r) => r.id !== requestId));
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
    paddingBottom: '100px',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  };

  const statusToggleStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  };

  const toggleSwitchStyles = (active: boolean): React.CSSProperties => ({
    width: '60px',
    height: '32px',
    backgroundColor: active ? theme.colors.success : theme.colors.border.medium,
    borderRadius: theme.borderRadius.full,
    cursor: 'pointer',
    border: 'none',
    transition: theme.transitions.fast,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: active ? '32px' : '4px',
  });

  const toggleCircleStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    backgroundColor: theme.colors.text.primary,
    borderRadius: '50%',
  };

  const statsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  };



  const statLabelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  };

  const statValueStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  };

  const requestsContainerStyles: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  };

  const requestCardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `2px solid ${theme.colors.primary}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  };

  const requestHeaderStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  };

  const distanceStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  };

  const earningsStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
  };

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing['2xl'],
    color: theme.colors.text.secondary,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Mod șofer</h1>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.text.secondary,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          <LogOut size={24} />
        </button>
      </div>

      <div style={statusToggleStyles}>
        <span style={{ color: theme.colors.text.primary, fontWeight: 'bold' }}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <button
          style={toggleSwitchStyles(isOnline)}
          onClick={() => setIsOnline(!isOnline)}
        >
          <div style={toggleCircleStyles} />
        </button>
      </div>

      <h2 style={sectionTitleStyles}>Statistici săptămână</h2>

      <div style={statsGridStyles}>
        <Card padding="md" style={{ textAlign: 'center' }}>
          <TrendingUp size={20} color={theme.colors.primary} style={{ margin: '0 auto 0.5rem' }} />
          <div style={statLabelStyles}>Curse</div>
          <div style={statValueStyles}>{stats.completedRides}</div>
        </Card>

        <Card padding="md" style={{ textAlign: 'center' }}>
          <Star size={20} color={theme.colors.primary} style={{ margin: '0 auto 0.5rem' }} />
          <div style={statLabelStyles}>Rating</div>
          <div style={statValueStyles}>{stats.averageRating} ★</div>
        </Card>

        <Card padding="md" style={{ textAlign: 'center' }}>
          <DollarSign size={20} color={theme.colors.primary} style={{ margin: '0 auto 0.5rem' }} />
          <div style={statLabelStyles}>Venit</div>
          <div style={statValueStyles}>{stats.estimatedEarnings} lei</div>
        </Card>
      </div>

      {isOnline && (
        <div style={requestsContainerStyles}>
          <h2 style={sectionTitleStyles}>Cereri disponibile</h2>

          {requests.length === 0 ? (
            <div style={emptyStateStyles}>Nu sunt cereri disponibile în acest moment.</div>
          ) : (
            requests.map((request) => (
              <div key={request.id} style={requestCardStyles}>
                <div style={requestHeaderStyles}>
                  <div style={distanceStyles}>
                    <MapPin size={16} />
                    <span>{request.distanceToClient.toFixed(1)} km distanță</span>
                  </div>
                  <Badge variant="success">{request.status}</Badge>
                </div>

                <div style={earningsStyles}>
                  ~{request.estimatedEarnings} lei
                </div>

                <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginBottom: theme.spacing.md, marginTop: theme.spacing.md }}>
                  Cursă standard - Șoferul vine cu mașina sa
                </p>

                <div style={{ display: 'flex', gap: theme.spacing.md }}>
                  <Button
                    onClick={() => {
                      setRequests(requests.filter((r) => r.id !== request.id));
                    }}
                    variant="ghost"
                    size="md"
                    fullWidth
                  >
                    Respinge
                  </Button>
                  <Button
                    onClick={() => handleAccept(request.id)}
                    variant="primary"
                    size="md"
                    fullWidth
                  >
                    Acceptă
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isOnline && (
        <Card padding="lg" style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
          <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.md }}>
            Ești offline. Conectează-te pentru a primi cereri de curse.
          </p>
        </Card>
      )}
    </div>
  );
};
