import React from 'react';
import { theme } from '../theme';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Language: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

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
    cursor: 'pointer',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button onClick={() => navigate('/profile')} style={backButtonStyles}>
          <ArrowLeft />
        </button>
        <h1 style={titleStyles}>{t('language')}</h1>
      </div>

      <div style={rowStyles} onClick={() => setLanguage('ro')}>
        <div style={labelStyles}>Română</div>
        {language === 'ro' && <Check color={theme.colors.primary} />}
      </div>
      <div style={rowStyles} onClick={() => setLanguage('en')}>
        <div style={labelStyles}>English</div>
        {language === 'en' && <Check color={theme.colors.primary} />}
      </div>
    </div>
  );
};
