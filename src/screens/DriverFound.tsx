import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card, Modal } from '../components';
import { ridesAPI } from '../api';
import { User, Star } from 'lucide-react';
import { Ride, Driver } from '../types';

interface DriverFoundState {
  ride: Ride;
  driver: Driver;
}

export const DriverFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DriverFoundState;

  const ride = state?.ride;
  const driver = state?.driver;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!ride || !driver) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: theme.colors.text.primary }}>Eroare</div>;
  }

  const handleCancel = async () => {
    if (cancelReason) {
      await ridesAPI.cancelRide(ride.id, cancelReason);
      navigate('/home');
    }
  };

  const handleStartRide = () => {
    navigate('/ride/active', { state: { ride, driver } });
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const successMessageStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.md,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  };

  const driverCardStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  };

  const driverInfoStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  };

  const avatarStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const detailsStyles: React.CSSProperties = {
    flex: 1,
  };

  const nameStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  const ratingStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  };

  const etaStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  };

  const etaTimeStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  };

  const etaLabelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  };

  const buttonContainerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  return (
    <div style={containerStyles}>
      <div style={successMessageStyles}>
        <h1 style={titleStyles}>Am găsit un șofer!</h1>
        <p style={subtitleStyles}>Lucrurile se miș acum. Iată detaliile.</p>
      </div>

      <div style={driverCardStyles}>
        <div style={driverInfoStyles}>
          <div style={avatarStyles}>
            <User size={40} color={theme.colors.text.primary} />
          </div>
          <div style={detailsStyles}>
            <div style={nameStyles}>{driver.fullName}</div>
            <div style={ratingStyles}>
              <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
              <span>{driver.averageRating} ★ ({driver.totalRides} curse)</span>
            </div>
          </div>
        </div>

        <Card padding="md" style={{ marginBottom: theme.spacing.lg, backgroundColor: theme.colors.surfaceLight }}>
          {ride.serviceType === 'own-car' ? (
            <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              Șoferul va conduce mașina ta acasă
            </p>
          ) : (
            <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              Cursa standard - Șoferul vine cu mașina sa
            </p>
          )}
        </Card>

        <div style={etaStyles}>
          <div style={etaTimeStyles}>~5 min</div>
          <div style={etaLabelStyles}>Timp estimat sosire</div>
        </div>
      </div>

      <div style={buttonContainerStyles}>
        <Button onClick={handleStartRide} variant="primary" size="lg" fullWidth>
          Continuă
        </Button>

        <Button
          onClick={() => setShowCancelModal(true)}
          variant="ghost"
          size="md"
          fullWidth
        >
          Anulează cursa
        </Button>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Anulează cursa"
      >
        <p style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.text.secondary, marginBottom: theme.spacing.lg }}>
          De ce vrei să anulezi cursa?
        </p>

        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Introdu motivul..."
          style={{
            width: '100%',
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border.light}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.primary,
            minHeight: '100px',
            marginBottom: theme.spacing.lg,
          }}
        />

        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <Button
            onClick={() => setShowCancelModal(false)}
            variant="ghost"
            size="md"
            fullWidth
          >
            Înapoi
          </Button>
          <Button
            onClick={handleCancel}
            variant="danger"
            size="md"
            fullWidth
            disabled={!cancelReason}
          >
            Confirmă anulare
          </Button>
        </div>
      </Modal>
    </div>
  );
};
