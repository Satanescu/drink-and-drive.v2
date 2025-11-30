import React from 'react';
import { theme } from '../theme';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background, padding: theme.spacing.xl }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: theme.spacing.xl }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: theme.colors.text.primary, marginRight: theme.spacing.lg }}>
          <ArrowLeft />
        </button>
        <h1 style={{ fontSize: theme.typography.fontSize['2xl'], fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary }}>
          {t('termsAndConditions')}
        </h1>
      </div>
      <p style={{ color: theme.colors.text.secondary }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  );
};