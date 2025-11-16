import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Car } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('ion@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completează toate câmpurile');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la autentificare');
    } finally {
      setLoading(false);
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
    marginTop: theme.spacing['2xl'],
  };

  const logoContainerStyles: React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: theme.colors.primary,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  };

  const formStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const errorStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.error}20`,
    color: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.fontSize.sm,
  };

  const linkStyles: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    cursor: 'pointer',
    marginTop: theme.spacing.md,
  };

  const dividerStyles: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
    margin: `${theme.spacing.xl} 0`,
    position: 'relative',
  };

  const dividerLineStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: theme.colors.border.light,
  };

  const dividerTextStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    backgroundColor: theme.colors.background,
    padding: `0 ${theme.spacing.md}`,
  };

  const registerTextStyles: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xl,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <div style={logoContainerStyles}>
          <Car size={40} color={theme.colors.text.primary} />
        </div>
        <h1 style={titleStyles}>Drink&Drive</h1>
        <p style={subtitleStyles}>Nu conduce sub influența alcoolului</p>
      </div>

      <div style={formStyles}>
        {error && <div style={errorStyles}>{error}</div>}

        <Input
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="exemplu@email.com"
          label="Email"
          icon={<Mail size={20} />}
        />

        <Input
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Parola ta"
          label="Parolă"
          icon={<Lock size={20} />}
        />

        <div style={linkStyles} onClick={() => navigate('/forgot-password')}>
          Ți-ai uitat parola?
        </div>

        <div style={{ marginTop: 'auto' }}>
          <Button
            onClick={handleLogin}
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Se încarcă...' : 'Autentificare'}
          </Button>

          <div style={dividerStyles}>
            <div style={dividerLineStyles} />
            <span style={dividerTextStyles}>sau</span>
          </div>

          <Button variant="secondary" size="lg" fullWidth disabled>
            Continuă cu Google
          </Button>

          <div style={registerTextStyles}>
            Nu ai cont?{' '}
            <span
              style={{ color: theme.colors.primary, cursor: 'pointer' }}
              onClick={() => navigate('/register')}
            >
              Creează cont
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
