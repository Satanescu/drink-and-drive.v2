import React, { useEffect } from 'react';
import { theme } from '../theme';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const backdropStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
    zIndex: theme.zIndex.modalBackdrop,
  };

  const heightMap = {
    auto: 'auto',
    half: '50vh',
    full: '90vh',
  };

  const sheetStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    maxHeight: heightMap[height],
    overflow: 'auto',
    zIndex: theme.zIndex.modal,
    animation: 'slideUp 0.3s ease-out',
  };

  const handleStyles: React.CSSProperties = {
    width: '40px',
    height: '4px',
    backgroundColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.full,
    margin: `0 auto ${theme.spacing.lg}`,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.primary,
  };

  return (
    <>
      <div style={backdropStyles} onClick={onClose} />
      <div style={sheetStyles}>
        <div style={handleStyles} />
        {title && <h3 style={titleStyles}>{title}</h3>}
        {children}
      </div>
      <style>
        {`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}
      </style>
    </>
  );
};
