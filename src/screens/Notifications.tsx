import React, { useState } from 'react';
import { theme } from '../theme';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [rideStatus, setRideStatus] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [safetyAlerts, setSafetyAlerts] = useState(true);

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    color: theme.colors.text.primary,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  };

  const backButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  };

  const rowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing.md} 0`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
  };

  const toggleStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '28px',
  };

  const toggleInputStyles: React.CSSProperties = {
    opacity: 0,
    width: 0,
    height: 0,
  };

  const sliderStyles = (checked: boolean): React.CSSProperties => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: checked ? theme.colors.primary : theme.colors.surface,
    transition: '.4s',
    borderRadius: '34px',
  });

  const sliderBeforeStyles = (checked: boolean): React.CSSProperties => ({
    position: 'absolute',
    content: '""',
    height: '20px',
    width: '20px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%',
    transform: checked ? 'translateX(22px)' : 'translateX(0)',
  });

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button onClick={() => navigate('/profile')} style={backButtonStyles}>
          <ArrowLeft />
        </button>
        <h1 style={titleStyles}>{t('notifications')}</h1>
      </div>

      <div style={rowStyles}>
        <div style={labelStyles}>Ride status updates</div>
        <label style={toggleStyles}>
          <input type="checkbox" checked={rideStatus} onChange={() => setRideStatus(!rideStatus)} style={toggleInputStyles} />
          <span style={sliderStyles(rideStatus)}>
            <span style={sliderBeforeStyles(rideStatus)}></span>
          </span>
        </label>
      </div>
      <div style={rowStyles}>
        <div style={labelStyles}>Promotions & offers</div>
        <label style={toggleStyles}>
          <input type="checkbox" checked={promotions} onChange={() => setPromotions(!promotions)} style={toggleInputStyles} />
          <span style={sliderStyles(promotions)}>
            <span style={sliderBeforeStyles(promotions)}></span>
          </span>
        </label>
      </div>
      <div style={rowStyles}>
        <div style={labelStyles}>Safety alerts</div>
        <label style={toggleStyles}>
          <input type="checkbox" checked={safetyAlerts} onChange={() => setSafetyAlerts(!safetyAlerts)} style={toggleInputStyles} />
          <span style={sliderStyles(safetyAlerts)}>
            <span style={sliderBeforeStyles(safetyAlerts)}></span>
          </span>
        </label>
      </div>
    </div>
  );
};
