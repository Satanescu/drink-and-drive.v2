import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { theme } from '../theme';
import { Button } from './Button';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border.light}`,
  };

  const titleStyles: React.CSSProperties = {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginRight: '44px', // To balance the back button
  };

  return (
    <header style={headerStyles}>
      <Button onClick={() => navigate(-1)} variant="ghost" size="icon">
        <ArrowLeft />
      </Button>
      <h1 style={titleStyles}>{title}</h1>
    </header>
  );
};
