import React from 'react';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  padding = 'md',
  className = '',
  style = {},
}) => {
  const paddingMap = {
    sm: theme.spacing.md,
    md: theme.spacing.lg,
    lg: theme.spacing.xl,
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: paddingMap[padding],
    cursor: onClick ? 'pointer' : 'default',
    transition: theme.transitions.fast,
    ...style,
  };

  return (
    <div onClick={onClick} className={className} style={cardStyles}>
      {children}
    </div>
  );
};
