import React from 'react';
import { theme } from '../theme';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  icon,
  disabled = false,
  fullWidth = true,
  className = '',
}) => {
  const containerStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    marginBottom: theme.spacing.md,
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const inputWrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    border: `1px solid ${error ? theme.colors.error : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.md} ${icon ? theme.spacing.xl : theme.spacing.md}`,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
    outline: 'none',
    transition: theme.transitions.fast,
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    color: theme.colors.text.tertiary,
  };

  const errorStyles: React.CSSProperties = {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.primary,
  };

  return (
    <div style={containerStyles} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={inputWrapperStyles}>
        {icon && <span style={iconStyles}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            ...inputStyles,
            paddingLeft: icon ? '3rem' : theme.spacing.md,
          }}
        />
      </div>
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  );
};
