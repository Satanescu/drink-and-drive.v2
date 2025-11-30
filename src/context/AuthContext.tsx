import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { User, Vehicle } from '../types';

interface AuthContextType {
  user: User | null;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  loading: boolean;
  activeRole: 'client' | 'driver' | null;
  logout: () => void;
  setActiveVehicle: (vehicle: Vehicle | null) => void;
  switchActiveRole: (role: 'client' | 'driver') => void;
  addVehicle: (vehicle: Vehicle) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [activeRole, setActiveRole] = useState<'client' | 'driver' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileWithRetry = async (userId: string, retries = 3, delay = 500) => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (data) return data;
      if (error && error.code !== 'PGRST116') console.error('Error fetching profile:', error);
      console.log(`Profile not found yet. Retrying in ${delay}ms... (${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return null;
  };

  const fetchVehicles = async (driverId: string) => {
    const { data, error } = await supabase.from('vehicles').select('*').eq('driver_id', driverId);
    if (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
    return data || [];
  }

  const loadUserSession = async (session) => {
    const profile = await fetchProfileWithRetry(session.user.id);
    if (profile) {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        fullName: profile.full_name || 'No Name',
        role: profile.role,
        createdAt: new Date(profile.created_at)
      };
      setUser(user);

      // If user is only a client, set role. If driver, leave null to force selection.
      if (user.role === 'client') {
        setActiveRole('client');
      } else {
        setActiveRole(null); // Force choice for drivers
      }

      if (user.role === 'driver') {
        const vehicleData = await fetchVehicles(user.id);
        setVehicles(vehicleData);
        if (vehicleData.length > 0) {
          setActiveVehicle(vehicleData[0]); // Default to the first vehicle
        }
      }
    } else {
      await supabase.auth.signOut();
      setUser(null);
    }
  }

  useEffect(() => {
    const initSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await loadUserSession(session);
        }
      } catch (error) {
        console.error("Session init error:", error);
      } finally {
        setLoading(false);
      }
    };
    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setVehicles([]);
        setActiveVehicle(null);
        setActiveRole(null);
        setLoading(false);
        return;
      }
      if (session) {
        await loadUserSession(session);
        setLoading(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVehicles([]);
    setActiveVehicle(null);
    setActiveRole(null);
  };

  const switchActiveRole = (role: 'client' | 'driver') => {
    console.log(`AuthContext: switchActiveRole called with role: ${role}`);
    setActiveRole(role);
  };
  
  const addVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle]);
    if (!activeVehicle) {
      setActiveVehicle(vehicle);
    }
  }

  return (
    <AuthContext.Provider value={{ user, vehicles, activeVehicle, loading, activeRole, logout, setActiveVehicle, switchActiveRole, addVehicle }}>
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
