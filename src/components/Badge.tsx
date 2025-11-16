import React from 'react';
import { theme } from '../theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variants = {
    default: {
      backgroundColor: theme.colors.surfaceLight,
      color: theme.colors.text.secondary,
    },
    success: {
      backgroundColor: `${theme.colors.success}20`,
      color: theme.colors.success,
    },
    warning: {
      backgroundColor: `${theme.colors.warning}20`,
      color: theme.colors.warning,
    },
    error: {
      backgroundColor: `${theme.colors.error}20`,
      color: theme.colors.error,
    },
    info: {
      backgroundColor: `${theme.colors.info}20`,
      color: theme.colors.info,
    },
  };

  const sizes = {
    sm: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: theme.typography.fontSize.xs,
    },
    md: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: theme.typography.fontSize.sm,
    },
  };

  const badgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
    ...variants[variant],
    ...sizes[size],
  };

  return <span style={badgeStyles}>{children}</span>;
};
