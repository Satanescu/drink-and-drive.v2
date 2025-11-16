import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button } from '../components';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
    textAlign: 'center',
  };

  const codeStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  };

  const messageStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  };

  return (
    <div style={containerStyles}>
      <div style={codeStyles}>404</div>
      <h1 style={messageStyles}>Pagina nu a fost găsită</h1>
      <p style={descriptionStyles}>
        Din păcate, pagina pe care o cauți nu există.
      </p>
      <Button onClick={() => navigate('/home')} variant="primary" size="lg">
        Înapoi la Acasă
      </Button>
    </div>
  );
};
