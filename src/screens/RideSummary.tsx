import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card } from '../components';
import { Clock, MapPin, DollarSign, Star } from 'lucide-react';

export const RideSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;
  const ride = state?.ride;
  const driver = state?.driver;

  const [rating, setRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!ride) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: theme.colors.text.primary }}>Eroare</div>;
  }

  const handleContinue = () => {
    navigate('/ride/feedback', { state: { ride, driver, rating } });
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  };

  const detailsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  };

  const detailCardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    textAlign: 'center',
  };

  const detailLabelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  };

  const detailValueStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  };

  const routeCardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  };

  const ratingContainerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  };

  const ratingLabelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  };

  const starsContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const starButtonStyles = (filled: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '2rem',
    color: filled ? theme.colors.warning : theme.colors.border.medium,
  });

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>Cursa finalizată!</h1>

      <h2 style={{ fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>
        Detalii cursă
      </h2>

      <div style={detailsGridStyles}>
        <Card padding="md" style={{ textAlign: 'center' }}>
          <Clock size={20} color={theme.colors.primary} style={{ margin: '0 auto 0.5rem' }} />
          <div style={detailLabelStyles}>Durată</div>
          <div style={detailValueStyles}>15 min</div>
        </Card>

        <Card padding="md" style={{ textAlign: 'center' }}>
          <DollarSign size={20} color={theme.colors.primary} style={{ margin: '0 auto 0.5rem' }} />
          <div style={detailLabelStyles}>Cost final</div>
          <div style={detailValueStyles}>{ride.actualCost || 40} lei</div>
        </Card>
      </div>

      <h2 style={{ fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>
        Ruta
      </h2>

      <Card padding="lg" style={routeCardStyles}>
        <div style={{ marginBottom: theme.spacing.md }}>
          <div style={detailLabelStyles}>PLECARE</div>
          <div style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.text.primary }}>
            {ride.pickup.address}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${theme.colors.border.light}`, paddingTop: theme.spacing.md }}>
          <div style={detailLabelStyles}>DESTINAȚIE</div>
          <div style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.text.primary }}>
            {ride.destination.address}
          </div>
        </div>
      </Card>

      {driver && (
        <>
          <h2 style={{ fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>
            Rating șofer
          </h2>

          <div style={ratingContainerStyles}>
            <div style={ratingLabelStyles}>Cât de mulțumit ești?</div>
            <div style={starsContainerStyles}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  style={starButtonStyles(star <= rating)}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: theme.spacing.md }}>
        <Button
          onClick={() => navigate('/home')}
          variant="ghost"
          size="lg"
          fullWidth
        >
          Acasă
        </Button>
        <Button
          onClick={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
        >
          Oferă feedback
        </Button>
      </div>
    </div>
  );
};
