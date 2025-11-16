import React, { useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../api';
import { AuthContext } from './auth.hooks';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user } = await authAPI.login(email, password);
    setUser(user);
  };

  const register = async (data: { fullName: string; email: string; phone: string; password: string }) => {
    const { user, token, message } = await authAPI.register(data);
    if (token) {
      setUser(user);
    }
    return message;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = await authAPI.updateUser(user.id, updates);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};


