import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import {
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  Languages,
  LogOut,
  MapPin,
  Shield,
  Star,
  Bell,
  FileText,
  User,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { useLanguage } from '../context/LanguageContext';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerCardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    textAlign: 'center',
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
  };
  
  const avatarStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    color: theme.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    margin: '0 auto',
    marginBottom: theme.spacing.lg,
  };

  const userNameStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  };

  const userEmailStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  };

  const statsContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  };

  const statItemStyles: React.CSSProperties = {
    textAlign: 'center',
  };

  const statValueStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
  };

  const statLabelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  };

  const sectionStyles: React.CSSProperties = {
    padding: `0 ${theme.spacing.xl}`,
    marginTop: theme.spacing.lg,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.md,
  };

  const rowStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing.md} 0`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    cursor: 'pointer',
  };

  const rowIconStyles: React.CSSProperties = {
    marginRight: theme.spacing.lg,
    color: theme.colors.primary,
  };

  const rowLabelStyles: React.CSSProperties = {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
  };

  const logoutButtonStyles: React.CSSProperties = {
    backgroundColor: theme.colors.error,
    color: theme.colors.text.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    textAlign: 'center',
    cursor: 'pointer',
    margin: theme.spacing.xl,
    fontWeight: theme.typography.fontWeight.bold,
  };

  return (
    <div style={containerStyles}>
      <Header title={t('profile')} />

      <div style={{ ...headerCardStyles, paddingTop: theme.spacing.lg }}>
        <div style={avatarStyles}>{getInitials(user.fullName)}</div>
        <div style={userNameStyles}>{user.fullName}</div>
        <div style={userEmailStyles}>{user.email}</div>
      </div>

      <div style={statsContainerStyles}>
        <div style={statItemStyles}>
          <div style={statValueStyles}>0</div>
          <div style={statLabelStyles}>{t('totalRides')}</div>
        </div>
        <div style={statItemStyles}>
          <div style={statValueStyles}>5.0</div>
          <div style={statLabelStyles}>{t('rating')}</div>
        </div>
        <div style={statItemStyles}>
          <div style={statValueStyles}>$0</div>
          <div style={statLabelStyles}>{t('totalSpent')}</div>
        </div>
      </div>

      <div style={sectionStyles}>
        <h2 style={sectionTitleStyles}>{t('account')}</h2>
        <div style={rowStyles} onClick={() => navigate('/payment-methods')}>
          <CreditCard size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('paymentMethods')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
        <div style={rowStyles} onClick={() => navigate('/saved-locations')}>
          <MapPin size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('savedLocations')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
        <div style={rowStyles} onClick={() => navigate('/emergency-contacts')}>
          <Heart size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('emergencyContacts')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
      </div>

      <div style={sectionStyles}>
        <h2 style={sectionTitleStyles}>{t('settings')}</h2>
        <div style={rowStyles} onClick={() => navigate('/notifications')}>
          <Bell size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('notifications')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
        <div style={rowStyles} onClick={() => navigate('/language')}>
          <Languages size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('language')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
      </div>

      <div style={sectionStyles}>
        <h2 style={sectionTitleStyles}>{t('support')}</h2>
        <div style={rowStyles} onClick={() => navigate('/help-center')}>
          <HelpCircle size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('helpCenter')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
        <div style={rowStyles} onClick={() => navigate('/privacy-policy')}>
          <Shield size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('privacyPolicy')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
        <div style={rowStyles} onClick={() => navigate('/terms-and-conditions')}>
          <FileText size={20} style={rowIconStyles} />
          <div style={rowLabelStyles}>{t('termsAndConditions')}</div>
          <ChevronRight size={20} color={theme.colors.text.secondary} />
        </div>
      </div>

      <div style={logoutButtonStyles} onClick={handleLogout}>
        <LogOut size={20} style={{ marginRight: theme.spacing.sm, verticalAlign: 'middle' }} />
        {t('logout')}
      </div>
    </div>
  );
};