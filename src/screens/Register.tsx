import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../context/auth.hooks';
import { Mail, Lock, User, Phone } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const validateForm = () => {
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Completează toate câmpurile');
      return false;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă minim 6 caractere');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Parolele nu coincid');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email-ul nu este valid');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      const message = await register({ fullName, email, phone, password });
      if (message) {
        setConfirmationMessage(message);
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la înregistrare');
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
    overflowY: 'auto',
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
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
  };

  const errorStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.error}20`,
    color: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.fontSize.sm,
  };

  const confirmationStyles: React.CSSProperties = {
    backgroundColor: `${theme.colors.success}20`,
    color: theme.colors.success,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.fontSize.sm,
  };

  const loginTextStyles: React.CSSProperties = {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.lg,
  };

  if (confirmationMessage) {
    return (
      <div style={containerStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>Verifică email-ul</h1>
          <p style={subtitleStyles}>Am trimis un link de confirmare pe adresa ta.</p>
        </div>
        <div style={confirmationStyles}>{confirmationMessage}</div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Creează cont</h1>
        <p style={subtitleStyles}>Alătură-te comunității Drink&Drive</p>
      </div>

      {error && <div style={errorStyles}>{error}</div>}

      <Input
        type="text"
        value={fullName}
        onChange={setFullName}
        placeholder="Ion Popescu"
        label="Nume complet"
        icon={<User size={20} />}
      />

      <Input
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="exemplu@email.com"
        label="Email"
        icon={<Mail size={20} />}
      />

      <Input
        type="tel"
        value={phone}
        onChange={setPhone}
        placeholder="+40 721 234 567"
        label="Număr de telefon"
        icon={<Phone size={20} />}
      />

      <Input
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Minim 6 caractere"
        label="Parolă"
        icon={<Lock size={20} />}
      />

      <Input
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Confirmă parola"
        label="Confirmă parola"
        icon={<Lock size={20} />}
      />

      <div style={{ marginTop: theme.spacing.lg }}>
        <Button
          onClick={handleRegister}
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Se încarcă...' : 'Creează cont'}
        </Button>

        <div style={loginTextStyles}>
          Ai deja cont?{' '}
          <span
            style={{ color: theme.colors.primary, cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Autentifică-te
          </span>
        </div>
      </div>
    </div>
  );
};
