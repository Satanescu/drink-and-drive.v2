import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
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

  // Helper: Tries to fetch profile 3 times before giving up
  const fetchProfileWithRetry = async (userId: string, retries = 3, delay = 500) => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to avoid errors on empty results

      if (data) {
        return data; // Found it!
      }

      // If error (other than not found), log it
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      // Wait before trying again
      console.log(`Profile not found yet. Retrying in ${delay}ms... (${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return null; // Gave up
  };

  useEffect(() => {
    // 1. INITIAL SESSION CHECK
    const initSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          console.log("Found session, looking for profile...");
          const profile = await fetchProfileWithRetry(session.user.id);

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: profile.full_name || 'No Name',
              role: profile.role,
            });
          } else {
            console.warn("Profile missing after retries. Clearing session.");
            await supabase.auth.signOut();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Session init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // 2. AUTH STATE LISTENER
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth event: ${event}`);
      
      if (session) {
        // If we already have the user loaded, don't re-fetch
        setUser((currentUser) => {
          if (currentUser?.id === session.user.id) return currentUser;
          
          // Otherwise, fetch profile (async inside setter is tricky, so we do it outside)
          return currentUser; 
        });

        // Perform the fetch
        const profile = await fetchProfileWithRetry(session.user.id);
        
        if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: profile.full_name || 'No Name',
              role: profile.role,
            });
        } else {
             // Only sign out if we really can't find the profile after 1.5 seconds
             // and we are ensuring it's not a false negative
             console.warn("User signed up, but profile creation is lagging or failed.");
             // Optional: Don't sign out immediately, let them see a "Setup incomplete" screen?
             // For now, keep your logic but with the retry safety:
             await supabase.auth.signOut();
             setUser(null);
        }

      } else {
        setUser(null);
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
