import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      console.log("Fetching initial session...");
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session);

        if (session) {
          console.log("User is logged in, fetching profile...");
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);

          if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }

          const profile = profiles && profiles[0];
          console.log("Initial profile:", profile);

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: profile.full_name || 'No Name',
              role: profile.role,
            });
          } else {
            console.warn("User is logged in but profile data is missing.");
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          console.log("No initial session found.");
          setUser(null);
        }
      } catch (error) {
        console.error("An error occurred fetching the session:", error);
        setUser(null);
      } finally {
        console.log("Finished fetching initial session, loading is false.");
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      try {
        if (session) {
          console.log("Auth change: User is logged in, fetching profile...");
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);

          if (error) {
            console.error('Error fetching profile on auth change:', error);
            throw error;
          }
          
          const profile = profiles && profiles[0];
          console.log("Auth change profile:", profile);

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: profile.full_name || 'No Name',
              role: profile.role,
            });
          } else {
            console.warn("Auth change: User is logged in but profile data is missing.");
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          console.log("Auth change: No session found.");
          setUser(null);
        }
      } catch (error) {
        console.error("An error occurred in onAuthStateChange:", error);
        setUser(null);
      } finally {
        console.log("Finished handling auth state change, loading is false.");
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};