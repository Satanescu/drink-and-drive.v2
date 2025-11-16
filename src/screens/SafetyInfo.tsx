import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card } from '../components';
import { ArrowLeft, Shield, MapPin, PhoneCall, AlertTriangle } from 'lucide-react';

export const SafetyInfo: React.FC = () => {
  const navigate = useNavigate();

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    flex: 1,
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

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  };

  const cardContentStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    alignItems: 'flex-start',
  };

  const iconStyles: React.CSSProperties = {
    color: theme.colors.primary,
    flexShrink: 0,
    marginTop: theme.spacing.sm,
  };

  const textStyles: React.CSSProperties = {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.relaxed,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button style={backButtonStyles} onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={titleStyles}>Informații de Siguranță</h1>
      </div>

      <h2 style={sectionTitleStyles}>Bun venit la Drink&Drive</h2>

      <Card padding="lg" style={{ marginBottom: theme.spacing.lg }}>
        <div style={cardContentStyles}>
          <AlertTriangle size={24} style={iconStyles} />
          <p style={textStyles}>
            Nu te urca la volan după ce ai băut. Drink&Drive îți oferă soluții sigure de transport
            pentru cazurile în care ai consumat alcool.
          </p>
        </div>
      </Card>

      <h2 style={sectionTitleStyles}>Serviciile noastre</h2>

      <Card padding="lg" style={{ marginBottom: theme.spacing.lg }}>
        <div style={cardContentStyles}>
          <MapPin size={24} style={iconStyles} />
          <div>
            <h3 style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginBottom: theme.spacing.sm }}>
              Cursă Standard
            </h3>
            <p style={textStyles}>
              Un șofer Drink&Drive vine la tine și te duce la destinație cu mașina lor. Simplu, sigur și rapid.
            </p>
          </div>
        </div>
      </Card>

      <Card padding="lg" style={{ marginBottom: theme.spacing.lg }}>
        <div style={cardContentStyles}>
          <MapPin size={24} style={iconStyles} />
          <div>
            <h3 style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginBottom: theme.spacing.sm }}>
              Șoferul pentru Mașina ta
            </h3>
            <p style={textStyles}>
              Un șofer Drink&Drive vine și conduce mașina ta, iar tu îl urmezi în mașina sa. Tu și mașina voastră ajungeți
              în siguranță acasă.
            </p>
          </div>
        </div>
      </Card>

      <h2 style={sectionTitleStyles}>Caracteristici de Siguranță</h2>

      <Card padding="lg" style={{ marginBottom: theme.spacing.lg }}>
        <div style={cardContentStyles}>
          <Shield size={24} style={iconStyles} />
          <div>
            <h3 style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginBottom: theme.spacing.sm }}>
              Șoferi Verificați
            </h3>
            <p style={textStyles}>Toți șoferii Drink&Drive sunt verificați și instruiți pentru transport sigur.</p>
          </div>
        </div>
      </Card>

      <Card padding="lg" style={{ marginBottom: theme.spacing.lg }}>
        <div style={cardContentStyles}>
          <MapPin size={24} style={iconStyles} />
          <div>
            <h3 style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginBottom: theme.spacing.sm }}>
              Traseu în Timp Real
            </h3>
            <p style={textStyles}>Poți vedea unde se află șoferul și traseul în timp real pe hartă.</p>
          </div>
        </div>
      </Card>

      <Card padding="lg" style={{ marginBottom: theme.spacing.lg }}>
        <div style={cardContentStyles}>
          <PhoneCall size={24} style={iconStyles} />
          <div>
            <h3 style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginBottom: theme.spacing.sm }}>
              Contacte de Urgență
            </h3>
            <p style={textStyles}>
              Salvează contacte de urgență și anunță-i imediat dacă ceva nu merge bine.
            </p>
          </div>
        </div>
      </Card>

      <h2 style={sectionTitleStyles}>Butoane de Urgență</h2>

      <Card padding="lg">
        <div style={cardContentStyles}>
          <AlertTriangle size={24} style={iconStyles} />
          <div>
            <h3 style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginBottom: theme.spacing.sm }}>
              Butonul SOS
            </h3>
            <p style={textStyles}>
              Fiecare cursă activă are un buton SOS. Apasă-l dacă te simți în pericol și vom contacta autorităţile.
            </p>
          </div>
        </div>
      </Card>

      <Button
        onClick={() => navigate('/home')}
        variant="primary"
        size="lg"
        fullWidth
        style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.xl }}
      >
        Înapoi la Acasă
      </Button>
    </div>
  );
};
