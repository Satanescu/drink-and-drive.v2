import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card, Map } from '../components';
import { useAuth } from '../context/auth.hooks';
import { ridesAPI } from '../api';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';
import { Location as LocationType, ServiceType } from '../types';

interface RideDetailsState {
  destination: string;
  serviceType: ServiceType;
  pickup: LocationType;
}

export const RideDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as RideDetailsState;

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);

  const destination = state?.destination || '';
  const serviceType = state?.serviceType || 'standard';
  const pickup = state?.pickup as LocationType;

  if (!user || !pickup) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: theme.colors.text.primary }}>Eroare</div>;
  }

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const ride = await ridesAPI.createRide({
        clientId: user.id,
        serviceType: serviceType as ServiceType,
        pickup,
        destination: { lat: 44.4368, lng: 26.0925, address: destination },
        paymentMethod: paymentMethod as 'cash' | 'card' | 'online',
        promoCode,
      });

      navigate('/ride/searching', { state: { rideId: ride.id } });
    } catch (error) {
      console.error('Error creating ride:', error);
    } finally {
      setLoading(false);
    }
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
    marginBottom: theme.spacing.xl,
  };

  const backButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    padding: 0,
    marginRight: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  };

  const mapContainerStyles: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
  };

  const routeDetailStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  };

  const locationDetailStyles: React.CSSProperties = {
    flex: 1,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  };

  const addressStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  };

  const estInfoStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };



  const paymentOptionsStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const paymentOptionStyles = (active: boolean): React.CSSProperties => ({
    padding: theme.spacing.md,
    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
    border: `2px solid ${active ? theme.colors.primary : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    textAlign: 'center',
    color: active ? theme.colors.text.primary : theme.colors.text.secondary,
    transition: theme.transitions.fast,
  });

  const safetyNoticeStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.success}20`,
    border: `1px solid ${theme.colors.success}40`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button style={backButtonStyles} onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={titleStyles}>Detalii Cursă</h1>
      </div>

      <div style={mapContainerStyles}>
        <Map height="250px" />
      </div>

      <h2 style={sectionTitleStyles}>Ruta</h2>

      <Card padding="md" style={{ marginBottom: theme.spacing.lg }}>
        <div style={routeDetailStyles}>
          <div style={locationDetailStyles}>
            <div style={labelStyles}>PLECARE</div>
            <div style={addressStyles}>{pickup.address || 'Locația curentă'}</div>
          </div>
        </div>
        <div style={{ ...routeDetailStyles, marginTop: theme.spacing.md }}>
          <div style={locationDetailStyles}>
            <div style={labelStyles}>DESTINAȚIE</div>
            <div style={addressStyles}>{destination}</div>
          </div>
        </div>
      </Card>

      <h2 style={sectionTitleStyles}>Estimări</h2>

      <div style={estInfoStyles}>
        <Card padding="md" style={{ textAlign: 'center' }}>
          <Clock size={20} color={theme.colors.primary} style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
            Durată
          </div>
          <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', color: theme.colors.text.primary, marginTop: theme.spacing.sm }}>
            ~15 min
          </div>
        </Card>

        <Card padding="md" style={{ textAlign: 'center' }}>
          <DollarSign size={20} color={theme.colors.primary} style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
            Estimare
          </div>
          <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', color: theme.colors.text.primary, marginTop: theme.spacing.sm }}>
            35-45 lei
          </div>
        </Card>
      </div>

      <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary, marginBottom: theme.spacing.lg }}>
        Prețul final poate varia în funcție de trafic și condiții pe drum.
      </p>

      <h2 style={sectionTitleStyles}>Modalitate de Plată</h2>

      <div style={paymentOptionsStyles}>
        <div
          style={paymentOptionStyles(paymentMethod === 'cash')}
          onClick={() => setPaymentMethod('cash')}
        >
          Numerar
        </div>
        <div
          style={paymentOptionStyles(paymentMethod === 'card')}
          onClick={() => setPaymentMethod('card')}
        >
          Card
        </div>
      </div>

      <h2 style={sectionTitleStyles}>Cod Promoțional</h2>

      <input
        type="text"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        placeholder="INTRODU CODUL"
        style={{
          width: '100%',
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border.light}`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.primary,
          marginBottom: theme.spacing.lg,
        }}
      />

      <div style={safetyNoticeStyles}>
        Șoferii Drink&Drive sunt instruiți pentru transport în siguranță după consum de alcool.
      </div>

      <div style={{ display: 'flex', gap: theme.spacing.md }}>
        <Button
          onClick={() => navigate('/home')}
          variant="ghost"
          size="lg"
          fullWidth
        >
          Înapoi
        </Button>
        <Button
          onClick={handleConfirm}
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Se încarcă...' : 'Confirmă cursa'}
        </Button>
      </div>
    </div>
  );
};
