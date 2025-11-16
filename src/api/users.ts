import { supabase } from '../lib/supabase';
import { SavedAddress, EmergencyContact, UserPreferences } from '../types';

export const usersAPI = {
  async getSavedAddresses(userId: string): Promise<SavedAddress[]> {
    const { data, error } = await supabase
      .from('saved_addresses')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data.map((address) => ({
      id: address.id,
      userId: address.user_id,
      label: address.label,
      location: {
        lat: address.lat,
        lng: address.lng,
        address: address.address || undefined,
      },
    }));
  },

  async addSavedAddress(data: {
    userId: string;
    label: string;
    location: { lat: number; lng: number; address?: string };
  }): Promise<SavedAddress> {
    const { data: newAddressData, error } = await supabase
      .from('saved_addresses')
      .insert({
        user_id: data.userId,
        label: data.label,
        lat: data.location.lat,
        lng: data.location.lng,
        address: data.location.address,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: newAddressData.id,
      userId: newAddressData.user_id,
      label: newAddressData.label,
      location: {
        lat: newAddressData.lat,
        lng: newAddressData.lng,
        address: newAddressData.address || undefined,
      },
    };
  },

  async updateSavedAddress(addressId: string, updates: Partial<SavedAddress>): Promise<SavedAddress> {
    const { data: updatedAddressData, error } = await supabase
      .from('saved_addresses')
      .update({
        label: updates.label,
        lat: updates.location?.lat,
        lng: updates.location?.lng,
        address: updates.location?.address,
      })
      .eq('id', addressId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: updatedAddressData.id,
      userId: updatedAddressData.user_id,
      label: updatedAddressData.label,
      location: {
        lat: updatedAddressData.lat,
        lng: updatedAddressData.lng,
        address: updatedAddressData.address || undefined,
      },
    };
  },

  async deleteSavedAddress(addressId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      throw new Error(error.message);
    }
  },

  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data.map((contact) => ({
      id: contact.id,
      userId: contact.user_id,
      name: contact.name,
      phone: contact.phone,
    }));
  },

  async addEmergencyContact(data: {
    userId: string;
    name: string;
    phone: string;
  }): Promise<EmergencyContact> {
    const { data: newContactData, error } = await supabase
      .from('emergency_contacts')
      .insert({
        user_id: data.userId,
        name: data.name,
        phone: data.phone,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: newContactData.id,
      userId: newContactData.user_id,
      name: newContactData.name,
      phone: newContactData.phone,
    };
  },

  async updateEmergencyContact(
    contactId: string,
    updates: Partial<EmergencyContact>
  ): Promise<EmergencyContact> {
    const { data: updatedContactData, error } = await supabase
      .from('emergency_contacts')
      .update({
        name: updates.name,
        phone: updates.phone,
      })
      .eq('id', contactId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: updatedContactData.id,
      userId: updatedContactData.user_id,
      name: updatedContactData.name,
      phone: updatedContactData.phone,
    };
  },

  async deleteEmergencyContact(contactId: string): Promise<void> {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      throw new Error(error.message);
    }
  },

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      throw new Error(error.message);
    }

    if (data) {
      return {
        userId: data.user_id,
        language: data.language,
        notifications: {
          reminders: data.notifications_reminders,
          promotions: data.notifications_promotions,
          locationReminders: data.notifications_location_reminders,
        },
      };
    } else {
      // Create default preferences if none exist
      const defaultPreferences: UserPreferences = {
        userId,
        language: 'ro',
        notifications: {
          reminders: true,
          promotions: true,
          locationReminders: false,
        },
      };
      await this.updateUserPreferences(userId, defaultPreferences);
      return defaultPreferences;
    }
  },

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data: existingPreferences, error: fetchError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(fetchError.message);
    }

    const notifications = {
      reminders: updates.notifications?.reminders ?? existingPreferences?.notifications_reminders ?? true,
      promotions: updates.notifications?.promotions ?? existingPreferences?.notifications_promotions ?? true,
      locationReminders: updates.notifications?.locationReminders ?? existingPreferences?.notifications_location_reminders ?? false,
    };

    const updateData = {
      user_id: userId,
      language: updates.language ?? existingPreferences?.language ?? 'ro',
      notifications_reminders: notifications.reminders,
      notifications_promotions: notifications.promotions,
      notifications_location_reminders: notifications.locationReminders,
    };

    let result;
    if (existingPreferences) {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();
      result = data;
      if (error) throw new Error(error.message);
    } else {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert(updateData)
        .select()
        .single();
      result = data;
      if (error) throw new Error(error.message);
    }

    return {
      userId: result.user_id,
      language: result.language,
      notifications: {
        reminders: result.notifications_reminders,
        promotions: result.notifications_promotions,
        locationReminders: result.notifications_location_reminders,
      },
    };
  },
};
