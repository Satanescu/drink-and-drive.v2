import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }
    } catch (err: any) {
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

  return (
    <div style={containerStyles}>
      <form onSubmit={handleLogin} style={formStyles}>
        <h1 style={titleStyles}>Login</h1>
        {error && <p style={errorStyles}>{error}</p>}
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
          className="mb-6"
        />
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          onClick={() => navigate('/forgot-password')}
          style={{ marginTop: theme.spacing.md }}
        >
          Forgot Password?
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          onClick={() => navigate('/register')}
          style={{ marginTop: theme.spacing.md }}
        >
          Don't have an account? Register
        </Button>
      </form>
    </div>
  );
};
