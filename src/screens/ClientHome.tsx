import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Map } from '../components';
import { useAuth } from '../context/auth.hooks';
import { MapPin, Home, Briefcase, Clock, AlertCircle } from 'lucide-react';
import { ServiceType } from '../types';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [showDestinationInput, setShowDestinationInput] = useState(false);

  if (!user) {
    return null;
  }

  const firstName = user.fullName.split(' ')[0];

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    paddingBottom: '100px',
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  };

  const greetingStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  const reminderStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.warning}20`,
    border: `1px solid ${theme.colors.warning}40`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
    marginTop: theme.spacing.md,
  };

  const reminderTextStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  };

  const contentStyles: React.CSSProperties = {
    padding: theme.spacing.xl,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  };

  const mapContainerStyles: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const suggestionsContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    overflowX: 'auto',
    paddingBottom: theme.spacing.md,
  };

  const suggestionChipStyles = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
    color: active ? theme.colors.text.primary : theme.colors.text.secondary,
    borderRadius: theme.borderRadius.full,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: `1px solid ${active ? theme.colors.primary : theme.colors.border.light}`,
  });

  const serviceCardsContainerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  };

  const serviceCardStyles = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
    border: `2px solid ${active ? theme.colors.primary : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    textAlign: 'center',
  });

  const serviceCardTitleStyles = (active: boolean): React.CSSProperties => ({
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: active ? theme.colors.text.primary : theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  });

  const destinationInputStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    width: '100%',
    marginBottom: theme.spacing.lg,
  };

  const handleServiceSelect = (type: ServiceType) => {
    setServiceType(type);
  };

  const handleDestinationSelect = (addr: string) => {
    setDestination(addr);
    setShowDestinationInput(false);
  };

  const handleContinue = () => {
    if (!destination) {
      alert('Alege o destinație');
      return;
    }

    navigate('/ride/details', {
      state: {
        destination,
        serviceType,
        pickup: { lat: 44.4268, lng: 26.1025, address: 'Locația curentă' },
      },
    });
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={greetingStyles}>Bună, {firstName}!</div>

        <div style={reminderStyles}>
          <AlertCircle size={20} color={theme.colors.warning} />
          <p style={reminderTextStyles}>
            Nu conduce după ce ai consumat alcool. Alege o cursă sigură cu Drink&Drive.
          </p>
        </div>
      </div>

      <div style={contentStyles}>
        <h3 style={sectionTitleStyles}>Unde mergem?</h3>

        {showDestinationInput ? (
          <>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Introdu adresa de destinație"
              style={destinationInputStyles}
            />
            <Button
              onClick={() => setShowDestinationInput(false)}
              variant="secondary"
              size="md"
              fullWidth
            >
              Anulează
            </Button>
          </>
        ) : (
          <>
            <div style={suggestionsContainerStyles}>
              <div style={suggestionChipStyles(false)} onClick={() => handleDestinationSelect('Acasă')}>
                <Home size={16} />
                Acasă
              </div>
              <div style={suggestionChipStyles(false)} onClick={() => handleDestinationSelect('Serviciu')}>
                <Briefcase size={16} />
                Serviciu
              </div>
              <div style={suggestionChipStyles(false)} onClick={() => handleDestinationSelect('Custom')}>
                <Clock size={16} />
                Última destinație
              </div>
              <div
                style={suggestionChipStyles(false)}
                onClick={() => setShowDestinationInput(true)}
              >
                <MapPin size={16} />
                Altele
              </div>
            </div>

            {destination && (
              <div
                style={{
                  ...suggestionChipStyles(true),
                  display: 'flex',
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.lg,
                  cursor: 'default',
                }}
              >
                <MapPin size={16} />
                <span>{destination}</span>
              </div>
            )}
          </>
        )}

        <div style={mapContainerStyles}>
          <Map height="300px" />
        </div>

        <h3 style={sectionTitleStyles}>Tipul de serviciu</h3>

        <div style={serviceCardsContainerStyles}>
          <div
            style={serviceCardStyles(serviceType === 'standard')}
            onClick={() => handleServiceSelect('standard')}
          >
            <MapPin size={32} color={serviceType === 'standard' ? '#FFF' : theme.colors.primary} />
            <div style={serviceCardTitleStyles(serviceType === 'standard')}>Cursă standard</div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: serviceType === 'standard' ? theme.colors.text.primary : theme.colors.text.secondary,
                marginTop: theme.spacing.sm,
              }}
            >
              Șofer cu mașina
            </div>
          </div>

          <div
            style={serviceCardStyles(serviceType === 'own-car')}
            onClick={() => handleServiceSelect('own-car')}
          >
            <MapPin size={32} color={serviceType === 'own-car' ? '#FFF' : theme.colors.primary} />
            <div style={serviceCardTitleStyles(serviceType === 'own-car')}>Mașina mea</div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: serviceType === 'own-car' ? theme.colors.text.primary : theme.colors.text.secondary,
                marginTop: theme.spacing.sm,
              }}
            >
              Șoferul o duce
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
        >
          {destination ? 'Continuă către detalii cursă' : 'Alege destinația'}
        </Button>

        <Button
          onClick={() => navigate('/safety')}
          variant="ghost"
          size="md"
          fullWidth
          style={{ marginTop: theme.spacing.lg }}
        >
          Informații de siguranță
        </Button>
      </div>
    </div>
  );
};
