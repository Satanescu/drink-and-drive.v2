import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Input } from '../components';
import { authAPI } from '../api';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('Introdu adresa de email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email-ul nu este valid');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la trimitere');
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

  const backButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    marginBottom: theme.spacing.xl,
    fontSize: theme.typography.fontSize.base,
  };

  const headerStyles: React.CSSProperties = {
    marginBottom: theme.spacing['2xl'],
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  };

  const errorStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.error}20`,
    color: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.fontSize.sm,
  };

  const successStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.success}20`,
    color: theme.colors.success,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
  };

  if (success) {
    return (
      <div style={containerStyles}>
        <div style={backButtonStyles} onClick={() => navigate('/login')}>
          <ArrowLeft size={20} />
          Înapoi la autentificare
        </div>

        <div style={successStyles}>
          <h3 style={{ marginBottom: theme.spacing.md, fontSize: theme.typography.fontSize.lg }}>
            Email trimis cu succes!
          </h3>
          <p>
            Am trimis instrucțiuni de resetare a parolei pe adresa <strong>{email}</strong>.
            Verifică inbox-ul și urmează pașii din email.
          </p>
        </div>

        <Button onClick={() => navigate('/login')} variant="primary" size="lg" fullWidth>
          Înapoi la autentificare
        </Button>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={backButtonStyles} onClick={() => navigate('/login')}>
        <ArrowLeft size={20} />
        Înapoi
      </div>

      <div style={headerStyles}>
        <h1 style={titleStyles}>Resetează parola</h1>
        <p style={subtitleStyles}>
          Introdu adresa ta de email și îți vom trimite instrucțiuni pentru resetarea parolei.
        </p>
      </div>

      {error && <div style={errorStyles}>{error}</div>}

      <Input
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="exemplu@email.com"
        label="Email"
        icon={<Mail size={20} />}
      />

      <div style={{ marginTop: theme.spacing.xl }}>
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Se trimite...' : 'Trimite instrucțiuni'}
        </Button>
      </div>
    </div>
  );
};
