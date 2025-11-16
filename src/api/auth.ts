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

    }): Promise<{ user: User; token: string | null; message?: string }> {

      const { data: authData, error: authError } = await supabase.auth.signUp({

        email: data.email,

        password: data.password,

      });

  

      if (authError) {

        throw new Error(authError.message);

      }

  

      if (!authData.user) {

        throw new Error('Registration failed: No user data');

      }

  

      const { error: profileError } = await supabase.from('profiles').insert({

        id: authData.user.id,

        full_name: data.fullName,

        phone: data.phone,

        role: 'client', // Default role for new registrations

        created_at: new Date().toISOString(),

      });

  

      if (profileError) {

        throw new Error(profileError.message);

      }

  

      const user: User = {

        id: authData.user.id,

        fullName: data.fullName,

        email: authData.user.email || '',

        phone: data.phone,

        role: 'client',

        profilePhoto: undefined,

        rating: undefined,

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
    // Update auth.users table for email/password changes
    const authUpdates: { email?: string; password?: string } = {};
    if (updates.email) authUpdates.email = updates.email;
    // Supabase doesn't allow direct password update via updateUser for security reasons,
    // it's usually handled via resetPasswordForEmail flow.
    // if (updates.password) authUpdates.password = updates.password;

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(authUpdates);
      if (authError) {
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
    } = {};
    if (updates.fullName) profileUpdates.full_name = updates.fullName;
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.role) profileUpdates.role = updates.role;
    if (updates.profilePhoto) profileUpdates.profile_photo = updates.profilePhoto;
    if (updates.rating) profileUpdates.rating = updates.rating;

    if (Object.keys(profileUpdates).length > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (profileError) {
        throw new Error(profileError.message);
      }

      if (!profileData) {
        throw new Error('User profile not found.');
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
    };

    localStorage.setItem('user', JSON.stringify(finalUser));
    return finalUser;
  },
};
