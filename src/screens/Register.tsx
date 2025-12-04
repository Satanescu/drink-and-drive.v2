import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { theme } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'client' | 'driver'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user, token } = await authAPI.register({
        fullName: fullName,
        email: email,
        phone: phone,
        password: password,
        role: role,
      });

      // Success! Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Full registration error object:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.text.primary,
  };

  const formStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  };

  const errorStyles: React.CSSProperties = {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  };

  const roleSelectionStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  };

  return (
    <div style={containerStyles}>
      <form onSubmit={handleRegister} style={formStyles}>
        <h1 style={titleStyles}>Register</h1>
        {error && <p style={errorStyles}>{error}</p>}
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={setFullName}
          icon={<User size={20} color={theme.colors.text.secondary} />}
          className="mb-4"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
          icon={<Mail size={20} color={theme.colors.text.secondary} />}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          icon={<Lock size={20} color={theme.colors.text.secondary} />}
          className="mb-4"
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={setPhone}
          icon={<Phone size={20} color={theme.colors.text.secondary} />}
          className="mb-6"
        />
        <div style={roleSelectionStyles}>
          <label>
            <input
              type="radio"
              value="client"
              checked={role === 'client'}
              onChange={() => setRole('client')}
            />
            Passenger
          </label>
          <label>
            <input
              type="radio"
              value="driver"
              checked={role === 'driver'}
              onChange={() => setRole('driver')}
            />
            Driver
          </label>
        </div>
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          onClick={() => navigate('/login')}
          style={{ marginTop: theme.spacing.md }}
        >
          Already have an account? Login
        </Button>
      </form>
    </div>
  );
};