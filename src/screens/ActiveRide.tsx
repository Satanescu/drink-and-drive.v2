import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button, BottomSheet, Modal } from '../components';
import AppMap from '../components/MapConfig';
import { ridesAPI } from '../api';
import { MessageCircle, Phone, AlertTriangle, Share2, User } from 'lucide-react';
import { Ride, Driver } from '../types';

interface ActiveRideState {
  ride: Ride;
  driver: Driver;
}

export const ActiveRide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ActiveRideState;

  const ride = state?.ride;
  const driver = state?.driver;

  const [showOptions, setShowOptions] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  if (!ride || !driver) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: theme.colors.text.primary }}>Eroare</div>;
  }

  const handleFinish = async () => {
    await ridesAPI.updateRideStatus(ride.id, 'completed');
    navigate('/ride/summary', { state: { ride, driver } });
  };

  const handleSOS = (type: 'call' | 'contact') => {
    if (type === 'call') {
      window.location.href = 'tel:112';
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.lg,
    textAlign: 'center',
  };

  const statusStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.success,
  };

  const mapContainerStyles: React.CSSProperties = {
    flex: 1,
  };

  const sosButtonStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '120px',
    right: theme.spacing.lg,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: theme.colors.error,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.text.primary,
    boxShadow: theme.shadows.lg,
    zIndex: 100,
  };

  const bottomSheetContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const driverInfoStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border.light}`,
  };

  const avatarStyles: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const quickMessageStyles = (selected: boolean): React.CSSProperties => ({
    padding: theme.spacing.md,
    backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
    border: `1px solid ${selected ? theme.colors.primary : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    color: selected ? theme.colors.text.primary : theme.colors.text.secondary,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
  });

  const buttonGroupStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTop: `1px solid ${theme.colors.border.light}`,
  };

  const sosModalContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
  };

  const sosOptionStyles: React.CSSProperties = {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    textAlign: 'center',
    border: `1px solid ${theme.colors.border.light}`,
  };

  const sosOptionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  };

  const sosOptionDescStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={statusStyles}>Cursă în derulare</div>
      </div>

      <div style={mapContainerStyles}>
        <AppMap />
      </div>

      <button style={sosButtonStyles} onClick={() => setShowSOSModal(true)}>
        <AlertTriangle size={24} />
      </button>

      <div style={buttonGroupStyles}>
        <Button
          onClick={() => setShowOptions(true)}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Opțiuni
        </Button>
        <Button
          onClick={handleFinish}
          variant="primary"
          size="lg"
          fullWidth
        >
          Finalizează
        </Button>
      </div>

      <BottomSheet isOpen={showOptions} onClose={() => setShowOptions(false)} height="half">
        <div style={bottomSheetContentStyles}>
          <div style={driverInfoStyles}>
            <div style={avatarStyles}>
              <User size={30} color={theme.colors.text.primary} />
            </div>
            <div>
              <div style={{ fontSize: theme.typography.fontSize.base, fontWeight: 'bold', color: theme.colors.text.primary }}>
                {driver.fullName}
              </div>
              <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                {driver.averageRating} ★
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: theme.spacing.md,
              paddingBottom: theme.spacing.lg,
              borderBottom: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <Button
              onClick={() => window.location.href = `tel:${driver.phone}`}
              variant="secondary"
              size="md"
              fullWidth
              icon={<Phone size={18} />}
            >
              Sună
            </Button>
            <Button
              onClick={() => setShowMessages(true)}
              variant="secondary"
              size="md"
              fullWidth
              icon={<MessageCircle size={18} />}
            >
              Mesaj
            </Button>
          </div>

          <Button
            onClick={() => {
              setShowOptions(false);
              window.location.href = `https://maps.google.com/?q=${driver.currentLocation.lat},${driver.currentLocation.lng}`;
            }}
            variant="ghost"
            size="md"
            fullWidth
            icon={<Share2 size={18} />}
          >
            Partajează locația
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showMessages} onClose={() => setShowMessages(false)} title="Mesaje rapide">
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
          <div style={quickMessageStyles(false)} onClick={() => alert('Mesaj trimis')}>
            Sunt în fața localului
          </div>
          <div style={quickMessageStyles(false)} onClick={() => alert('Mesaj trimis')}>
            Întârzii 2-3 minute
          </div>
          <div style={quickMessageStyles(false)} onClick={() => alert('Mesaj trimis')}>
            Te rog să claxonezi când ajungi
          </div>
        </div>
      </BottomSheet>

      <Modal isOpen={showSOSModal} onClose={() => setShowSOSModal(false)} title="SOS - Urgență">
        <div style={sosModalContentStyles}>
          <div
            style={sosOptionStyles}
            onClick={() => handleSOS('call')}
          >
            <div style={sosOptionTitleStyles}>Sună 112</div>
            <div style={sosOptionDescStyles}>Apelează autoritățile locale</div>
          </div>

          <div style={sosOptionStyles} onClick={() => alert('Contactul de urgență a fost anunțat')}>
            <div style={sosOptionTitleStyles}>Anunță contact de urgență</div>
            <div style={sosOptionDescStyles}>Te veți fi anunțat pe contact salvat</div>
          </div>

          <Button
            onClick={() => setShowSOSModal(false)}
            variant="ghost"
            size="md"
            fullWidth
          >
            Anulează
          </Button>
        </div>
      </Modal>
    </div>
  );
};
