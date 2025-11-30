import React from 'react';
import { theme } from '../theme';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { useLanguage } from '../context/LanguageContext';

export const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  const faqItemStyles: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
  };

  const questionStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
  };

  const answerStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button onClick={() => navigate('/profile')} style={backButtonStyles}>
          <ArrowLeft />
        </button>
        <h1 style={titleStyles}>{t('helpCenter')}</h1>
      </div>

      <div style={faqItemStyles}>
        <h2 style={questionStyles}>Cum funcționează?</h2>
        <p style={answerStyles}>
          Drink&Drive este un serviciu care vă permite să comandați un șofer care să vă conducă mașina acasă în siguranță.
        </p>
      </div>

      <div style={faqItemStyles}>
        <h2 style={questionStyles}>Cum plătesc?</h2>
        <p style={answerStyles}>
          Puteți plăti cu cardul direct în aplicație sau numerar la șofer.
        </p>
      </div>

      <div style={faqItemStyles}>
        <h2 style={questionStyles}>Este sigur?</h2>
        <p style={answerStyles}>
          Toți șoferii noștri sunt verificați și instruiți pentru a vă oferi o călătorie sigură și confortabilă.
        </p>
      </div>

      <a href="mailto:support@drinkanddrive.com">
        <Button variant="primary" fullWidth style={{ marginTop: theme.spacing.xl }}>
          Contactează Suportul
        </Button>
      </a>
    </div>
  );
};
