import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error('Login failed: No session or user data');
    }

    // Fetch profile information
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!profileData) {
      throw new Error('User profile not found.');
    }

    const user: User = {
      id: profileData.id,
      fullName: profileData.full_name,
      email: data.user.email || '',
      phone: profileData.phone,
      role: profileData.role,
      profilePhoto: profileData.profile_photo,
      rating: profileData.rating,
      createdAt: new Date(profileData.created_at),
    };

    localStorage.setItem('auth_token', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token: data.session.access_token };
  },

            async register(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'client' | 'driver';
}): Promise<{ user: User; token: string | null; message?: string }> {
  console.log('Attempting to sign up with:', data.email, 'as', data.role);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone,
        role: data.role,
      },
    },
  });

  if (authError) {
    console.error('Supabase signUp error:', JSON.stringify(authError, null, 2));
    throw new Error(`Auth Error: ${authError.message}`);
  }

  if (!authData.user) {
    console.warn('Supabase signUp returned no user data, but no error either.');
    throw new Error('Registration failed: No user data returned from Supabase.');
  }
  
  console.log('Sign up successful for user:', authData.user.id);

  const user: User = {
    id: authData.user.id,
    fullName: data.fullName,
    email: authData.user.email || '',
    phone: data.phone,
    role: data.role,
    createdAt: new Date(),
  };

  if (!authData.session) {
    return { user, token: null, message: 'Please check your email to confirm your registration.' };
  }

  localStorage.setItem('auth_token', authData.session.access_token);
  localStorage.setItem('user', JSON.stringify(user));

  return { user, token: authData.session.access_token };
},

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    if (!session) {
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    if (!profileData) {
      return null;
    }

    const user: User = {
      id: profileData.id,
      fullName: profileData.full_name,
      email: session.user.email || '',
      phone: profileData.phone,
      role: profileData.role,
      profilePhoto: profileData.profile_photo,
      rating: profileData.rating,
      createdAt: new Date(profileData.created_at),
    };

    localStorage.setItem('auth_token', session.access_token);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // You might want to configure this redirect URL
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Am trimis instrucțiuni de resetare a parolei pe email' };
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    console.log('[updateUser] Called with userId:', userId, 'and updates:', updates);

    // Update auth.users table for email/password changes
    const authUpdates: { email?: string; password?: string } = {};
    if (updates.email) authUpdates.email = updates.email;
    // Supabase doesn't allow direct password update via updateUser for security reasons,
    // it's usually handled via resetPasswordForEmail flow.
    // if (updates.password) authUpdates.password = updates.password;

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(authUpdates);
      if (authError) {
        console.error('[updateUser] Supabase auth update error:', authError);
        throw new Error(authError.message);
      }
    }

    // Update profiles table for other user details
    const profileUpdates: {
      full_name?: string;
      phone?: string;
      role?: UserRole;
      profile_photo?: string;
      rating?: number;
      is_online?: boolean;
      current_location_lat?: number;
      current_location_lng?: number;
    } = {};
    if (updates.fullName) profileUpdates.full_name = updates.fullName;
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.role) profileUpdates.role = updates.role;
    if (updates.profilePhoto) profileUpdates.profile_photo = updates.profilePhoto;
    if (updates.rating) profileUpdates.rating = updates.rating;
    if (updates.is_online !== undefined) profileUpdates.is_online = updates.is_online;
    if (updates.current_location_lat) profileUpdates.current_location_lat = updates.current_location_lat;
    if (updates.current_location_lng) profileUpdates.current_location_lng = updates.current_location_lng;

    console.log('[updateUser] Constructed profileUpdates:', profileUpdates);

    if (Object.keys(profileUpdates).length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (profileError) {
        console.error('[updateUser] Supabase profile update error:', profileError);
        throw new Error(profileError.message);
      }

      console.log('[updateUser] Supabase profile update successful:', profileData);

      if (!profileData) {
        throw new Error('User profile not found after update.');
      }

      const updatedUser: User = {
        id: profileData.id,
        fullName: profileData.full_name,
        email: updates.email || '', // Email might not be in profileData if not updated
        phone: profileData.phone,
        role: profileData.role,
        profilePhoto: profileData.profile_photo,
        rating: profileData.rating,
        createdAt: new Date(profileData.created_at),
        is_online: profileData.is_online,
        current_location_lat: profileData.current_location_lat,
        current_location_lng: profileData.current_location_lng,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }

    // If only auth.users fields were updated (e.g., email), we need to re-fetch the user to get the latest email
    const { data: { user: currentAuthUser }, error: getAuthUserError } = await supabase.auth.getUser();
    if (getAuthUserError) {
      throw new Error(getAuthUserError.message);
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!profileData) {
      throw new Error('User profile not found.');
    }

    const finalUser: User = {
      id: profileData.id,
      fullName: profileData.full_name,
      email: currentAuthUser?.email || '',
      phone: profileData.phone,
      role: profileData.role,
      profilePhoto: profileData.profile_photo,
      rating: profileData.rating,
      createdAt: new Date(profileData.created_at),
      is_online: profileData.is_online,
      current_location_lat: profileData.current_location_lat,
      current_location_lng: profileData.current_location_lng,
    };

    localStorage.setItem('user', JSON.stringify(finalUser));
    return finalUser;
  },
};
