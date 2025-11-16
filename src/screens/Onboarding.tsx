import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button } from '../components';
import { Car, Shield, KeyRound, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: Car,
    title: 'Nu conduce după ce ai băut',
    description:
      'Drink&Drive îți aduce un șofer profesionist când ai nevoie. Ajungi acasă în siguranță, fără griji.',
  },
  {
    icon: Shield,
    title: 'Siguranța ta e prioritatea noastră',
    description:
      'Șoferi verificați, traseu vizibil în timp real, contacte de urgență. Toate pentru călătorii sigure.',
  },
  {
    icon: KeyRound,
    title: 'Îți ducem și mașina acasă',
    description:
      'Serviciu special: un șofer vine și conduce mașina ta acasă. Amândoi ajungeți în siguranță.',
  },
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: theme.spacing['2xl'],
  };

  const iconContainerStyles: React.CSSProperties = {
    width: '120px',
    height: '120px',
    backgroundColor: theme.colors.primary,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing.md,
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
    maxWidth: '400px',
  };

  const dotsContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  };

  const dotStyles = (active: boolean): React.CSSProperties => ({
    width: active ? '24px' : '8px',
    height: '8px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: active ? theme.colors.primary : theme.colors.border.medium,
    transition: theme.transitions.normal,
  });

  const buttonsContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    width: '100%',
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const skipStyles: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.sm,
    cursor: 'pointer',
    marginTop: theme.spacing.md,
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div style={containerStyles}>
      <div style={contentStyles}>
        <div style={iconContainerStyles}>
          <CurrentIcon size={60} color={theme.colors.text.primary} />
        </div>

        <div>
          <h1 style={titleStyles}>{slides[currentSlide].title}</h1>
          <p style={descriptionStyles}>{slides[currentSlide].description}</p>
        </div>
      </div>

      <div style={dotsContainerStyles}>
        {slides.map((_, index) => (
          <div key={index} style={dotStyles(index === currentSlide)} />
        ))}
      </div>

      <div style={buttonsContainerStyles}>
        <Button
          onClick={handleNext}
          variant="primary"
          size="lg"
          fullWidth
          icon={currentSlide === slides.length - 1 ? undefined : <ChevronRight size={20} />}
        >
          {currentSlide === slides.length - 1 ? 'Începe acum' : 'Continuă'}
        </Button>

        {currentSlide < slides.length - 1 && (
          <div style={skipStyles} onClick={() => navigate('/login')}>
            Omite introducerea
          </div>
        )}
      </div>
    </div>
  );
};
